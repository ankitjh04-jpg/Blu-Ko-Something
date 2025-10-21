import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { Dashboard } from "./pages/Dashboard";
import { ProfilePage } from "./pages/ProfilePage";
import { ChatbotPage } from "./pages/ChatbotPage";
import { ResumePage } from "./pages/ResumePage";
import { SharedResumePage } from "./pages/SharedResumePage";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#002B5C] via-[#003A6E] to-[#1E4C80] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/chatbot"
            element={
              <PrivateRoute>
                <ChatbotPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/resume"
            element={
              <PrivateRoute>
                <ResumePage />
              </PrivateRoute>
            }
          />
          <Route path="/shared-resume/:shareToken" element={<SharedResumePage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
