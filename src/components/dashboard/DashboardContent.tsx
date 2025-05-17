import { useEffect, useState } from "react";
import { FaUpload, FaComments, FaPen } from "react-icons/fa";
import { Link } from "react-router-dom";
import API from "@/lib/axios";

const UserDashboardContent = () => {
  const [queryCount, setQueryCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [docCount, setDocCount] = useState(0);
  const [analysisCount, setAnalysisCount] = useState(0);

  useEffect(() => {
    const initializeVectorstore = async () => {
      try {
        await API.post("/initialize");
        console.log("Vectorstore initialized");
      } catch (error) {
        console.error("Failed to initialize vectorstore", error);
      }
    };

    const fetchStats = async () => {
      try {
        const response = await API.get("/stats");
        setDocCount(response.data.document_count || 0);
        setQueryCount(response.data.assistant_queries || 0);
        setPostCount(response.data.post_count || 0);
        setAnalysisCount(response.data.document_analysis || 0);
      } catch (error) {
        console.error("Error fetching stats", error);
      }
    };

    initializeVectorstore();
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* ✅ Welcome message */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-2">Welcome to Defense AI</h2>
        <p className="text-gray-600">Your assistant for defense analysis and document insights.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Documents in Database</h3>
          <p className="text-4xl font-bold">{docCount}</p>
          <p className="text-sm text-gray-500 mt-2">Total documents in FAISS</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">AI Assistant Queries</h3>
          <p className="text-4xl font-bold">{queryCount}</p>
          <p className="text-sm text-gray-500 mt-2">Times AI Assistant was used</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Document Analysis</h3>
          <p className="text-4xl font-bold">{analysisCount}</p>
          <p className="text-sm text-gray-500 mt-2">Documents analyzed</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Posts Generated</h3>
          <p className="text-4xl font-bold">{postCount}</p>
          <p className="text-sm text-gray-500 mt-2">AI-generated posts</p>
        </div>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow flex flex-col justify-between">
          <div>
            <h4 className="text-lg font-bold mb-2">Analyze Docs</h4>
            <p className="text-gray-500 text-sm">Upload and summarize your defense documents.</p>
          </div>
          <Link to="/document-analysis" className="mt-4 text-blue-600 flex items-center gap-2 hover:underline">
            <FaUpload /> Start
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow flex flex-col justify-between">
          <div>
            <h4 className="text-lg font-bold mb-2">AI Assistant</h4>
            <p className="text-gray-500 text-sm">Get smart insights from your data with AI.</p>
          </div>
          <Link to="/assistant" className="mt-4 text-blue-600 flex items-center gap-2 hover:underline">
            <FaComments /> Ask
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow flex flex-col justify-between">
          <div>
            <h4 className="text-lg font-bold mb-2">Generate Post</h4>
            <p className="text-gray-500 text-sm">Create strategic content using AI.</p>
          </div>
          <Link to="/post-generator" className="mt-4 text-blue-600 flex items-center gap-2 hover:underline">
            <FaPen /> Create
          </Link>
        </div>
      </div>

      {/* ➕ New card for Upload Docs */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-lg shadow flex flex-col justify-between">
          <div>
            <h4 className="text-lg font-bold mb-2">Upload Docs</h4>
            <p className="text-gray-500 text-sm">Add new documents to your knowledge base.</p>
          </div>
          <Link to="/upload" className="mt-4 text-blue-600 flex items-center gap-2 hover:underline">
            <FaUpload /> Upload
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardContent;
