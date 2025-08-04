import { useEffect } from "react";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import { Routes, Route, Navigate } from "react-router-dom"; // Route to give specific route
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore";
import Footer from "./components/Footer";

function App() {
  const { authUser, checkAuth, isCheckingAuth, online_users } = useAuthStore();
  const { theme } = useThemeStore();
  console.log({ online_users });
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  console.log({ authUser });
  if (isCheckingAuth && !authUser) {
    // Lucide React Icon
    return (
      <div className="flex  items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }
  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <HomePage />}
        />
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>
      <Toaster />
      <Footer />
    </div>
  );
}

export default App;
