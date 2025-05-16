import { useState } from "react";
import API from "@/lib/axios"; // Your axios setup
import DocumentChat from "./DocumentChat";


const DocumentAnalysis = () => {
  const [file, setFile] = useState<File | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await API.post("/analyze_document", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSessionId(res.data.session_id);
      setSummary(res.data.summary);
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.detail || "Error analyzing document");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Document Analysis</h2>
      <p className="text-gray-600">Upload a document to analyze and chat with it!</p>

      <div className="flex flex-col space-y-4">
        <input
          type="file"
          onChange={handleFileChange}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleUploadAndAnalyze}
          disabled={!file || loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {loading ? "Analyzing..." : "Analyze Document"}
        </button>
      </div>

      {summary && (
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h3 className="text-xl font-bold mb-2">Summary:</h3>
          <div
            className="text-gray-700 space-y-2"
            dangerouslySetInnerHTML={{ __html: summary }}
          />
        </div>
      )}

      {sessionId && <DocumentChat sessionId={sessionId} />}
    </div>
  );
};

export default DocumentAnalysis;
