import { useEffect, useState } from 'react';

export const ProductInfoPageOne = ({
  wineData,
  handleWineChange,
  handleGrapeChange,
  handlePercentageChange,
  majorGrapePercentage,
  setMajorGrapePercentage,
  page1Styles,
  CustomDropdown,
  CustomSelect,
  translatedText,
}) => {
  const [secondGrapePercentage, setSecondGrapePercentage] = useState('');
  const [thirdGrapePercentage, setThirdGrapePercentage] = useState('');
  const [fourthGrapePercentage, setFourthGrapePercentage] = useState('');

  useEffect(() => {
    // Initialize grape percentages from wineData
    setMajorGrapePercentage(wineData.productInfo.MajorGrapePercentage || 0);
    setSecondGrapePercentage(wineData.productInfo.SecondGrapePercentage || 0);
    setThirdGrapePercentage(wineData.productInfo.ThirdGrapePercentage || 0);
    setFourthGrapePercentage(wineData.productInfo.FourthGrapePercentage || 0);
  }, [wineData.productInfo])

  return (
    <div className={page1Styles.page1}>
      <div className={page1Styles.titleContainer}>
        <div className={page1Styles.titleWrapper}>
          <h2>2. {translatedText['Product Information']}</h2>
        </div>
      </div>
      <div className={page1Styles.formContent}>
        <div className={page1Styles.leftColumn}>
          <CustomDropdown
            label='Product Category'
            name='Category'
            value={translatedText[wineData.productInfo.Category] || ''}
            options={[
              { value: '', label: 'Select' },
              { value: 'Wine', label: translatedText['Wine'] },
              {
                value: 'Sparkling Wine',
                label: translatedText['Sparkling Wine'],
              },
              {
                value: 'Alcholic beverage from grapes',
                label: translatedText['Alcholic beverage from grapes'],
              },
            ]}
            onChange={handleWineChange}
            translatedText={translatedText}
          />

          <CustomDropdown
            label='Wine Type'
            name='Type'
            value={translatedText[wineData.productInfo.Type] || ''}
            options={[
              { value: '', label: 'Select' },
              { value: 'Rose', label: translatedText['Rose'] },
              { value: 'White', label: translatedText['White'] },
              { value: 'Red', label: translatedText['Red'] },
            ]}
            onChange={handleWineChange}
            translatedText={translatedText}
          />

          <CustomDropdown
            label='Net Quantity'
            name='NetQuantity'
            value={wineData.productInfo.NetQuantity || ''}
            options={[
              { value: '', label: 'Select' },
              { value: '750ml', label: translatedText['750 ml'] },
              { value: '1L', label: translatedText['1L'] },
              { value: '1.5L', label: translatedText['1.5 L'] },
              { value: '3L', label: translatedText['3L'] },
            ]}
            onChange={handleWineChange}
            translatedText={translatedText}
          />
        </div>

        <div className={page1Styles.grapeSection}>
          <h3>{translatedText['Grape variety']}*</h3>
          <div className={page1Styles.grapeGrid}>
            <div className={page1Styles.grapeVariety}>
              <div className={page1Styles.grapeLabel}>
                {translatedText['Major Grape Variety']}*
              </div>
              <CustomSelect
                value={wineData.productInfo.MajorGrape || ''}
                otherValue={wineData.productInfo.MajorGrapeOther || ''}
                onChange={(value) => handleGrapeChange(0, value)}
                onOtherChange={(value) =>
                  handleGrapeChange(
                    0,
                    translatedText['Other (please specify)'],
                    value
                  )
                }
                translatedText={translatedText}
              />
              <div className={page1Styles.percentageContainer}>
                <div className={page1Styles.percentageWrapper}>
                  <label className={page1Styles.percentageLabel}>
                    {translatedText['Percentage']}
                  </label>
                  <div className={page1Styles.percentageInput}>
                    <button
                      className={page1Styles.arrowLeft}
                      aria-label='decrease'
                      onClick={() => {
                        const value = Math.max(
                          Math.min(
                            parseInt(majorGrapePercentage - 1) || 0,
                            100
                          ),
                          0
                        ); // Math.max to ensure value doesn't go below 0
                        setMajorGrapePercentage(value);
                        handlePercentageChange('Major', value);
                      }}
                    >
                      <svg width='8' height='14' viewBox='0 0 8 14' fill='none'>
                        <path d='M8 15L1 8L8 1' stroke='#717171' />
                      </svg>
                    </button>
                    <div className={page1Styles.valueContainer}>
                      <input
                        type='number'
                        className={page1Styles.value}
                        value={majorGrapePercentage || 0}
                        onChange={(e) => {
                          const value = Math.min(
                            parseInt(e.target.value) || 0,
                            100
                          );
                          setMajorGrapePercentage(value);
                          handlePercentageChange('Major', value);
                        }}
                        onFocus={(e) => e.target.select()}
                        onClick={(e) => e.stopPropagation()}
                        min='0'
                        max='100'
                      />
                      <span className={page1Styles.unit}>%</span>
                    </div>
                    <button
                      className={page1Styles.arrowRight}
                      aria-label='increase'
                      onClick={() => {
                        const value = Math.min(
                          parseInt(majorGrapePercentage + 1) || 0,
                          100
                        );
                        setMajorGrapePercentage(value);
                        handlePercentageChange('Major', value);
                      }}
                    >
                      <svg width='8' height='14' viewBox='0 0 8 14' fill='none'>
                        <path d='M0 15L7 8L0 1' stroke='#717171' />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className={page1Styles.grapeVariety}>
              <div className={page1Styles.grapeLabel}>
                {translatedText['Second Grape Variety']}
              </div>
              <CustomSelect
                value={wineData.productInfo.SecondGrape || ''}
                otherValue={wineData.productInfo.SecondGrapeOther || ''}
                onChange={(value) => handleGrapeChange(1, value)}
                onOtherChange={(value) =>
                  handleGrapeChange(
                    1,
                    translatedText['Other (please specify)'],
                    value
                  )
                }
                translatedText={translatedText}
              />
              <div className={page1Styles.percentageContainer}>
                <div className={page1Styles.percentageWrapper}>
                  <label className={page1Styles.percentageLabel}>
                    {translatedText['Percentage']}
                  </label>
                  <div className={page1Styles.percentageInput}>
                    <button
                      className={page1Styles.arrowLeft}
                      aria-label='decrease'
                      onClick={() => {
                        const value = Math.max(
                          Math.min(
                            parseInt(secondGrapePercentage - 1) || 0,
                            100
                          ),
                          0
                        ); // Math.max to ensure value doesn't go below 0
                        setSecondGrapePercentage(value);
                        handlePercentageChange('Second', value);
                      }}
                    >
                      <svg width='8' height='14' viewBox='0 0 8 14' fill='none'>
                        <path d='M8 15L1 8L8 1' stroke='#717171' />
                      </svg>
                    </button>
                    <div className={page1Styles.valueContainer}>
                      <input
                        type='number'
                        className={page1Styles.value}
                        value={secondGrapePercentage || 0}
                        onChange={(e) => {
                          const value = Math.min(
                            parseInt(e.target.value) || 0,
                            100
                          );
                          setSecondGrapePercentage(value);
                          handlePercentageChange('Second', value);
                        }}
                        onFocus={(e) => e.target.select()}
                        onClick={(e) => e.stopPropagation()}
                        min='0'
                        max='100'
                      />
                      <span className={page1Styles.unit}>%</span>
                    </div>
                    <button
                      className={page1Styles.arrowRight}
                      aria-label='increase'
                      onClick={() => {
                        const value = Math.min(
                          parseInt(secondGrapePercentage + 1) || 0,
                          100
                        );
                        setSecondGrapePercentage(value);
                        handlePercentageChange('Second', value);
                      }}
                    >
                      <svg width='8' height='14' viewBox='0 0 8 14' fill='none'>
                        <path d='M0 15L7 8L0 1' stroke='#717171' />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className={page1Styles.grapeVariety}>
              <div className={page1Styles.grapeLabel}>
                {translatedText['Third Grape Variety']}
              </div>
              <CustomSelect
                value={wineData.productInfo.ThirdGrape || ''}
                otherValue={wineData.productInfo.ThirdGrapeOther || ''}
                onChange={(value) => handleGrapeChange(2, value)}
                onOtherChange={(value) =>
                  handleGrapeChange(
                    2,
                    translatedText['Other (please specify)'],
                    value
                  )
                }
                translatedText={translatedText}
              />
              <div className={page1Styles.percentageContainer}>
                <div className={page1Styles.percentageWrapper}>
                  <label className={page1Styles.percentageLabel}>
                    {translatedText['Percentage']}
                  </label>
                  <div className={page1Styles.percentageInput}>
                    <button
                      className={page1Styles.arrowLeft}
                      aria-label='decrease'
                      onClick={() => {
                        const value = Math.max(
                          Math.min(
                            parseInt(thirdGrapePercentage - 1) || 0,
                            100
                          ),
                          0
                        ); // Math.max to ensure value doesn't go below 0
                        setThirdGrapePercentage(value);
                        handlePercentageChange('Third', value);
                      }}
                    >
                      <svg width='8' height='14' viewBox='0 0 8 14' fill='none'>
                        <path d='M8 15L1 8L8 1' stroke='#717171' />
                      </svg>
                    </button>
                    <div className={page1Styles.valueContainer}>
                      <input
                        type='number'
                        className={page1Styles.value}
                        value={thirdGrapePercentage || 0}
                        onChange={(e) => {
                          const value = Math.min(
                            parseInt(e.target.value) || 0,
                            100
                          );
                          setThirdGrapePercentage(value);
                          handlePercentageChange('Third', value);
                        }}
                        onFocus={(e) => e.target.select()}
                        onClick={(e) => e.stopPropagation()}
                        min='0'
                        max='100'
                      />
                      <span className={page1Styles.unit}>%</span>
                    </div>
                    <button
                      className={page1Styles.arrowRight}
                      aria-label='increase'
                      onClick={() => {
                        const value = Math.min(
                          parseInt(thirdGrapePercentage + 1) || 0,
                          100
                        );
                        setThirdGrapePercentage(value);
                        handlePercentageChange('Third', value);
                      }}
                    >
                      <svg width='8' height='14' viewBox='0 0 8 14' fill='none'>
                        <path d='M0 15L7 8L0 1' stroke='#717171' />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className={page1Styles.grapeVariety}>
              <div className={page1Styles.grapeLabel}>
                {translatedText['Fourth Grape Variety']}
              </div>
              <CustomSelect
                value={wineData.productInfo.FourthGrape || ''}
                otherValue={wineData.productInfo.FourthGrapeOther || ''}
                onChange={(value) => handleGrapeChange(3, value)}
                onOtherChange={(value) =>
                  handleGrapeChange(
                    3,
                    translatedText['Other (please specify)'],
                    value
                  )
                }
                translatedText={translatedText}
              />
              <div className={page1Styles.percentageContainer}>
                <div className={page1Styles.percentageWrapper}>
                  <label className={page1Styles.percentageLabel}>
                    {translatedText['Percentage']}
                  </label>
                  <div className={page1Styles.percentageInput}>
                    <button
                      className={page1Styles.arrowLeft}
                      aria-label='decrease'
                      onClick={() => {
                        const value = Math.max(
                          Math.min(
                            parseInt(fourthGrapePercentage - 1) || 0,
                            100
                          ),
                          0
                        ); // Math.max to ensure value doesn't go below 0
                        setFourthGrapePercentage(value);
                        handlePercentageChange('Fourth', value);
                      }}
                    >
                      <svg width='8' height='14' viewBox='0 0 8 14' fill='none'>
                        <path d='M8 15L1 8L8 1' stroke='#717171' />
                      </svg>
                    </button>
                    <div className={page1Styles.valueContainer}>
                      <input
                        type='number'
                        className={page1Styles.value}
                        value={fourthGrapePercentage || 0}
                        onChange={(e) => {
                          const value = Math.min(
                            parseInt(e.target.value) || 0,
                            100
                          );
                          setFourthGrapePercentage(value);
                          handlePercentageChange('Fourth', value);
                        }}
                        onFocus={(e) => e.target.select()}
                        onClick={(e) => e.stopPropagation()}
                        min='0'
                        max='100'
                      />
                      <span className={page1Styles.unit}>%</span>
                    </div>
                    <button
                      className={page1Styles.arrowRight}
                      aria-label='increase'
                      onClick={() => {
                        const value = Math.min(
                          parseInt(fourthGrapePercentage + 1) || 0,
                          100
                        );
                        setFourthGrapePercentage(value);
                        handlePercentageChange('Fourth', value);
                      }}
                    >
                      <svg width='8' height='14' viewBox='0 0 8 14' fill='none'>
                        <path d='M0 15L7 8L0 1' stroke='#717171' />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
