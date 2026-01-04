import { useState } from "react";
import { fetchImages, importImages } from "../services/api";
import "./ImagesPage.css";

function ImagesPage() {
  const [sessionImages, setSessionImages] = useState([]);
  const [allImages, setAllImages] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [folderUrl, setFolderUrl] = useState("");
  const [importStatus, setImportStatus] = useState(null);
  const [importing, setImporting] = useState(false);
  const [hasImported, setHasImported] = useState(false);

  const handleImport = async () => {
    if (!folderUrl.trim()) {
      setError("Please paste a Google Drive folder URL");
      return;
    }

    setImporting(true);
    setError(null);
    setImportStatus("Importing images...");
    setSessionImages([]);
    setShowAll(false);

    try {
      const result = await importImages(folderUrl);

      setImportStatus(
        `Imported: ${result.imported}, Skipped: ${result.skipped}`
      );

      setHasImported(true);

      const images = await fetchImages();
      setAllImages(images);

      if (result.imported > 0) {
        setSessionImages(images.slice(0, result.imported));
      } else {
        setSessionImages([]);
      }

      setFolderUrl("");
    } catch (err) {
      setError(err.message || "Import failed");
      setImportStatus(null);
    } finally {
      setImporting(false);
    }
  };

  const displayedImages = showAll ? allImages : sessionImages;

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

      {importStatus && (
        <div className="success">
          {importStatus}
          {importStatus.includes("Skipped") && (
            <div className="info">
              Skipped images already exist in the system (duplicate files).
            </div>
          )}
        </div>
      )}

      {error && <div className="error">Error: {error}</div>}

      {/* Toggle Button */}
      {hasImported && allImages.length > 0 && (
        <button
          className="toggle-btn"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "View Current Import" : "View All Imports"}
        </button>
      )}

      {/* Image Table */}
      {!hasImported ? (
        <p className="placeholder">
          Paste a Google Drive folder link and click <b>Import Images</b>.
        </p>
      ) : loading ? (
        <p className="placeholder">Loading images...</p>
      ) : displayedImages.length === 0 ? (
        <p className="placeholder">
          No new images were imported in this run.
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
              <th>Retries</th>
            </tr>
          </thead>
          <tbody>
            {displayedImages.map((img) => (
              <tr key={img.id}>
                <td>{img.id}</td>
                <td>{img.name}</td>
                <td>
                  {img.size
                    ? (img.size / (1024 * 1024)).toFixed(2)
                    : "-"}
                </td>
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