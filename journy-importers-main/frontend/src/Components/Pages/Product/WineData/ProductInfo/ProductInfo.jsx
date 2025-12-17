import styles from './ProductInfo.module.scss';

/* This component displays the product information of wine product. */
export const ProductInfo = ({ product, translatedText }) => {
  const getGrapeText = (grape, percentage, translatedText) => {
    if (!grape) return null;

    // Get translated grape name or fallback to raw name
    const translatedGrape =
      translatedText[grape] &&
      translatedText[grape] !== translatedText['Other (please specify)']
        ? translatedText[grape]
        : grape;

    // Return with or without percentage
    return percentage ? `${percentage}% ${translatedGrape}` : translatedGrape;
  };

  if (!product) return null;

  const ingredientsValues = product?.Ingredients?.split(', ');
  const ingredients = ingredientsValues?.map((ingredient) =>
    ingredient.split('-').pop()
  );

  const ingredientList =
    translatedText?.ingredients && ingredients
      ? ingredients
          .map((ingredient) => {
            const translatedIngredient = Object.values(
              translatedText.ingredients
            ).find((category) => category.items[ingredient]);
            return translatedIngredient
              ? translatedIngredient.items[ingredient]
              : null;
          })
          .filter(Boolean)
      : [];

  return (
    <div className={styles.wineOverview}>
      <h2 className={styles.sectionTitle}>{translatedText['Wine Overview']}</h2>

      <div className={styles.overviewItems}>
        <div className={styles.overviewItem}>
          <h3 className={styles.itemTitle}>
            {translatedText['Grape variety']}
          </h3>
          <p className={styles.itemValue}>
            {[
              getGrapeText(
                product.MajorGrape,
                product.MajorGrapePercentage,
                translatedText
              ),
              getGrapeText(
                product.SecondGrape,
                product.SecondGrapePercentage,
                translatedText
              ),
              getGrapeText(
                product.ThirdGrape,
                product.ThirdGrapePercentage,
                translatedText
              ),
              getGrapeText(
                product.FourthGrape,
                product.FourthGrapePercentage,
                translatedText
              ),
            ]
              .filter(Boolean)
              .join(', ') || translatedText['Not specified']}
          </p>
        </div>

        <div className={styles.overviewItem}>
          <h3 className={styles.itemTitle}>
            {translatedText['Sulphite Amount']}
          </h3>
          <p className={styles.itemValue}>
            {product.Sulphites
              ? `${product.Sulphites} mg/L`
              : translatedText['Less than 10mg/L']}
          </p>
        </div>

        <div className={styles.overviewItem}>
          <h3 className={styles.itemTitle}>{translatedText['Ingredients']}</h3>
          <p className={styles.itemValue}>
            {ingredientList.length > 0
              ? ingredientList.join(', ')
              : translatedText['Grapes, sulphites']}
          </p>
        </div>

        <div className={styles.overviewItem}>
          <h3 className={styles.itemTitle}>
            {translatedText['Residual Sugar']}
          </h3>
          <p className={styles.itemValue}>
            {product.ResidualSugar
              ? `${product.ResidualSugar} g/L`
              : translatedText['2.5g/L']}
          </p>
        </div>
      </div>
    </div>
  );
};
