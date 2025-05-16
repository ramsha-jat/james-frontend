import { FaRegChartBar, FaUpload, FaComments, FaPen, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear(); // Optional: clear any saved tokens or data
      navigate("/login");   // Redirect to login page
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="w-64 bg-blue-900 text-white flex flex-col justify-between min-h-screen p-6">
      <div>
        <h2 className="text-2xl font-bold mb-10">Defense AI</h2>
        <div className="space-y-4">
          <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Main</div>
          <button className="flex items-center gap-3 text-white hover:text-blue-300" onClick={() => navigate("/user/dashboard")}>
            <FaRegChartBar /> Dashboard
          </button>
          <button className="flex items-center gap-3 text-white hover:text-blue-300" onClick={() => navigate("/upload")}>
            <FaUpload /> Upload Documents
          </button>
          <button className="flex items-center gap-3 text-white hover:text-blue-300" onClick={() => navigate("/assistant")}>
            <FaComments /> AI Assistant
          </button>
          <button className="flex items-center gap-3 text-white hover:text-blue-300" onClick={() => navigate("/post-generator")}>
            <FaPen /> Post Generator
          </button>

          <div className="text-xs uppercase tracking-wider text-gray-400 mt-8 mb-2">Other</div>
          <button className="flex items-center gap-3 text-white hover:text-blue-300" onClick={() => navigate("/settings")}>
            <FaCog /> Settings
          </button>
          <button className="flex items-center gap-3 text-white hover:text-blue-300" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
      <div className="text-gray-400 text-xs mt-10">
        Defense AI Chat v1.0
      </div>
    </div>
  );
};

export default Sidebar;
