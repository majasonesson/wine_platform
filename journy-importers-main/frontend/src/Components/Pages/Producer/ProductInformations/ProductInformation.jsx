import ingredients_en from '../../../../Utils/languages/ingredients/ingredients_en.json';
import ingredients_it from '../../../../Utils/languages/ingredients/ingredients_it.json';
import ingredients_fr from '../../../../Utils/languages/ingredients/ingredients_fr.json';
import ingredients_es from '../../../../Utils/languages/ingredients/ingredients_es.json';
import ingredients_sv from '../../../../Utils/languages/ingredients/ingredients_sv.json';
import ingredients_pt from '../../../../Utils/languages/ingredients/ingredients_pt.json';
import ingredients_el from '../../../../Utils/languages/ingredients/ingredients_el.json';
import ingredients_bg from '../../../../Utils/languages/ingredients/ingredients_bg.json';
import ingredients_hr from '../../../../Utils/languages/ingredients/ingredients_hr.json';
import ingredients_cs from '../../../../Utils/languages/ingredients/ingredients_cs.json';
import ingredients_da from '../../../../Utils/languages/ingredients/ingredients_da.json';
import ingredients_nl from '../../../../Utils/languages/ingredients/ingredients_nl.json';
import ingredients_et from '../../../../Utils/languages/ingredients/ingredients_et.json';
import ingredients_fi from '../../../../Utils/languages/ingredients/ingredients_fi.json';
import ingredients_de from '../../../../Utils/languages/ingredients/ingredients_de.json';
import ingredients_hu from '../../../../Utils/languages/ingredients/ingredients_hu.json';
import ingredients_ga from '../../../../Utils/languages/ingredients/ingredients_ga.json';
import ingredients_lv from '../../../../Utils/languages/ingredients/ingredients_lv.json';
import ingredients_lt from '../../../../Utils/languages/ingredients/ingredients_lt.json';
import ingredients_mt from '../../../../Utils/languages/ingredients/ingredients_mt.json';
import ingredients_pl from '../../../../Utils/languages/ingredients/ingredients_pl.json';
import ingredients_ro from '../../../../Utils/languages/ingredients/ingredients_ro.json';
import ingredients_sk from '../../../../Utils/languages/ingredients/ingredients_sk.json';
import ingredients_sl from '../../../../Utils/languages/ingredients/ingredients_sl.json';
import SelectDropdown from '../../../Layout/SelectDropDown';
import page1Styles from '../../../../styles/productPage1.module.scss';
import page2Styles from '../../../../styles/productPage2.module.scss';
import { useEffect, useState } from 'react';
import { CustomSelect } from './CustomSelect';
import { CustomDropdown } from './CustomDropdown';
import { ProductInfoPageOne } from './ProductInfoPageOne';
import { ProductInfoPageTwo } from './ProductInfoPageTwo';

const grapeOptions = [
  { value: 'merlot', label: 'Merlot' },
  { value: 'pinot_noir', label: 'Pinot Noir' },
  { value: 'chardonnay', label: 'Chardonnay' },
  { value: 'other', label: 'Other (Please specify)' },
];

