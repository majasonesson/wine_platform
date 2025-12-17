import {
  containerStyle,
  titleStyle
} from "../../../../../styles/productInformation.js";
import styles from '../../../../../styles/productPage2.module.scss';

/* This component displays the ingredients information of wine product. */
export const ListIngredients = ({ product, translatedText }) => {
  if (!product) return null;
  
  const ingredientsValues = product?.Ingredients.split(', ') || [];
  const ingredients = ingredientsValues?.map(ingredient =>
    ingredient.split('-').pop()
  );

  const ingredientList = translatedText?.ingredients && ingredients ?
    ingredients.map(ingredient => {
      const translatedIngredient = Object.values(translatedText.ingredients)
        .find(category => category.items[ingredient]);
      return translatedIngredient ? translatedIngredient.items[ingredient] : null;
    }).filter(Boolean)
    : [];

  return (
    <div className={styles["ingredients-container"]} style={containerStyle}>
      <h2 style={titleStyle}>
        {translatedText['Ingredients']}
      </h2>
      <p className={styles.ingredientsText}>
        {ingredientList.join(', ')}
      </p>
    </div>
  );
};