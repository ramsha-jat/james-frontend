import { useState } from "react";
import API from "@/lib/axios";  // your axios wrapper

const PostGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [postType, setPostType] = useState("blog");
  const [tone, setTone] = useState("professional");
  const [generatedPost, setGeneratedPost] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt!");
      return;
    }

    try {
      setLoading(true);
      const response = await API.post("/generate_post", {
        prompt,
        post_type: postType,
        tone,
      });

      setGeneratedPost(response.data.content);
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.detail || "Failed to generate post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">AI Post Generator</h2>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your post idea here..."
        rows={4}
        className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex space-x-4">
        <select
          value={postType}
          onChange={(e) => setPostType(e.target.value)}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="blog">Blog</option>
          <option value="social_post">Social Post</option>
          <option value="news_article">News Article</option>
        </select>

        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="professional">Professional</option>
          <option value="casual">Casual</option>
          <option value="aggressive">Aggressive</option>
          <option value="motivational">Motivational</option>
        </select>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {loading ? "Generating..." : "Generate Post"}
        </button>
      </div>

      {generatedPost && (
        <div className="bg-white p-4 rounded shadow mt-6">
          <h3 className="text-xl font-bold mb-2">Generated Post</h3>
          <p className="whitespace-pre-line">{generatedPost}</p>
        </div>
      )}
    </div>
  );
};

export default PostGenerator;
