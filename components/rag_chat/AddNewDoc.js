import React, { useContext, useState } from "react";
import { RagChatbotContext } from "@/context/RagChatbotContext";

const AddNewDoc = () => {
  const {
    handlePdfUploadSubmit,
    handleFileChange,
    error,
    loading,
    uploadPhase,
    indexingProgress,
    getButtonText,
    setVersionCode,
    versionCode,
  } = useContext(RagChatbotContext);

  // State for text input
  const [textContent, setTextContent] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Handle text content change
  const handleTextChange = (e) => {
    setTextContent(e.target.value);
  };

  // Handle text update submission
  const handleTextUpdate = async (e) => {
    e.preventDefault();
    if (!textContent.trim()) {
      alert("Please enter some text to update");
      return;
    }

    setIsUpdating(true);
    try {
      // Add your text update logic here
      // This could be a function from your context or a direct API call
      console.log("Updating text:", textContent);

      // Example: await updateTextContent(textContent);

      // Clear the textarea after successful update
      setTextContent("");
      alert("Text updated successfully!");
    } catch (error) {
      console.error("Error updating text:", error);
      alert("Failed to update text. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="col-xxl-12 col-md-5">
      {/* PDF Upload Section */}
      <div className="panel">
        <div className="panel-header">
          <h5>Admin</h5>
        </div>
        <div className="panel-body">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handlePdfUploadSubmit(e, versionCode);
            }}
          >
            <div className="row g-3">
              <div className="col-12">
                <p className="mb-2">Upload PDF</p>
                <input
                  className="form-control"
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleFileChange}
                  disabled={loading}
                />
              </div>
              <div className="col-12">
                <p className="mb-2">Knowledgebase Version</p>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Enter version code (e.g. v1, v2, v3)"
                  value={versionCode}
                  onChange={(e) => setVersionCode(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="col-12 d-flex justify-content-end">
                <div className="btn-box">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {getButtonText()}
                  </button>
                </div>
              </div>
            </div>
          </form>
          {/* Progress indicator for indexing */}
          {uploadPhase === "indexing" && (
            <div className="mt-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <small className="text-muted">Indexing documents...</small>
                <small className="text-muted">
                  {indexingProgress.current}/{indexingProgress.total}
                </small>
              </div>
              <div className="progress" style={{ height: "6px" }}>
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated"
                  role="progressbar"
                  style={{
                    width: `${
                      (indexingProgress.current / indexingProgress.total) * 100
                    }%`,
                  }}
                  aria-valuenow={indexingProgress.current}
                  aria-valuemin="0"
                  aria-valuemax={indexingProgress.total}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Text Input Section */}
      <>
        {/* <div className="panel-header">
          <h5>Answer Text Chunk</h5>
        </div> */}
        <div className="panel-body">
          <form onSubmit={handleTextUpdate}>
            <div className="row g-3">
              <div className="col-12">
                <p className="mb-2">Question</p>

                <textarea
                  className="form-control mb-2"
                  rows="2"
                  placeholder="Enter your text content here..."
                  value={textContent}
                  onChange={handleTextChange}
                  disabled={isUpdating}
                />
                <p className="mb-2">Answer</p>
                <textarea
                  className="form-control mb-2"
                  rows="5"
                  placeholder="Enter your text content here..."
                  value={textContent}
                  onChange={handleTextChange}
                  disabled={isUpdating}
                />
                <p className="mb-2">URL</p>
                <textarea
                  className="form-control mb-2"
                  rows="1"
                  placeholder="Enter your text content here..."
                  value={textContent}
                  onChange={() => {}}
                  disabled={isUpdating}
                />
                <p className="mb-2">Knowledgebase Version</p>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Enter version code (e.g. v1, v2, v3)"
                  value={versionCode}
                  onChange={(e) => setVersionCode(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="col-12 d-flex justify-content-end">
                <div className="btn-box">
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={isUpdating || !textContent.trim()}
                  >
                    {isUpdating ? "Updating..." : "Update Text"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </>

      {/* Error Display */}
      {error && (
        <div className="panel mt-4">
          <div className="panel-header">
            <h5>Error</h5>
          </div>
          <div className="panel-body">
            <div className="bg-danger-subtle p-3 rounded">{error}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddNewDoc;
