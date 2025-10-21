import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import {
  LogOut,
  User,
  MessageSquare,
  FileText,
  CheckCircle,
  Circle,
} from "lucide-react";
import { useNavigate as useRouterNavigate } from "react-router-dom";

interface UserProfile {
  full_name: string;
  profile_completed: boolean;
  phone: string | null;
  location: string | null;
}

export function Dashboard() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useRouterNavigate();

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("user_profiles")
      .select("full_name, profile_completed, phone, location")
      .eq("id", user.id)
      .maybeSingle();

    if (!error && data) {
      setProfile(data);
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#002B5C] via-[#003A6E] to-[#1E4C80] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#002B5C] via-[#003A6E] to-[#1E4C80]">
      <nav className="bg-[#003A6E] bg-opacity-50 backdrop-blur-lg border-b border-[#6A7B93] border-opacity-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">
              Blu Ko: The AI Resume Builder
            </h1>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 bg-[#6A7B93] hover:bg-[#6A7B93]/80 text-white px-4 py-2 rounded-lg transition-all duration-200"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="bg-[#003A6E] bg-opacity-50 backdrop-blur-lg border border-[#6A7B93] border-opacity-20 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome back, {profile?.full_name || "User"}!
            </h2>
            <p className="text-[#A8B8CC]">
              Ready to build your professional resume? Let's get started.
            </p>
          </div>

          <div className="bg-[#003A6E] bg-opacity-50 backdrop-blur-lg border border-[#6A7B93] border-opacity-20 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                Profile Completion
              </h3>
              <div className="flex items-center gap-2">
                {profile?.profile_completed ? (
                  <>
                    <CheckCircle className="text-green-400" size={20} />
                    <span className="text-green-400 font-medium">Complete</span>
                  </>
                ) : (
                  <>
                    <Circle className="text-[#FBC888]" size={20} />
                    <span className="text-[#FBC888] font-medium">
                      Incomplete
                    </span>
                  </>
                )}
              </div>
            </div>
            <p className="text-[#A8B8CC] mb-6">
              {profile?.profile_completed
                ? "Your profile is complete! You can now generate your resume."
                : "Complete your profile to generate a professional resume."}
            </p>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3">
                <CheckCircle
                  className="text-green-400 flex-shrink-0"
                  size={18}
                />
                <span className="text-gray-200">Account created</span>
              </div>
              <div className="flex items-center gap-3">
                {profile?.phone ? (
                  <CheckCircle
                    className="text-green-400 flex-shrink-0"
                    size={18}
                  />
                ) : (
                  <Circle className="text-gray-500 flex-shrink-0" size={18} />
                )}
                <span className="text-gray-200">Contact information added</span>
              </div>
              <div className="flex items-center gap-3">
                {profile?.location ? (
                  <CheckCircle
                    className="text-green-400 flex-shrink-0"
                    size={18}
                  />
                ) : (
                  <Circle className="text-gray-500 flex-shrink-0" size={18} />
                )}
                <span className="text-gray-200">Location added</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <button
              onClick={() => navigate("/profile")}
              className="bg-[#003A6E] bg-opacity-50 backdrop-blur-lg border border-[#6A7B93] border-opacity-20 rounded-2xl p-8 hover:bg-opacity-70 transition-all duration-300 text-left group"
            >
              <div className="bg-[#1E4C80] w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <User className="text-[#FBC888]" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                My Profile
              </h3>
              <p className="text-[#A8B8CC] text-sm">
                Manage your personal information, work experience, and
                certifications.
              </p>
            </button>

            <button
              onClick={() => navigate("/chatbot")}
              className="bg-[#003A6E] bg-opacity-50 backdrop-blur-lg border border-[#6A7B93] border-opacity-20 rounded-2xl p-8 hover:bg-opacity-70 transition-all duration-300 text-left group"
            >
              <div className="bg-[#1E4C80] w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="text-[#FBC888]" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                AI Assistant
              </h3>
              <p className="text-[#A8B8CC] text-sm">
                Chat with our AI to gather information for your resume.
              </p>
            </button>

            <button
              onClick={() => navigate("/resume")}
              className="bg-[#003A6E] bg-opacity-50 backdrop-blur-lg border border-[#6A7B93] border-opacity-20 rounded-2xl p-8 hover:bg-opacity-70 transition-all duration-300 text-left group"
            >
              <div className="bg-[#1E4C80] w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="text-[#FBC888]" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                My Resumes
              </h3>
              <p className="text-[#A8B8CC] text-sm">
                View, edit, and download your professional resumes.
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
