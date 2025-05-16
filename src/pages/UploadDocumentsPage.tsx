import FileUploadArea from "@/components/upload/FileUploadArea";
import ExternalContentUpload from "@/components/upload/ExternalContentUpload";

const UploadDocumentsPage = () => {
  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-2">Upload Documents</h2>
        <p className="text-gray-600 mb-6">
          Upload PDF, DOCX, Image, and Video files for AI analysis.
        </p>

        {/* File Upload Section */}
        <FileUploadArea />

        {/* External Content Section */}
        <div className="mt-10">
          <ExternalContentUpload />
        </div>
      </div>
    </div>
  );
};

export default UploadDocumentsPage;
