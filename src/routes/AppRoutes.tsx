import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupPage from "@/pages/SignupPage";
import LoginPage from "@/pages/LoginPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage"; // ✅ Import
import UserDashboardPage from "@/pages/UserDashboardPage"; // ✅ Import
import UploadDocumentsPage from "@/pages/UploadDocumentsPage";
import AssistantPage from "@/pages/assistant";
import PostGeneratorPage from "@/pages/PostGeneratorPage";
import DocumentAnalysis from "@/pages/DocumentAnalysis";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} /> {/* ✅ */}
      <Route path="/user/dashboard" element={<UserDashboardPage />} /> {/* ✅ */}
      <Route path="/upload" element={<UploadDocumentsPage />} />
      <Route path="/assistant" element={<AssistantPage />} />
      <Route path="/post-generator" element={<PostGeneratorPage />} />
      <Route path="/document-analysis" element={<DocumentAnalysis />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
