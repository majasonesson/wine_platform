import styles from '../../../../../styles/productionDetails.module.scss';

export const SparklingWineDetails = ({ wineData, translatedText }) => {
  if (!wineData?.productionDetails) return;

  const {
    primaryFermentation,
    secondaryFermentation,
    riddling,
    disgorgement,
    dosage,
    aging,
    pressure,
  } = wineData.productionDetails;

  console.log(wineData.productionDetails);
  

  const formatText = (text) => {
    if (!text) return '';
    return text
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const renderItem = (label, value, suffix = '') => (
    <div className={styles.productionItem}>
      <h3 className={styles.itemLabel}>{translatedText[label]}</h3>
      <div className={styles.processDetail}>
        <span className={styles.itemText}>
          {translatedText[formatText(value)] || formatText(value)} {translatedText[suffix]}
        </span>
      </div>
    </div>
  );

  return (
    <div className={styles.productionGrid}>
      {primaryFermentation && renderItem('Primary Fermentation', primaryFermentation)}
      {secondaryFermentation && renderItem('Secondary Fermentation (Méthode Champenoise)', secondaryFermentation, 'months')}
      {riddling && renderItem('Riddling Method', riddling)}
      {disgorgement && renderItem('Disgorgement Method', disgorgement)}
      {dosage && renderItem('Sugar Dosage', dosage)}
      {aging && renderItem('Aging', aging, 'months')}
      {pressure && renderItem('CO2 Pressure', pressure, 'CO2 Bars')}
    </div>
  );
};
