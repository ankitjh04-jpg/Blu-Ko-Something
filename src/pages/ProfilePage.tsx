import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { Save, Edit } from "lucide-react";
import { NavigationHeader } from "../components/shared/NavigationHeader";
import { Notification } from "../components/shared/Notification";

interface UserProfile {
  full_name: string;
  email: string;
  phone: string | null;
  location: string | null;
  professional_summary: string | null;
}

export function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({
    full_name: "",
    email: "",
    phone: null,
    location: null,
    professional_summary: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const loadProfile = useCallback(async () => {
    if (!user) return;

    let { data: profileData } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (!profileData) {
      // Create a new profile if one doesn't exist
      const { data: newProfile } = await supabase
        .from("user_profiles")
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || "",
          phone: null,
          location: null,
          professional_summary: null,
          profile_completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      profileData = newProfile;
    }

    if (profileData) {
      setProfile({
        full_name: profileData.full_name || "",
        email: profileData.email || user.email || "",
        phone: profileData.phone,
        location: profileData.location,
        professional_summary: profileData.professional_summary,
      });
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user, loadProfile]);
  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          location: profile.location,
          professional_summary: profile.professional_summary,
          profile_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      setNotification({
        type: "success",
        message: "Profile updated successfully!",
      });
    } catch (error: unknown) {
      console.error("Error updating profile:", error);
      setNotification({
        type: "error",
        message: "Failed to update profile. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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
      <NavigationHeader />

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-[#003A6E] bg-opacity-50 backdrop-blur-lg border border-[#6A7B93] border-opacity-20 rounded-2xl p-8">
            <div className="flex items-start gap-6 mb-8">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1E4C80] to-[#FBC888] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {profile.full_name ? getInitials(profile.full_name) : "U"}
                </div>
                <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center cursor-pointer">
                  <Edit
                    className="opacity-0 group-hover:opacity-100 text-white"
                    size={20}
                  />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {profile.full_name || "User Profile"}
                </h2>
                <p className="text-[#A8B8CC] mb-4">{profile.email}</p>
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="flex items-center gap-2 bg-[#FBC888] hover:bg-[#FBC888]/90 text-[#002B5C] font-semibold px-6 py-2 rounded-lg transition-all duration-200 disabled:opacity-50"
                >
                  <Save size={18} />
                  <span>{saving ? "Saving..." : "Save All Changes"}</span>
                </button>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-6 border-b border-[#6A7B93] border-opacity-20 pb-2">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#A8B8CC] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.full_name}
                  onChange={(e) =>
                    setProfile({ ...profile, full_name: e.target.value })
                  }
                  className="w-full bg-[#1E4C80] bg-opacity-60 border border-[#6A7B93] border-opacity-30 rounded-lg text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FBC888]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#A8B8CC] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full bg-[#1E4C80] bg-opacity-30 border border-[#6A7B93] border-opacity-30 rounded-lg text-[#6A7B93] px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#A8B8CC] mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={profile.phone || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  className="w-full bg-[#1E4C80] bg-opacity-60 border border-[#6A7B93] border-opacity-30 rounded-lg text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FBC888]"
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#A8B8CC] mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={profile.location || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, location: e.target.value })
                  }
                  className="w-full bg-[#1E4C80] bg-opacity-60 border border-[#6A7B93] border-opacity-30 rounded-lg text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FBC888]"
                  placeholder="City, State"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#A8B8CC] mb-2">
                  Professional Summary
                </label>
                <textarea
                  value={profile.professional_summary || ""}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      professional_summary: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full bg-[#1E4C80] bg-opacity-60 border border-[#6A7B93] border-opacity-30 rounded-lg text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FBC888]"
                  placeholder="Brief summary of your professional background and skills..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
