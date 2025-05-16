import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FaUpload, FaComments, FaPen } from "react-icons/fa";
import { Link } from "react-router-dom";
import API from "@/lib/axios"; 
import InitializeVectorStore from "../InitializeVectorStore";


interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

const AdminDashboardContent = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [docCount, setDocCount] = useState(0);
  const [queryCount, setQueryCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsersAndStats = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersList: User[] = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as User[];
        setUsers(usersList);
        setTotalUsers(usersList.length);

        const statsResponse = await API.get("/stats"); // fetch backend /stats
        setDocCount(statsResponse.data.document_count || 0);
        setQueryCount(statsResponse.data.query_count || 0);
        setPostCount(statsResponse.data.post_count || 0);
      } catch (error) {
        console.error("Error fetching users or stats", error);
      }
    };

    fetchUsersAndStats();
  }, []);

  // Filtered Users for Search
  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <>
      <InitializeVectorStore />
  
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-2">Welcome Admin</h2>
        <p className="text-gray-600 mb-4">
          Manage users, analyze stats, and control Defense AI system.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Registered Users</h3>
          <p className="text-4xl font-bold">{totalUsers}</p>
          <p className="text-gray-500 text-sm mt-2">Users in System</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Documents Uploaded</h3>
          <p className="text-4xl font-bold">{docCount}</p>
          <p className="text-gray-500 text-sm mt-2">Files in /docs</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">AI Queries</h3>
          <p className="text-4xl font-bold">{queryCount}</p>
          <p className="text-gray-500 text-sm mt-2">Questions Asked</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Posts Generated</h3>
          <p className="text-4xl font-bold">{postCount}</p>
          <p className="text-gray-500 text-sm mt-2">Social Media Posts</p>
        </div>
      </div>

      {/* Other Admin Actions */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow flex flex-col justify-between">
          <div>
            <h4 className="text-lg font-bold mb-2">Document Analysis</h4>
            <p className="text-gray-500 text-sm">Upload and review documents.</p>
          </div>
          <Link to="/document-analysis" className="mt-4 text-blue-600 flex items-center gap-2 hover:underline">
            <FaUpload /> Upload
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow flex flex-col justify-between">
          <div>
            <h4 className="text-lg font-bold mb-2">AI Assistant</h4>
            <p className="text-gray-500 text-sm">Chat with documents.</p>
          </div>
          <Link to="/assistant" className="mt-4 text-blue-600 flex items-center gap-2 hover:underline">
            <FaComments /> Ask
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow flex flex-col justify-between">
          <div>
            <h4 className="text-lg font-bold mb-2">Post Generator</h4>
            <p className="text-gray-500 text-sm">Create posts with AI.</p>
          </div>
          <Link to="/post-generator" className="mt-4 text-blue-600 flex items-center gap-2 hover:underline">
            <FaPen /> Generate
          </Link>
        </div>
      </div>

      {/* Registered Users */}
      <div className="bg-white p-6 rounded-lg shadow mt-10">
        <h3 className="text-xl font-bold mb-4">Registered Users</h3>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Full Name</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Email</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Role</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="px-4 py-2">{user.fullName}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2 capitalize">{user.role}</td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-6 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  );
};

export default AdminDashboardContent;
