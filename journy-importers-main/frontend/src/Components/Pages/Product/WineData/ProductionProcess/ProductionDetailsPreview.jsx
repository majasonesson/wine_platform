import {
  HandpickedIcon,
  OakBarrelIcon,
  StainlessIcon,
} from '../../../Producer/ProductionProcess/icons';
import styles from './productionDetailsPreview.module.scss';

export const ProductionDetailsPreview = ({ wineData, translatedText }) => {
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
        <div className={styles.row}>
          {harvestMethod && (
            <div className={styles.column}>
              <h3>{translatedText['Harvesting']}</h3>
              <div className={styles.processDetail}>
                {getIcon('harvest', harvestMethod)}
                <span>{translatedText[formatText(harvestMethod)]}</span>
              </div>
            </div>
          )}

          {fermentationProcess && (
            <div className={styles.column}>
              <h3>{translatedText['Fermentation']}</h3>
              <div className={styles.processDetail}>
                {getIcon('fermentation', fermentationProcess)}
                <span>{translatedText[formatText(fermentationProcess)]}</span>
              </div>
            </div>
          )}
        </div>

        <div className={styles.row}>
          {agingProcess && (
            <div className={styles.column}>
              <h3>{translatedText['Aging']}</h3>
              <div className={styles.processDetail}>
                {getIcon('aging', agingProcess)}
                <span>
                  {translatedText[formatText(agingProcess)]}
                  {agingMonths &&
                    agingProcess !== 'no_aging' &&
                    ` ${translatedText['for']} ${agingMonths} ${translatedText['months']}`}
                </span>
              </div>
            </div>
          )}

          {grapeOrigin && (
            <div className={styles.column}>
              <h3>{translatedText['Origin of the grapes']}</h3>
              <div className={styles.processDetail}>
                <span>{translatedText[formatText(grapeOrigin)]}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
