import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import CreateSetPage from "./pages/CreateSetPage";
import EditSetPage from "./pages/EditSetPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import SettingsPage from "./pages/SettingsPage";
import SearchPage from "./pages/SearchPage";
import StudySessionPage from "./pages/StudySessionPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/:username/dashboard" element={<Dashboard />} />
        <Route path="/:username/create-set" element={<CreateSetPage />} />
        <Route path="/:username/edit-set/:setId" element={<EditSetPage />} />
        <Route path="/:username/study-session/:setId" element={<StudySessionPage />} />
        <Route path="/:username/settings" element={<SettingsPage />} />
        <Route path="/:username/search" element={<SearchPage />} />
        <Route path="/:username" element={<ProfilePage />} />
        <Route path="/:username/edit" element={<EditProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
