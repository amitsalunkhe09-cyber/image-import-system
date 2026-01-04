import { useState } from "react";
import { fetchImages, importImages } from "../services/api";
import { getUserId } from "../lib/user";
import "./ImagesPage.css";

function ImagesPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [folderUrl, setFolderUrl] = useState("");
  const [importStatus, setImportStatus] = useState(null);
  const [importing, setImporting] = useState(false);

  const handleImport = async () => {
    if (!folderUrl.trim()) {
      setError("Please paste a Google Drive folder URL");
      return;
    }

    const userId = getUserId();
    setImporting(true);
    setError(null);
    setImportStatus("Importing images...");
    setImages([]);

    try {
      const result = await importImages(folderUrl, userId);

      setImportStatus(
        `Imported: ${result.imported}, Skipped: ${result.skipped}`
      );

      setLoading(true);
      const data = await fetchImages();
      setImages(data);
      setLoading(false);

      setFolderUrl("");
    } catch (err) {
      setError(err.message || "Import failed");
      setImportStatus(null);
      setLoading(false);
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

      {/* Import Status */}
      {importStatus && <div className="success">{importStatus}</div>}

      {importStatus && importStatus.includes("Skipped") && (
        <div className="info">
          Some images were skipped because they already exist in the system.
        </div>
      )}

      {error && <div className="error">Error: {error}</div>}

      {/* Images Table */}
      {loading ? (
        <p className="placeholder">Loading images...</p>
      ) : images.length === 0 ? (
        <p className="placeholder">
          Paste a Google Drive folder link and click <b>Import Images</b>.
        </p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Size (MB)</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {images.map((img) => (
              <tr key={img.id}>
                <td>{img.id}</td>
                <td>{img.name}</td>
                <td>
                  {img.size
                    ? (img.size / (1024 * 1024)).toFixed(2)
                    : "-"}
                </td>
                <td>{img.mime_type || "-"}</td>
                <td>{img.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ImagesPage;