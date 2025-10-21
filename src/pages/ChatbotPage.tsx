import { useEffect, useState } from "react";
import { NavigationHeader } from "../components/shared/NavigationHeader";
import { useAuth } from "../contexts/AuthContext";
import { resumeDataService } from "../services/resumeDataService";
import { Notification } from "../components/shared/Notification";
import { useNavigate } from "react-router-dom";

interface BotpressConfig {
  botId: string;
  configuration: {
    version: string;
    composerPlaceholder: string;
    botName: string;
    botAvatar: string;
    botDescription: string;
    fabImage: string;
    website: object;
    email: object;
    phone: object;
    termsOfService: object;
    privacyPolicy: object;
    color: string;
    variant: string;
    headerVariant: string;
    themeMode: string;
    fontFamily: string;
    radius: number;
    feedbackEnabled: boolean;
    footer: string;
    allowFileUpload: boolean;
    soundEnabled: boolean;
    proactiveMessageEnabled: boolean;
    proactiveBubbleMessage: string;
    proactiveBubbleTriggerType: string;
    proactiveBubbleDelayTime: number;
  };
  clientId: string;
  selector: string;
}

interface Botpress {
  init: (config: BotpressConfig) => void;
  on: (event: string, callback: (data?: any) => void) => void;
  open: () => void;
  close: () => void;
  sendEvent: (event: { type: string; payload?: any }) => void;
}

