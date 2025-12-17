import { boxStyle } from "../../../../../Utils/productsStyles";
import styles from '../../../../../styles/documentPP.module.scss';

export const Documents = ({
  product,
  translatedText
}) => {
  return (
    <div className={styles["documents-container"]} style={boxStyle}>
      <h2 className={styles["documents-title"]}>
        {translatedText['Documents']}
      </h2>

      {/* List of document links */}
      <ul className={styles["documents-list"]}>
        {product.Documents.split(',').map((url, index) => (
          <li key={index}>
            {/* Link to each document, opens in a new tab */}
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className={styles["document-link"]}
            >
              {decodeURIComponent(url.substring(url.lastIndexOf('-') + 1))}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
