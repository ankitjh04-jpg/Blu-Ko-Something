import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface PersonalInfo {
  name: string;
  email: string;
  phone?: string;
  location?: string;
}

interface WorkExperience {
  jobTitle: string;
  companyName: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
}

interface Education {
  institutionName: string;
  degreeOrProgram: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
}

interface ResumePayload {
  userId: string;
  title: string;
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  skills: string[];
  education: Education[];
  status?: string;
}

Deno.serve(async (req: Request) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload: ResumePayload = await req.json();

    if (!payload.userId || !payload.title || !payload.personalInfo) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: userId, title, personalInfo" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const estimatedSize = new Blob([JSON.stringify(payload)]).size;
    const fileSizeKB = (estimatedSize / 1024).toFixed(2);

    const { data: resume, error } = await supabase
      .from("resumes")
      .insert({
        user_id: payload.userId,
        title: payload.title,
        resume_name: payload.title,
        template_name: "botpress",
        resume_data: payload,
        personal_info: payload.personalInfo,
        work_experience: payload.workExperience || [],
        skills: payload.skills || [],
        education: payload.education || [],
        status: payload.status || "complete",
        file_size: `${fileSizeKB} KB`,
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to save resume", details: error.message }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Resume saved successfully",
        resumeId: resume.id,
        shareToken: resume.share_token,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
