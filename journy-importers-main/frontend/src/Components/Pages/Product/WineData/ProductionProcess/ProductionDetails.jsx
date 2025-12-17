import {
  HandpickedIcon,
  OakBarrelIcon,
  StainlessIcon,
} from '../../../Producer/ProductionProcess/icons';
import styles from '../../../../../styles/productionDetails.module.scss';

export const ProductionDetails = ({ wineData, translatedText }) => {
  if (!wineData.productionDetails) return null;

  const {
    harvestMethod,
    fermentationProcess,
    agingProcess,
    agingMonths,
    grapeOrigin,
  } = wineData.productionDetails;

  // Helper function to format the text
  const formatText = (text) => {
    if (!text) return '';
    return text
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Helper function to get the appropriate icon
  const getIcon = (type, value) => {
    switch (value) {
      case 'handpicked':
        return <HandpickedIcon />;
      case 'oak':
      case 'oak_barrels':
        return <OakBarrelIcon />;
      case 'stainless':
        return <StainlessIcon />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{translatedText['Production Process']}</h2>

      <div className={styles.productionGrid}>
        {harvestMethod && (
          <div className={styles.productionItem}>
            <h3 className={styles.itemLabel}>{translatedText['Harvesting']}</h3>
            <div className={styles.processDetail}>
              {getIcon('harvest', harvestMethod)}
              <span className={styles.itemText}>
                {translatedText[harvestMethod]}
              </span>
            </div>
          </div>
        )}

        {fermentationProcess && (
          <div className={styles.productionItem}>
            <h3 className={styles.itemLabel}>
              {translatedText['Fermentation']}
            </h3>
            <div className={styles.processDetail}>
              {getIcon('fermentation', fermentationProcess)}
              <span className={styles.itemText}>
                {translatedText[fermentationProcess]}
              </span>
            </div>
          </div>
        )}

        {agingProcess && (
          <div className={styles.productionItem}>
            <h3 className={styles.itemLabel}>{translatedText['Aging']}</h3>
            <div className={styles.processDetail}>
              {getIcon('aging', agingProcess)}
              <span className={styles.itemText}>
                {translatedText[formatText(agingProcess)]}
                {agingMonths &&
                  agingProcess !== 'no_aging' &&
                  ` ${translatedText['for']} ${agingMonths} ${translatedText['months']}`}
              </span>
            </div>
          </div>
        )}

        {grapeOrigin && (
          <div className={styles.productionItem}>
            <h3 className={styles.itemLabel}>
              {translatedText['Origin of the grapes']}
            </h3>
            <div className={styles.processDetail}>
              <span className={styles.itemText}>
                {translatedText[formatText(grapeOrigin)]}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
