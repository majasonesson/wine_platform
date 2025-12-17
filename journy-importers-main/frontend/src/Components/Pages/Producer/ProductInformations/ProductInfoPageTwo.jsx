export const ProductInfoPageTwo = ({
  wineData,
  handleWineChange,
  page2Styles,
  SelectDropdown,
  selectedIngredients,
  setSelectedIngredients,
  categoryOptions,
  translatedText,
}) => {
  // Filter selected option again when fetching ingredients
  const filteredIngredientsOptions = categoryOptions?.filter(
    (ingredient) =>
      !selectedIngredients.some(
        (selected) => selected.label === ingredient.label
      )
  );

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

  return (
    <div className={page2Styles.page2}>
      <div className={page2Styles.titleContainer}>
        <h2>2. {translatedText['Product Information']}</h2>
      </div>
      <div className={page2Styles.formContent}>
        <div className={page2Styles.ingredientsList}>
          <label>{translatedText['Ingredients list']} *</label>
          <SelectDropdown
            multiple
            options={filteredIngredientsOptions}
            selectedValue={selectedIngredients}
            name={'Ingredients'}
            value={wineData.productInfo?.Ingredients || ''}
            onChange={(options) => {
              setSelectedIngredients(options);
              handleSelectChange(options);
            }}
            translatedText={translatedText}
            className='ingredientsSelectDropdown'
          />
        </div>

        <div className={page2Styles.measurementsContainer}>
          <p className={page2Styles.description}>
            {translatedText['Enter nutritions values']}
          </p>
          <div className={page2Styles.measurementsGrid}>
            <div className={page2Styles.field}>
              <label>{translatedText['Alcohol Volume']} *</label>
              <div className={page2Styles.percentageInput}>
                <button
                  className={page2Styles.arrowLeft}
                  aria-label='decrease'
                  onClick={() => {
                    const currentValue =
                      parseFloat(wineData.productInfo.AlcoholVolume) || 0;
                    if (currentValue > 0) {
                      handleWineChange(
                        {
                          target: {
                            name: 'AlcoholVolume',
                            value: Math.max(0, currentValue - 0.1).toFixed(1),
                          },
                        },
                        'productInfo'
                      );
                    }
                  }}
                >
                  <svg width='8' height='14' viewBox='0 0 8 14' fill='none'>
                    <path d='M8 15L1 8L8 1' stroke='#717171' />
                  </svg>
                </button>
                <div className={page2Styles.valueContainer}>
                  <input
                    type='number'
                    name='AlcoholVolume'
                    className={page2Styles.value}
                    value={wineData.productInfo.AlcoholVolume || 0}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      handleWineChange(
                        {
                          target: {
                            name: 'AlcoholVolume',
                            value: value,
                          },
                        },
                        'productInfo'
                      );
                    }}
                    onFocus={(e) => e.target.select()}
                    onClick={(e) => e.stopPropagation()}
                    onWheel={(e) => e.target.blur()}
                    min='0'
                    step='0.1'
                  />
                  <span className={page2Styles.unit}>%</span>
                </div>
                <button
                  className={page2Styles.arrowRight}
                  aria-label='increase'
                  onClick={() => {
                    const currentValue =
                      parseFloat(wineData.productInfo.AlcoholVolume) || 0;
                    handleWineChange(
                      {
                        target: {
                          name: 'AlcoholVolume',
                          value: (currentValue + 0.1).toFixed(1),
                        },
                      },
                      'productInfo'
                    );
                  }}
                >
                  <svg width='8' height='14' viewBox='0 0 8 14' fill='none'>
                    <path d='M0 15L7 8L0 1' stroke='#717171' />
                  </svg>
                </button>
              </div>
            </div>

            <div className={page2Styles.field}>
              <label>{translatedText['Residual Sugar']} *</label>
              <div className={page2Styles.percentageInput}>
                <button
                  className={page2Styles.arrowLeft}
                  aria-label='decrease'
                  onClick={() => {
                    const currentValue =
                      parseFloat(wineData.productInfo.ResidualSugar) || 0;
                    if (currentValue > 0) {
                      handleWineChange(
                        {
                          target: {
                            name: 'ResidualSugar',
                            value: Math.max(0, currentValue - 0.1).toFixed(1),
                          },
                        },
                        'productInfo'
                      );
                    }
                  }}
                >
                  <svg width='8' height='14' viewBox='0 0 8 14' fill='none'>
                    <path d='M8 15L1 8L8 1' stroke='#717171' />
                  </svg>
                </button>
                <div className={page2Styles.valueContainer}>
                  <input
                    type='number'
                    name='ResidualSugar'
                    className={page2Styles.value}
                    value={wineData.productInfo.ResidualSugar || 0}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      handleWineChange(
                        {
                          target: {
                            name: 'ResidualSugar',
                            value: value,
                          },
                        },
                        'productInfo'
                      );
                    }}
                    onFocus={(e) => e.target.select()}
                    onClick={(e) => e.stopPropagation()}
                    onWheel={(e) => e.target.blur()}
                    min='0'
                    step='0.1'
                  />
                  <span className={page2Styles.unit}>g/L</span>
                </div>
                <button
                  className={page2Styles.arrowRight}
                  aria-label='increase'
                  onClick={() => {
                    const currentValue =
                      parseFloat(wineData.productInfo.ResidualSugar) || 0;
                    handleWineChange(
                      {
                        target: {
                          name: 'ResidualSugar',
                          value: (currentValue + 0.1).toFixed(1),
                        },
                      },
                      'productInfo'
                    );
                  }}
                >
                  <svg width='8' height='14' viewBox='0 0 8 14' fill='none'>
                    <path d='M0 15L7 8L0 1' stroke='#717171' />
                  </svg>
                </button>
              </div>
            </div>

            <div className={page2Styles.field}>
              <label>{translatedText['Organic Acid (TA)']} *</label>
              <div className={page2Styles.percentageInput}>
                <button
                  className={page2Styles.arrowLeft}
                  aria-label='decrease'
                  onClick={() => {
                    const currentValue =
                      parseFloat(wineData.productInfo.OrganicAcid) || 0;
                    if (currentValue > 0) {
                      handleWineChange(
                        {
                          target: {
                            name: 'OrganicAcid',
                            value: Math.max(0, currentValue - 0.1).toFixed(1),
                          },
                        },
                        'productInfo'
                      );
                    }
                  }}
                >
                  <svg width='8' height='14' viewBox='0 0 8 14' fill='none'>
                    <path d='M8 15L1 8L8 1' stroke='#717171' />
                  </svg>
                </button>
                <div className={page2Styles.valueContainer}>
                  <input
                    type='number'
                    name='OrganicAcid'
                    className={page2Styles.value}
                    value={wineData.productInfo.OrganicAcid || 0}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      handleWineChange(
                        {
                          target: {
                            name: 'OrganicAcid',
                            value: value,
                          },
                        },
                        'productInfo'
                      );
                    }}
                    onFocus={(e) => e.target.select()}
                    onClick={(e) => e.stopPropagation()}
                    onWheel={(e) => e.target.blur()}
                    min='0'
                    step='0.1'
                  />
                  <span className={page2Styles.unit}>g/L</span>
                </div>
                <button
                  className={page2Styles.arrowRight}
                  aria-label='increase'
                  onClick={() => {
                    const currentValue =
                      parseFloat(wineData.productInfo.OrganicAcid) || 0;
                    handleWineChange(
                      {
                        target: {
                          name: 'OrganicAcid',
                          value: (currentValue + 0.1).toFixed(1),
                        },
                      },
                      'productInfo'
                    );
                  }}
                >
                  <svg width='8' height='14' viewBox='0 0 8 14' fill='none'>
                    <path d='M0 15L7 8L0 1' stroke='#717171' />
                  </svg>
                </button>
              </div>
            </div>

            <div className={page2Styles.field}>
              <label>{translatedText['Amount of Sulphites']}</label>
              <div className={page2Styles.percentageInput}>
                <button
                  className={page2Styles.arrowLeft}
                  aria-label='decrease'
                  onClick={() => {
                    const currentValue =
                      parseFloat(wineData.productInfo.Sulphites) || 0;
                    if (currentValue > 0) {
                      handleWineChange(
                        {
                          target: {
                            name: 'Sulphites',
                            value: Math.max(0, currentValue - 1),
                          },
                        },
                        'productInfo'
                      );
                    }
                  }}
                >
                  <svg width='8' height='14' viewBox='0 0 8 14' fill='none'>
                    <path d='M8 15L1 8L8 1' stroke='#717171' />
                  </svg>
                </button>
                <div className={page2Styles.valueContainer}>
                  <input
                    type='number'
                    name='Sulphites'
                    className={page2Styles.value}
                    value={wineData.productInfo.Sulphites || 0}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      handleWineChange(
                        {
                          target: {
                            name: 'Sulphites',
                            value: value,
                          },
                        },
                        'productInfo'
                      );
                    }}
                    onFocus={(e) => e.target.select()}
                    onClick={(e) => e.stopPropagation()}
                    onWheel={(e) => e.target.blur()}
                    min='0'
                    step='1'
                  />
                  <span className={page2Styles.unit}>mg/L</span>
                </div>
                <button
                  className={page2Styles.arrowRight}
                  aria-label='increase'
                  onClick={() => {
                    const currentValue =
                      parseFloat(wineData.productInfo.Sulphites) || 0;
                    handleWineChange(
                      {
                        target: {
                          name: 'Sulphites',
                          value: currentValue + 1,
                        },
                      },
                      'productInfo'
                    );
                  }}
                >
                  <svg width='8' height='14' viewBox='0 0 8 14' fill='none'>
                    <path d='M0 15L7 8L0 1' stroke='#717171' />
                  </svg>
                </button>
              </div>
            </div>

            <div className={page2Styles.field}>
              <label>
                {wineData.productInfo.AlcoholVolume < 10
                  ? translatedText['Best Before'] + ' *'
                  : translatedText['Best Before']}
              </label>
              <div className={page2Styles.inputWithUnit}>
                <div className={page2Styles.dateWrapper}>
                  <input
                    type='date'
                    name='ExpiryDate'
                    value={wineData.productInfo.ExpiryDate || ''}
                    onChange={(e) => handleWineChange(e, 'productInfo')}
                  />
                  <span className={page2Styles.dateValue}>
                    {wineData.productInfo.ExpiryDate
                      ? new Date(
                          wineData.productInfo.ExpiryDate
                        ).toLocaleDateString('sv-SE', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        })
                      : ''}
                  </span>
                  <svg
                    className={page2Styles.calendarIcon}
                    width='19'
                    height='21'
                    viewBox='0 0 19 21'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M16.8889 18.9H2.11111V7.35H16.8889M13.7222 0V2.1H5.27778V0H3.16667V2.1H2.11111C0.939444 2.1 0 3.0345 0 4.2V18.9C0 19.457 0.22242 19.9911 0.61833 20.3849C1.01424 20.7787 1.55121 21 2.11111 21H16.8889C17.4488 21 17.9858 20.7787 18.3817 20.3849C18.7776 19.9911 19 19.457 19 18.9V4.2C19 3.64305 18.7776 3.1089 18.3817 2.71508C17.9858 2.32125 17.4488 2.1 16.8889 2.1H15.8333V0M14.7778 11.55H9.5V16.8H14.7778V11.55Z'
                      fill='#808080'
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
