import { useEffect } from 'react';
import styles from '../../../../styles/nutrition.module.scss';

export const Nutrition = ({
  wineData,
  setWineData,
  handleWineChange,
  translatedText,
}) => {
  useEffect(() => {
    const { AlcoholVolume, ResidualSugar, OrganicAcid } = wineData.productInfo;

    const calculateNutrition = (AlcoholVolume, ResidualSugar, OrganicAcid) => {
      // Convert values to numbers and handle null/undefined
      const alcoholContent = parseFloat(AlcoholVolume) || 0;
      const sugarContent = parseFloat(ResidualSugar) || 0;
      const organicAcidContent = parseFloat(OrganicAcid) || 0;

      // Calculate energy from each component
      const alcoholEnergyKcal = alcoholContent * 5.55;
      const sugarEnergyKcal = ((sugarContent * 100) / 1000) * 4;
      const organicAcidEnergyKcal = organicAcidContent * 3.12;

      // Calculate total energy
      const totalEnergyKcal = (
        alcoholEnergyKcal +
        sugarEnergyKcal +
        organicAcidEnergyKcal
      ).toFixed(0);
      const totalEnergyKJ = (totalEnergyKcal * 4.184).toFixed(0);

      const CarbsOfSugar = ((sugarContent * 100) / 1000).toFixed(1);
      const totalCarbohydrates = (parseFloat(CarbsOfSugar) + 0.4).toFixed(1);

      return {
        KJ: totalEnergyKJ,
        Kcal: totalEnergyKcal,
        Carbs: totalCarbohydrates,
        CarbsOfSugar: CarbsOfSugar,
      };
    };

    const nutritionValues = calculateNutrition(
      AlcoholVolume,
      ResidualSugar,
      OrganicAcid
    );

    setWineData((prevWineData) => ({
      ...prevWineData,
      Nutrition: {
        ...prevWineData.Nutrition,
        ...nutritionValues,
      },
    }));
  }, [
    wineData.productInfo.AlcoholVolume,
    wineData.productInfo.ResidualSugar,
    wineData.productInfo.OrganicAcid, // Add OrganicAcid to dependency array
  ]);

  return (
    <>
      <div className={styles['nutrition-table']}>
        <span className={styles['nutrient-type']}>
          {translatedText['Type']}
        </span>
        <span className={styles['nutrient-per100']}>
          {translatedText['Per 100 mL']}
        </span>
        <div className={styles['nutrition-row']}>
          <div className={styles['energy-container']}>
            <span className={styles['nutrition-label']}>
              {translatedText['Energy']}
            </span>
            <span className={styles['nutrition-value']}>
              {wineData.Nutrition.KJ} KJ / {wineData.Nutrition.Kcal} kcal
            </span>
          </div>
        </div>

        <div className={styles['nutrition-row']}>
          <span className={styles['nutrition-label']}>
            {translatedText['Carbohydrates']}
          </span>
          <span className={styles['nutrition-value']}>
            {wineData.Nutrition.Carbs} g
          </span>
        </div>

        <div className={styles['nutrition-row']}>
          <span className={styles['nutrition-label']}>
            {translatedText['of which sugar']}
          </span>
          <span className={styles['nutrition-value']}>
            {wineData.Nutrition.CarbsOfSugar} g
          </span>
        </div>

        <div className={styles['nutrition-footer']}>
          <small>
            {
              translatedText[
                'Contains small amounts of: Fat, Saturated fat, Protein, Salt'
              ]
            }
          </small>
        </div>
      </div>
    </>
  );
};
