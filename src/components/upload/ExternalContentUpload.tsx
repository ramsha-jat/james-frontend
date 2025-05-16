import { useState } from "react";
import API from "@/lib/axios";

interface Post {
  title?: string;
  content: string;
  timestamp: string;
}

const ExternalContentUpload = () => {
  const [redditLink, setRedditLink] = useState("");
  const [telegramLink, setTelegramLink] = useState("");
  const [redditPosts, setRedditPosts] = useState<Post[]>([]);
  const [telegramPosts, setTelegramPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingReddit, setUploadingReddit] = useState(false);
  const [uploadingTelegram, setUploadingTelegram] = useState(false);

  const fetchContent = async (link: string, source: "reddit" | "telegram") => {
    if (!link.trim()) {
      alert(`Please paste a ${source} link!`);
      return;
    }

    try {
      setLoading(true);
      const response = await API.post("/fetch-content", { link });

      if (response.data && Array.isArray(response.data.posts)) {
        source === "reddit"
          ? setRedditPosts(response.data.posts)
          : setTelegramPosts(response.data.posts);
      } else {
        alert(`No ${source} content found!`);
        source === "reddit" ? setRedditPosts([]) : setTelegramPosts([]);
      }
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.detail || `Failed to fetch ${source} content!`);
    } finally {
      setLoading(false);
    }
  };

  const updateVectorstore = async (posts: Post[], source: "reddit" | "telegram") => {
    if (posts.length === 0) {
      alert(`No ${source} posts to update.`);
      return;
    }

    try {
      source === "reddit" ? setUploadingReddit(true) : setUploadingTelegram(true);
      const response = await API.post("/update-vectorstore-from-posts", { posts });
      alert(response.data.message || `${source} content added to vectorstore! 🎉`);
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.detail || `Error updating ${source} content.`);
    } finally {
      source === "reddit" ? setUploadingReddit(false) : setUploadingTelegram(false);
    }
  };

  return (
    <div className="bg-blue-50 rounded-lg p-6 space-y-10">
      <h3 className="text-2xl font-bold">Fetch External Content</h3>

      {/* Reddit Section */}
      <div className="space-y-4">
        <h4 className="text-xl font-semibold">Reddit</h4>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Paste Reddit link..."
            value={redditLink}
            onChange={(e) => setRedditLink(e.target.value)}
            className="flex-1 border border-gray-300 rounded p-2"
          />
          <button
            onClick={() => fetchContent(redditLink, "reddit")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Fetching..." : "Fetch"}
          </button>
        </div>

        {redditPosts.length > 0 && (
          <>
            <div className="space-y-4">
              {redditPosts.map((post, idx) => (
                <div key={idx} className="p-4 bg-white rounded shadow">
                  {post.title && <h5 className="text-lg font-bold">{post.title}</h5>}
                  <p className="text-gray-700">{post.content}</p>
                  <p className="text-gray-400 text-sm">{new Date(post.timestamp).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-6">
              <button
                onClick={() => updateVectorstore(redditPosts, "reddit")}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
                disabled={uploadingReddit}
              >
                {uploadingReddit ? "Updating..." : "Update Reddit Vectorstore"}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Telegram Section */}
      <div className="space-y-4">
        <h4 className="text-xl font-semibold">Telegram</h4>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Paste Telegram link..."
            value={telegramLink}
            onChange={(e) => setTelegramLink(e.target.value)}
            className="flex-1 border border-gray-300 rounded p-2"
          />
          <button
            onClick={() => fetchContent(telegramLink, "telegram")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Fetching..." : "Fetch"}
          </button>
        </div>

        {telegramPosts.length > 0 && (
          <>
            <div className="space-y-4">
              {telegramPosts.map((post, idx) => (
                <div key={idx} className="p-4 bg-white rounded shadow">
                  <p className="text-gray-700">{post.content}</p>
                  <p className="text-gray-400 text-sm">{new Date(post.timestamp).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-6">
              <button
                onClick={() => updateVectorstore(telegramPosts, "telegram")}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
                disabled={uploadingTelegram}
              >
                {uploadingTelegram ? "Updating..." : "Update Telegram Vectorstore"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExternalContentUpload;
