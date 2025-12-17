import styles from '../../../../../styles/productPage2.module.scss';

export const NutritionDeclaration = ({ product, translatedText }) => {
  const getSulphiteCategory = (amount) => {
    if (!amount || amount === 0) return '';
    if (amount < 50)
      return `${translatedText['Low in sulphites']}: ${amount}${translatedText['mg/L']}`;
    if (amount <= 150)
      return `${translatedText['Moderate in sulphites']}: ${amount}${translatedText['mg/L']}`;
    if (amount <= 350)
      return `${translatedText['High in sulphites']}: ${amount}${translatedText['mg/L']}`;
    return `${amount}${translatedText['mg/L']}`;
  };

  const sulphiteContent = getSulphiteCategory(product.sulphites);

  return (
    <div className={styles.nutritionDeclaration}>
      <h2 className={styles.sectionTitle}>
        {translatedText['Nutrition Declaration']}
      </h2>
  
      <div className={styles.nutritionTable}>
        <div className={styles.headerRow}>
          <span className={styles.nutrientType}>{translatedText['Type']}</span>
          <span className={styles.nutrientPer100}>{translatedText['Per 100 ML']}</span>
        </div>
  
        <div className={styles.nutritionRow}>
          <span className={styles.nutritionLabel}>{translatedText['Energy']}</span>
          <span className={styles.nutritionValue}>
            {product.KJ} KJ / {product.Kcal} kcal
          </span>
        </div>
        <span className={styles.nutritionLine}></span>
        <div className={styles.nutritionRow}>
          <span className={styles.nutritionLabel}>{translatedText['Carbohydrates']}</span>
          <span className={styles.nutritionValue}>{product.Carbs} g</span>
        </div>
  
        <div className={styles.nutritionRow}>
          <span className={styles.nutritionLabel}>{translatedText['Of which Sugars']}</span>
          <span className={styles.nutritionValue}>{product.CarbsOfSugar} g</span>
        </div>
        <span className={styles.nutritionLine}></span>
        <div className={styles.nutritionFooter}>
          <small className={styles.footerText}>
            {translatedText['Contains small amounts of: Fat, Saturated fat, Protein, Salt']}
          </small>
        </div>
      </div>
    </div>
  );
  
};
