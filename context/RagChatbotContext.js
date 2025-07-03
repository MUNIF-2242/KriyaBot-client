
import React, { createContext, useState } from "react";
import { showToast } from "@/components/utils/swalUtils";

const BASE_URL = "http://localhost:20000/dev";
// const BASE_URL = "https://xpg0w4n6q6.execute-api.us-east-1.amazonaws.com/prod";

export const RagChatbotContext = createContext();

export const RagChatbotProvider = ({ children }) => {
  const [uploadPhase, setUploadPhase] = useState("idle");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedPdfResponse, setUploadPdfResponse] = useState(null);
  const [uploadedPdfUrl, setUploadedPdfUrl] = useState([]);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [botResponseLoading, setBotResponseLoading] = useState(false);
  const [versionCode, setVersionCode] = useState("");

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
    setUploadedPdfUrl([]);
    setError("");
    setUploadPhase("idle");
  };

  const handleMagicEnhanceTextBtnClick = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim()) {
      showToast("warning", "Please enter text to enhance.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/enhance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputMessage }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Enhancement failed");
      }

      const enhancedText = data.enhanced || "";
      setInputMessage(enhancedText);
      showToast("success", "Text enhanced successfully!");
    } catch (error) {
      console.error("❌ Enhance Text Error:", error);
      showToast("error", "Failed to enhance text", error.message);
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const question = inputMessage;
    setInputMessage("");

    const userMessage = { role: "user", content: question };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setBotResponseLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();
      console.log("Data.....")
      console.log(data)
      const botMessage = {
        role: "assistant",
        content: data.answer || "No answer found.",
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("❌ Error :", error);
      showToast("error", "Error during query submission", error.message);
    } finally {
      setBotResponseLoading(false);
    }
  };

  const triggerEmbeddingJob = async (pdfUrl,versionCode) => {
    try {
      const res = await fetch(`${BASE_URL}/index`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: pdfUrl,version:versionCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to index the PDF");
      }

      if (data.skipped) {
        showToast("error", "Already indexed. Skipped.");
      } else {
        showToast("success", "Document indexed successfully!");
      }
    } catch (error) {
      console.error("❌ Error during embedding:", error);
      showToast("error", "Embedding failed", error.message);
    }finally{
      setVersionCode("")
    }
  };

 const handlePdfUploadSubmit = async (e, versionCode) => {
  e.preventDefault();

  if (selectedFiles.length === 0) {
    alert("Please select at least one file.");
    return;
  }

  const formData = new FormData();
  selectedFiles.forEach((file) => {
    formData.append("files", file);
  });

  try {
    setLoading(true);
    setError("");
    setUploadedPdfUrl([]);
    setUploadPhase("uploading");

    const res = await fetch(`${BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setUploadPdfResponse(data);

    if (!res.ok || data.successfulUploads === 0) {
      setError(data.message || "Upload failed");
      setUploadPhase("idle");
      return;
    }

    const urls = data.files?.map((f) => f.s3Url).filter(Boolean) || [];
    setUploadedPdfUrl(urls);
    showToast("success", "PDF uploaded successfully!");

    setUploadPhase("indexing");

    for (let i = 0; i < urls.length; i++) {
      console.log(`📥 Indexing file ${i + 1} of ${urls.length}`);
      
      // ✅ Pass versionCode along with the URL
      await triggerEmbeddingJob(urls[i], versionCode);
    }
  } catch (err) {
    console.error("❌ Upload failed:", err);
    setError("Something went wrong while uploading");
  } finally {
    setLoading(false);
    setUploadPhase("idle");
  }
};


  const getButtonText = () => {
    switch (uploadPhase) {
      case "uploading":
        return "Uploading...";
      case "indexing":
        return `Indexing...`;
      default:
        return "Upload";
    }
  };

  return (
    <RagChatbotContext.Provider
      value={{
        uploadedPdfUrl,
        handlePdfUploadSubmit,
        loading,
        handleFileChange,
        error,
        uploadedPdfResponse,
        triggerEmbeddingJob,
        messages,
        handleQuestionSubmit,
        setInputMessage,
        botResponseLoading,
        inputMessage,
        getButtonText,
        handleMagicEnhanceTextBtnClick,
        setVersionCode,
        versionCode
      }}
    >
      {children}
    </RagChatbotContext.Provider>
  );
};