declare global {
  interface Window {
    botpress: Botpress;
    handleBotpressResumeData?: (data: any) => void;
  }
}
import {
  MessageSquare,
  ClipboardList,
  FileEdit,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { VideoPlayer } from "../components/shared/VideoPlayer";

export function ChatbotPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveResume = async () => {
    if (!user) {
      setNotification({
        message: "Please log in to save your resume",
        type: "error",
      });
      return;
    }

    setIsSaving(true);

    const resumeData = resumeDataService.getResumeData();
    if (!resumeData) {
      setNotification({
        message: "Please complete the chatbot conversation first",
        type: "error",
      });
      setIsSaving(false);
      return;
    }

    const validation = resumeDataService.validateResumeData(resumeData);
    if (!validation.valid) {
      setNotification({
        message: `Incomplete data: ${validation.errors.join(", ")}`,
        type: "error",
      });
      setIsSaving(false);
      return;
    }

    const title = `Resume - ${new Date().toLocaleDateString()}`;
    const result = await resumeDataService.saveResumeToDatabase(user.id, title);

    if (result.success) {
      setNotification({
        message: "Resume saved successfully! Redirecting to My Resumes...",
        type: "success",
      });
      setTimeout(() => {
        navigate("/resume");
      }, 2000);
    } else {
      setNotification({
        message: result.error || "Failed to save resume",
        type: "error",
      });
    }

    setIsSaving(false);
  };

  useEffect(() => {
    window.handleBotpressResumeData = (data: any) => {
      try {
        const parsedData = resumeDataService.parseBotpressData(data);
        resumeDataService.saveResumeData(parsedData);
        setNotification({
          message: "Resume data collected! Click 'Save Resume' to save it.",
          type: "success",
        });
      } catch (error) {
        console.error("Error processing Botpress data:", error);
        setNotification({
          message: "Error processing resume data",
          type: "error",
        });
      }
    };

    const script = document.createElement("script");
    script.src = "https://cdn.botpress.cloud/webchat/v3.3/inject.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.botpress?.init({
        botId: "5855b006-ca7d-45d4-868d-7026b2cc866f",
        configuration: {
          version: "v2",
          composerPlaceholder: "Say Hi !",
          botName: "Blu Ko",
          botAvatar:
            "https://files.bpcontent.cloud/2025/10/21/14/20251021141629-75PSB8C0.png",
          botDescription: "AI Powered Resume Builder",
          fabImage:
            "https://files.bpcontent.cloud/2025/10/21/14/20251021141614-MOS0MXHX.png",
          website: {},
          email: {},
          phone: {},
          termsOfService: {},
          privacyPolicy: {},
          color: "#6e56cf",
          variant: "soft",
          headerVariant: "solid",
          themeMode: "dark",
          fontFamily: "AR One Sans",
          radius: 4,
          feedbackEnabled: true,
          footer: "[⚡ by Botpress](https://botpress.com/?from=webchat)",
          allowFileUpload: true,
          soundEnabled: false,
          proactiveMessageEnabled: false,
          proactiveBubbleMessage: "Hi! 👋 Need help?",
          proactiveBubbleTriggerType: "afterDelay",
          proactiveBubbleDelayTime: 10,
        },
        clientId: "e025024d-603c-4206-9733-f8ba24a9f4ca",
        selector: "#webchat",
      });

      window.botpress?.on("webchat:ready", () => {
        window.botpress?.open();
      });

      window.botpress?.on("message", (data: any) => {
        if (data?.payload?.type === "resume_complete") {
          if (window.handleBotpressResumeData) {
            window.handleBotpressResumeData(data.payload.data);
          }
        }
      });
    };

    const style = document.createElement("style");
    style.innerHTML = `
      #webchat .bpWebchat {
        position: unset !important;
        width: 100% !important;
        height: 100% !important;
        max-height: 100% !important;
        max-width: 100% !important;
      }
      #webchat .bpFab {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      delete window.handleBotpressResumeData;
      document.body.removeChild(script);
      document.head.removeChild(style);
      try {
        window.botpress?.close();
      } catch {
        // Ignore cleanup errors if botpress is not initialized
      }
    };
  }, [user]);

  const hasResumeData = resumeDataService.isResumeReady();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#002B5C] via-[#003A6E] to-[#1E4C80] flex flex-col">
      <NavigationHeader />
      <div className="flex-1 container mx-auto px-4 py-8">
        {hasResumeData && (
          <div className="mb-6 bg-[#003A6E] bg-opacity-50 backdrop-blur-lg border border-[#FBC888] border-opacity-50 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={24} className="text-[#FBC888]" />
                <div>
                  <h3 className="text-white font-semibold">Resume Data Ready</h3>
                  <p className="text-[#A8B8CC] text-sm">
                    Your information has been collected. Save it to your resumes.
                  </p>
                </div>
              </div>
              <button
                onClick={handleSaveResume}
                disabled={isSaving}
                className="bg-[#FBC888] hover:bg-[#FBC888]/90 text-[#002B5C] font-semibold px-6 py-2 rounded-lg transition-all duration-200 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Resume"}
              </button>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#003A6E] bg-opacity-50 backdrop-blur-lg border border-[#6A7B93] border-opacity-20 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                How It Works
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 text-white">
                  <div className="bg-[#1E4C80] p-3 rounded-lg">
                    <MessageSquare size={24} className="text-[#FBC888]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Chat with AI</h3>
                    <p className="text-[#A8B8CC] text-sm">
                      Start a conversation with our AI assistant to discuss your
                      experience and skills.
                    </p>
                  </div>
                </div>
                <div className="w-0.5 h-6 bg-[#6A7B93] bg-opacity-20 mx-auto"></div>
                <div className="flex items-start gap-4 text-white">
                  <div className="bg-[#1E4C80] p-3 rounded-lg">
                    <ClipboardList size={24} className="text-[#FBC888]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Answer Questions</h3>
                    <p className="text-[#A8B8CC] text-sm">
                      The AI will ask relevant questions about your work history
                      and qualifications.
                    </p>
                  </div>
                </div>
                <div className="w-0.5 h-6 bg-[#6A7B93] bg-opacity-20 mx-auto"></div>
                <div className="flex items-start gap-4 text-white">
                  <div className="bg-[#1E4C80] p-3 rounded-lg">
                    <FileEdit size={24} className="text-[#FBC888]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Review Information</h3>
                    <p className="text-[#A8B8CC] text-sm">
                      Verify and edit the collected information before it's
                      added to your profile.
                    </p>
                  </div>
                </div>
                <div className="w-0.5 h-6 bg-[#6A7B93] bg-opacity-20 mx-auto"></div>
                <div className="flex items-start gap-4 text-white">
                  <div className="bg-[#1E4C80] p-3 rounded-lg">
                    <FileText size={24} className="text-[#FBC888]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Generate Resume</h3>
                    <p className="text-[#A8B8CC] text-sm">
                      Your information will be automatically formatted into a
                      professional resume.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#003A6E] bg-opacity-50 backdrop-blur-lg border border-[#6A7B93] border-opacity-20 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Tips</h2>
              <ul className="space-y-3 text-[#A8B8CC]">
                <li className="flex items-start gap-3">
                  <CheckCircle2
                    size={20}
                    className="text-[#FBC888] flex-shrink-0 mt-1"
                  />
                  <span>
                    Be specific about your job responsibilities and achievements
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2
                    size={20}
                    className="text-[#FBC888] flex-shrink-0 mt-1"
                  />
                  <span>Include relevant certifications and licenses</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2
                    size={20}
                    className="text-[#FBC888] flex-shrink-0 mt-1"
                  />
                  <span>
                    Mention specific tools and equipment you're experienced with
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2
                    size={20}
                    className="text-[#FBC888] flex-shrink-0 mt-1"
                  />
                  <span>
                    Don't hesitate to ask the AI to explain or rephrase
                    questions
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div
              className="bg-[#003A6E] bg-opacity-50 backdrop-blur-lg border border-[#6A7B93] border-opacity-20 rounded-2xl p-6"
              style={{ height: "calc(100vh - 180px)" }}
            >
              <h2 className="text-2xl font-bold text-white mb-4">Watch Demo</h2>
              <div className="h-[calc(100%-140px)]">
                {" "}
                {/* Adjust height to account for header and description */}
                <VideoPlayer
                  videoUrl="/demo-video.mp4"
                  title="How to use the AI Assistant"
                />
              </div>
              <p className="text-[#A8B8CC] mt-4 text-sm">
                Watch this short demo to see how our AI Assistant helps you
                create a professional resume step by step.
              </p>
            </div>
          </div>
        </div>
      </div>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
