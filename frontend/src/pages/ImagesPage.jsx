import { useEffect, useState } from "react";
import { fetchImages } from "../services/api";
import "./ImagesPage.css";

function ImagesPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [folderUrl, setFolderUrl] = useState("");
  const [importStatus, setImportStatus] = useState(null);
  const [importing, setImporting] = useState(false);

  // Fetch images (used by polling)
  const loadImages = async () => {
    try {
      const data = await fetchImages();
      setImages(data);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to load images");
      setLoading(false);
    }
  };

  // Initial load + polling
  useEffect(() => {
    loadImages();

    const interval = setInterval(() => {
      loadImages();
    }, 2000);

    return () => clearInterval(interval);
  }, []);


  const handleImport = async () => {
    if (!folderUrl.trim()) {
      setError("Please paste a Google Drive folder URL");
      return;
    }

    setImporting(true);
    setImportStatus("Importing images...");
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/import/google-drive", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ folder_url: folderUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Import failed");
      }

      setImportStatus(
        `Imported: ${data.imported} | Skipped: ${data.skipped}`
      );

      loadImages();
      setFolderUrl("");
    } catch (err) {
      setError(err.message);
      setImportStatus(null);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="container">
      <h2>Image Import System</h2>

      {/* Import Section */}
      <div className="import-box">
        <input
          type="text"
          placeholder="Paste Google Drive folder URL"
          value={folderUrl}
          onChange={(e) => setFolderUrl(e.target.value)}
        />

        <button onClick={handleImport} disabled={importing}>
          {importing ? "Importing..." : "Import Images"}
        </button>
      </div>

      {importStatus && <div className="success">{importStatus}</div>}
      {error && <div className="error">Error: {error}</div>}

      {/* Images Table */}
      {loading ? (
        <p className="placeholder">Loading images...</p>
      ) : images.length === 0 ? (
        <p className="placeholder">No images imported yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Size (MlB)</th>
              <th>Type</th>
              <th>Status</th>
              <th>Retries</th>
            </tr>
          </thead>
          <tbody>
            {images.map((img) => (
              <tr key={img.id}>
                <td>{img.id}</td>
                <td>{img.name}</td>
                <td>{img.size ? (img.size /(1024 * 1024)).toFixed(2) + "MB" : "-"}</td>
                <td>{img.mime_type || "-"}</td>
                <td>
                  <span className={`status ${img.status}`}>
                    {img.status}
                  </span>
                </td>
                <td>{img.retry_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ImagesPage;