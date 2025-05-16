import { useEffect } from "react";
import API from "@/lib/axios";

const InitializeVectorStore = () => {
  useEffect(() => {
    const initialize = async () => {
      try {
        const response = await API.post("/initialize");
        console.log(" Vectorstore initialized:", response.data.message);
      } catch (error: any) {
        console.error("Vectorstore init failed:", error.response?.data?.detail || error.message);
      }
    };

    initialize();
  }, []);

  return null;
};

export default InitializeVectorStore;
