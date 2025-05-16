import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import AdminDashboardContent from "@/components/dashboard/AdminDashboardContent";

const AdminDashboardPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <AdminDashboardContent />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
