import { Home, User, MessageSquare, FileText, LogOut } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

export function NavigationHeader() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = location.pathname.substring(1) || "dashboard";

  const navItems = [
    { id: "dashboard" as const, label: "Dashboard", icon: Home },
    { id: "profile" as const, label: "My Profile", icon: User },
    { id: "chatbot" as const, label: "AI Assistant", icon: MessageSquare },
    { id: "resume" as const, label: "My Resumes", icon: FileText },
  ];

  return (
    <nav className="bg-[#003A6E] bg-opacity-50 backdrop-blur-lg border-b border-[#6A7B93] border-opacity-20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-white">
              Blu Ko: The AI Resume Builder
            </h1>
            <div className="hidden md:flex items-center gap-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() =>
                      navigate(`/${item.id === "dashboard" ? "" : item.id}`)
                    }
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-[#FBC888] text-[#002B5C] font-semibold"
                        : "text-white hover:bg-[#1E4C80] hover:text-[#FBC888]"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 bg-[#6A7B93] hover:bg-[#6A7B93]/80 text-white px-4 py-2 rounded-lg transition-all duration-200"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
        <div className="md:hidden flex items-center gap-2 mt-4 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() =>
                  navigate(`/${item.id === "dashboard" ? "" : item.id}`)
                }
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? "bg-[#FBC888] text-[#002B5C] font-semibold"
                    : "text-white hover:bg-[#1E4C80] hover:text-[#FBC888]"
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