// Lägg till denna CalendarIcon-komponent istället
const CalendarIcon = () => (
  <svg
    width='20'
    height='20'
    viewBox='0 0 20 20'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M6 5V1M14 5V1M5 9H15M3 19H17C18.1046 19 19 18.1046 19 17V5C19 3.89543 18.1046 3 17 3H3C1.89543 3 1 3.89543 1 5V17C1 18.1046 1.89543 19 3 19Z'
      stroke='#717171'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

export const ProductInformation = ({
  wineData,
  handleWineChange,
  selectedIngredients = [],
  setSelectedIngredients,
  translatedText,
  language,
  onNext,
  onPrevious,
  showModal,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [ingredients, setIngredients] = useState({});
  const [showDateInput, setShowDateInput] = useState(false);
  const [majorGrapePercentage, setMajorGrapePercentage] = useState('');

  // Handles the selection of ingredients and updates the state
  const handleSelectChange = (options) => {
    setSelectedIngredients(options);

    // Create a custom event to update the ingredients in wineData
    const customEvent = {
      target: {
        name: 'Ingredients',
        value: options.map((option) => option.value).join(', '),
      },
    };

    handleWineChange(customEvent, 'productInfo'); // Update the wineData with the selected ingredients
  };

  const translatedSelectedIngredients = (ingredients) => {
    if (!selectedIngredients?.length || !ingredients?.length) return;

    const translatedOptions = selectedIngredients
      .map((selectedOption) => {
        const [category, categoryIndex, itemLabel] =
          selectedOption.value.split('-');

        // Find matching ingredient category
        const ingredientCategory = ingredients[categoryIndex];

        if (!ingredientCategory?.items) return null;

        // Get translated item
        const translatedItem = ingredientCategory.items[itemLabel];

        if (!translatedItem) return null;

        return {
          label: translatedItem,
          value: selectedOption.value, // Original value
          category: ingredientCategory.category,
        };
      })
      .filter(Boolean); // Remove null values

    setSelectedIngredients(translatedOptions);
  };

  // Language change effect
  useEffect(() => {
    switch (language) {
      case 'en':
      default:
        setIngredients(ingredients_en.ingredients);
        translatedSelectedIngredients(ingredients_en.ingredients);
        break;
      case 'it':
        setIngredients(ingredients_it.ingredients);
        translatedSelectedIngredients(ingredients_it.ingredients);
        break;
      case 'fr':
        setIngredients(ingredients_fr.ingredients);
        translatedSelectedIngredients(ingredients_fr.ingredients);
        break;
      case 'es':
        setIngredients(ingredients_es.ingredients);
        translatedSelectedIngredients(ingredients_es.ingredients);
        break;
      case 'sv':
        setIngredients(ingredients_sv.ingredients);
        translatedSelectedIngredients(ingredients_sv.ingredients);
        break;
      case 'pt':
        setIngredients(ingredients_pt.ingredients);
        translatedSelectedIngredients(ingredients_pt.ingredients);
        break;
      case 'el':
        setIngredients(ingredients_el.ingredients);
        translatedSelectedIngredients(ingredients_el.ingredients);
        break;
      case 'bg':
        setIngredients(ingredients_bg.ingredients);
        translatedSelectedIngredients(ingredients_bg.ingredients);
        break;
      case 'hr':
        setIngredients(ingredients_hr.ingredients);
        translatedSelectedIngredients(ingredients_hr.ingredients);
        break;
      case 'cs':
        setIngredients(ingredients_cs.ingredients);
        translatedSelectedIngredients(ingredients_cs.ingredients);
        break;
      case 'da':
        setIngredients(ingredients_da.ingredients);
        translatedSelectedIngredients(ingredients_da.ingredients);
        break;
      case 'nl':
        setIngredients(ingredients_nl.ingredients);
        translatedSelectedIngredients(ingredients_nl.ingredients);
        break;
      case 'et':
        setIngredients(ingredients_et.ingredients);
        translatedSelectedIngredients(ingredients_et.ingredients);
        break;
      case 'fi':
        setIngredients(ingredients_fi.ingredients);
        translatedSelectedIngredients(ingredients_fi.ingredients);
        break;
      case 'de':
        setIngredients(ingredients_de.ingredients);
        translatedSelectedIngredients(ingredients_de.ingredients);
        break;
      case 'hu':
        setIngredients(ingredients_hu.ingredients);
        translatedSelectedIngredients(ingredients_hu.ingredients);
        break;
      case 'ga':
        setIngredients(ingredients_ga.ingredients);
        translatedSelectedIngredients(ingredients_ga.ingredients);
        break;
      case 'lv':
        setIngredients(ingredients_lv.ingredients);
        translatedSelectedIngredients(ingredients_lv.ingredients);
        break;
      case 'lt':
        setIngredients(ingredients_lt.ingredients);
        translatedSelectedIngredients(ingredients_lt.ingredients);
        break;
      case 'mt':
        setIngredients(ingredients_mt.ingredients);
        translatedSelectedIngredients(ingredients_mt.ingredients);
        break;
      case 'pl':
        setIngredients(ingredients_pl.ingredients);
        translatedSelectedIngredients(ingredients_pl.ingredients);
        break;
      case 'ro':
        setIngredients(ingredients_ro.ingredients);
        translatedSelectedIngredients(ingredients_ro.ingredients);
        break;
      case 'sk':
        setIngredients(ingredients_sk.ingredients);
        translatedSelectedIngredients(ingredients_sk.ingredients);
        break;
      case 'sl':
        setIngredients(ingredients_sl.ingredients);
        translatedSelectedIngredients(ingredients_sl.ingredients);
        break;
    }
  }, [language]);

  // Flatten the ingredients array to create categoryOptions with category and item information
  const categoryOptions = Object.values(ingredients)?.flatMap(
    (ingredient, categoryIndex) =>
      Object.entries(ingredient.items).map(([key, value]) => ({
        label: value,
        value: `${ingredient?.category}-${categoryIndex}-${key}`,
        category: ingredient?.category,
      }))
  );

  // Uppdatera handlers för inputs
  const handleAlcoholChange = (e) => {
    const value = parseFloat(e.target.value);
    handleWineChange(e, 'productInfo');
    setShowDateInput(value < 10);
  };

  const handleGrapeChange = (grapeNumber, value, otherValue = '') => {
    const grapeFields = {
      0: ['MajorGrape', 'MajorGrapePercentage'],
      1: ['SecondGrape', 'SecondGrapePercentage'],
      2: ['ThirdGrape', 'ThirdGrapePercentage'],
      3: ['FourthGrape', 'FourthGrapePercentage'],
    };

    const [grapeField, percentageField] = grapeFields[grapeNumber];

    // Reset fields if value is empty
    if (value === '') {
      handleWineChange(
        { target: { name: grapeField, value: '' } },
        'productInfo'
      );
      handleWineChange(
        { target: { name: percentageField, value: 0 } },
        'productInfo'
      );
      return;
    }

    // Set the grape variety name
    handleWineChange(
      { target: { name: grapeField, value: value } },
      'productInfo'
    );

    // If "Other (please specify)" is selected and otherValue is provided
    if (value === translatedText['Other (please specify)'] && otherValue) {
      handleWineChange(
        { target: { name: grapeField, value: otherValue } },
        'productInfo'
      );
    }
  };

  const handlePercentageChange = (grapeType, value) => {
    const fieldName = `${grapeType}GrapePercentage`;

    handleWineChange(
      {
        target: {
          name: fieldName,
          value,
        },
      },
      'productInfo'
    );
  };

  // Hanterare för numeriska inputs
  const handleNumberChange = (e, field) => {
    const value = parseFloat(e.target.value) || 0;
    handleWineChange(
      {
        target: {
          name: field,
          value: value,
        },
      },
      'productInfo'
    );
  };

  // Add this useEffect after your existing useEffects
  useEffect(() => {
    const { AlcoholVolume, ResidualSugar, OrganicAcid } = wineData.productInfo;

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

    // Update the wineData with calculated values but don't display them
    handleWineChange({
      target: {
        name: 'Kcal',
        value: totalEnergyKcal,
      },
    });

    handleWineChange({
      target: {
        name: 'KJ',
        value: totalEnergyKJ,
      },
    });

    handleWineChange({
      target: {
        name: 'Carbs',
        value: totalCarbohydrates,
      },
    });

    handleWineChange({
      target: {
        name: 'CarbsOfSugar',
        value: CarbsOfSugar,
      },
    });
  }, [
    wineData.productInfo.AlcoholVolume,
    wineData.productInfo.ResidualSugar,
    wineData.productInfo.OrganicAcid,
  ]);

  return (
    <div className={page1Styles.container}>
      {currentPage === 1 ? (
        <ProductInfoPageOne
          wineData={wineData}
          handleWineChange={handleWineChange}
          handleGrapeChange={handleGrapeChange}
          handlePercentageChange={handlePercentageChange}
          majorGrapePercentage={majorGrapePercentage}
          setMajorGrapePercentage={setMajorGrapePercentage}
          page1Styles={page1Styles}
          CustomDropdown={CustomDropdown}
          CustomSelect={CustomSelect}
          translatedText={translatedText}
        />
      ) : (
        <ProductInfoPageTwo
          wineData={wineData}
          handleWineChange={handleWineChange}
          page2Styles={page2Styles}
          SelectDropdown={SelectDropdown}
          selectedIngredients={selectedIngredients}
          setSelectedIngredients={setSelectedIngredients}
          categoryOptions={categoryOptions}
          translatedText={translatedText}
        />
      )}
      <div className={page1Styles.navigation}>
        <button
          className={page1Styles.previousButton}
          onClick={() => {
            if (currentPage === 2) {
              setCurrentPage(1);
            } else {
              onPrevious();
            }
          }}
        >
          <div className={page1Styles.circle}>
            <div className={page1Styles.arrow}></div>
          </div>
          <span>{translatedText['Previous']}</span>
        </button>
        <button
          className={page1Styles.nextButton}
          onClick={() => {
            setCurrentPage((prev) => {
              if (prev === 2) {
                onNext();
                return 2;
              }
              return Math.min(2, prev + 1);
            });
          }}
        >
          <div className={page1Styles.circle}>
            <div className={page1Styles.arrow}></div>
          </div>
          <span>{translatedText['Next']}</span>
        </button>
      </div>
    </div>
  );
};
