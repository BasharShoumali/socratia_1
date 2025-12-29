import { useState } from "react";
import "./Homepage.css";

export default function Homepage() {
  const [file, setFile] = useState(null);
  const [vectorStoreId, setVectorStoreId] = useState("");
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function uploadFile() {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    console.log("FILE SELECTED:", file);

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      console.log("SENDING UPLOAD REQUEST...");

      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      console.log("UPLOAD RESPONSE STATUS:", res.status);

      const data = await res.json();
      console.log("UPLOAD RESPONSE JSON:", data);

      if (!res.ok || data.error) {
        alert("Upload failed: " + (data.error || "Unknown error"));
        setUploading(false);
        return;
      }

      // Success
      setVectorStoreId(data.vectorStoreId);
      setReply(data.firstMessage);

      console.log("UPLOAD SUCCESS → VectorStore:", data.vectorStoreId);
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      alert("Upload failed. Check console for details.");
    }

    setUploading(false);
  }

  async function sendMessage() {
    if (!vectorStoreId) {
      alert("Upload a file first.");
      return;
    }

    if (!message.trim()) return;

    setLoading(true);

    try {
      console.log("SENDING CHAT REQUEST...");

      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, vectorStoreId }),
      });

      console.log("CHAT RESPONSE STATUS:", res.status);

      const data = await res.json();
      console.log("CHAT RESPONSE JSON:", data);

      if (!res.ok || data.error) {
        alert("Chat failed: " + (data.error || "Unknown error"));
        setLoading(false);
        return;
      }

      setReply(data.reply);
    } catch (err) {
      console.error("CHAT ERROR:", err);
      alert("Chat failed. Check console for details.");
    }

    setLoading(false);
  }

  return (
    <div className="page-container">
      <h1 className="heading">Socratia Agent Tester</h1>

      {/* Upload Section */}
      <div className="card">
        <h2 className="card-title">📁 Upload Study Material</h2>

        <input
          type="file"
          className="file-input"
          onChange={(e) => {
            console.log("Input File Changed:", e.target.files[0]);
            setFile(e.target.files[0]);
          }}
        />

        <button className="btn" onClick={uploadFile} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload File"}
        </button>

        {vectorStoreId && (
          <p className="success-message">✔ File processed successfully</p>
        )}
      </div>

      {/* Chat Section */}
      <div className="card">
        <h2 className="card-title">💬 Ask Your Assistant</h2>

        <textarea
          className="textarea"
          placeholder="Ask something about the uploaded file..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button className="btn" onClick={sendMessage} disabled={loading}>
          {loading ? "Thinking..." : "Send"}
        </button>

        <div className="response-box">
          <h3>Response:</h3>
          <p>{reply}</p>
        </div>
      </div>
    </div>
  );
}
