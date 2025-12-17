import styles from '../../../../../styles/document.module.scss';

export const UploadDocument = ({ 
  documents,
  setDocuments,
  translatedText
}) => {

  // Handle file selection and update the documents state
  const handleFileChange = (e) => {
    setDocuments([...documents, ...Array.from(e.target.files)]); // Append selected files to the current document list
  };

  // Handle the removal of a specific document from the documents list
  const handleRemove = (document) => {
    setDocuments(
      documents.filter((doc) => {
        if (typeof doc === 'string') {
          return doc !== document; // Compare the URL string directly
        } else {
          return doc.name !== document; // Compare the file name
        }
      })
    );
  };

  // Function to extract the file name from a URL
  const extractFileNameFromUrl = (url) => {
    try {
      const decodedUrl = decodeURIComponent(url);
      const lastSlashIndex = decodedUrl.lastIndexOf('/');
      const queryIndex = decodedUrl.indexOf('?');
      return decodedUrl.substring(
        lastSlashIndex + 15,
        queryIndex > -1 ? queryIndex : undefined
      );
    } catch (error) {
      console.error('Error extracting file name from URL:', error);
      return translatedText['Unknown file'];
    }
  };

  return (
    <div className={styles.uploadDocument}>
      <h3 className={styles.title}>{translatedText['Document']}</h3>
      <div className={styles.uploadWrapper}>
        <input
          type='file'
          id='fileInput'
          onChange={(e) => handleFileChange(e)}
          multiple
          className={styles.hiddenInput}
        />
        <label htmlFor='fileInput' className={styles.uploadLabel}>
          <img
            src={'/assets/Images/uploadFile.svg'}
            alt={translatedText['Click to upload file']}
            className={styles.uploadImage}
          />
        </label>
      </div>

      {/* Display the list of uploaded documents */}
      {documents.map((doc, index) => (
        <div key={index} className={styles.documentItem}>
          <span className={styles.documentName}>
            {typeof doc === 'string'
              ? extractFileNameFromUrl(doc) // Extract the file name from the URL if it's a string
              : doc.name}{' '}
            {/* Display the file name directly if it's an object */}
          </span>{' '}
          {/* Remove selected document */}
          <button
            onClick={() =>
              handleRemove(typeof doc === 'string' ? doc : doc.name)
            }
            className={styles.removeButton}
          >
            X
          </button>
        </div>
      ))}
    </div>
  );
};
