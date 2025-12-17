import styles from '../../../../styles/sparklingWineProcess.module.scss';
import stylesProduction from '../../../../styles/productionProcess.module.scss';
import { useState } from 'react';

export const SparklingWineProcess = ({
  wineData,
  handleWineChange,
  translatedText,
  onNext,
  onPrevious,
}) => {
  // State för radioknappar
  const [primaryFermentation, setPrimaryFermentation] = useState(
    wineData.productionDetails?.primaryFermentation || ''
  );
  const [riddling, setRiddling] = useState(
    wineData.productionDetails?.riddling || ''
  );
  const [disgorgement, setDisgorgement] = useState(
    wineData.productionDetails?.disgorgement || ''
  );
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    handleWineChange(
      {
        target: {
          name: name,
          value: value,
          type: 'text',
        },
      },
      'productionDetails'
    );
  };

  // Hanterare för radioknappar
  const handlePrimaryFermentationChange = (value) => {
    setPrimaryFermentation(value);
    handleChange({ target: { name: 'primaryFermentation', value } });
  };

  const handleRiddlingChange = (value) => {
    setRiddling(value);
    handleChange({ target: { name: 'riddling', value } });
  };

  const handleDisgorgementChange = (value) => {
    setDisgorgement(value);
    handleChange({ target: { name: 'disgorgement', value } });
  };

  const handleSelectClick = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const handleOptionSelect = (name, value) => {
    handleChange({ target: { name, value } });
    setOpenDropdown(null);
  };

  return (
    <div className={styles.formContent}>
      <h2 className={styles.title}>
        3. {translatedText['Production Process']}
      </h2>
      <div className={styles.processCard}>
        <div className={styles.columnsContainer}>
          {/* Första kolumnen */}
          <div className={styles.column}>
            {/* Primary Fermentation */}
            <div className={styles.radioGroup}>
              <h3 className={styles.sectionTitle}>
                {translatedText['Primary Fermentation']}
              </h3>

              <div
                className={styles.radioOption}
                onClick={() => handlePrimaryFermentationChange('stainless')}
              >
                <div
                  className={`${styles.radioBullet} ${
                    primaryFermentation === 'stainless' ? styles.selected : ''
                  }`}
                ></div>
                <span className={styles.radioLabel}>
                  {translatedText['Stainless Steel Tanks']}
                </span>
              </div>

              <div
                className={styles.radioOption}
                onClick={() => handlePrimaryFermentationChange('oak')}
              >
                <div
                  className={`${styles.radioBullet} ${
                    primaryFermentation === 'oak' ? styles.selected : ''
                  }`}
                ></div>
                <span className={styles.radioLabel}>
                  {translatedText['Oak Barrels']}
                </span>
              </div>

              <div
                className={styles.radioOption}
                onClick={() => handlePrimaryFermentationChange('concrete')}
              >
                <div
                  className={`${styles.radioBullet} ${
                    primaryFermentation === 'concrete' ? styles.selected : ''
                  }`}
                ></div>
                <span className={styles.radioLabel}>
                  {translatedText['Concrete Tanks']}
                </span>
              </div>
            </div>

            {/* Riddling Method */}
            <div className={styles.radioGroup}>
              <h3 className={styles.sectionTitle}>
                {translatedText['Riddling Method']}
              </h3>

              <div
                className={styles.radioOption}
                onClick={() => handleRiddlingChange('hand')}
              >
                <div
                  className={`${styles.radioBullet} ${
                    riddling === 'hand' ? styles.selected : ''
                  }`}
                ></div>
                <span className={styles.radioLabel}>
                  {translatedText['Hand']}
                </span>
              </div>

              <div
                className={styles.radioOption}
                onClick={() => handleRiddlingChange('mechanical')}
              >
                <div
                  className={`${styles.radioBullet} ${
                    riddling === 'mechanical' ? styles.selected : ''
                  }`}
                ></div>
                <span className={styles.radioLabel}>
                  {translatedText['Mechanical']}
                </span>
              </div>
            </div>
          </div>

          {/* Andra kolumnen - lägg till middleColumn-klassen */}
          <div className={`${styles.column} ${styles.middleColumn}`}>
            {/* Secondary Fermentation */}
            <div>
              <div className={styles.selectContainer}>
                <h3 className={styles.sectionTitle}>
                  {
                    translatedText[
                      'Secondary Fermentation (Méthode Champenoise)'
                    ]
                  }
                </h3>
                <div
                  className={`${styles.select} ${
                    openDropdown === 'secondaryFermentation' ? styles.open : ''
                  }`}
                  onClick={() => handleSelectClick('secondaryFermentation')}
                >
                  {wineData.productionDetails?.secondaryFermentation
                    ? translatedText[
                        `${wineData.productionDetails.secondaryFermentation} months`
                      ]
                    : ''}
                  <div
                    className={`${styles.selectArrow} ${
                      openDropdown === 'secondaryFermentation'
                        ? styles.open
                        : ''
                    }`}
                  >
                    <svg width='23' height='14' viewBox='0 0 23 14' fill='none'>
                      <path
                        d='M22 1L11.5 12L1 1'
                        stroke='#717171'
                        strokeWidth='2'
                      />
                    </svg>
                  </div>
                </div>
                {openDropdown === 'secondaryFermentation' && (
                  <div className={styles.selectDropdown}>
                    <div
                      className={styles.option}
                      onClick={() =>
                        handleOptionSelect('secondaryFermentation', '12')
                      }
                    >
                      {translatedText['12 months']}
                    </div>
                    <div
                      className={styles.option}
                      onClick={() =>
                        handleOptionSelect('secondaryFermentation', '18')
                      }
                    >
                      {translatedText['18 months']}
                    </div>
                    <div
                      className={styles.option}
                      onClick={() =>
                        handleOptionSelect('secondaryFermentation', '24')
                      }
                    >
                      {translatedText['24 months']}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Disgorgement Method */}
            <div
              className={`${styles.radioGroup} ${styles.disgorgementSection}`}
            >
              <h3 className={styles.sectionTitle}>
                {translatedText['Disgorgement Method']}
              </h3>

              <div
                className={styles.radioOption}
                onClick={() => handleDisgorgementChange('manual')}
              >
                <div
                  className={`${styles.radioBullet} ${
                    disgorgement === 'manual' ? styles.selected : ''
                  }`}
                ></div>
                <span className={styles.radioLabel}>
                  {translatedText['Manual']}
                </span>
              </div>

              <div
                className={styles.radioOption}
                onClick={() => handleDisgorgementChange('freezing')}
              >
                <div
                  className={`${styles.radioBullet} ${
                    disgorgement === 'freezing' ? styles.selected : ''
                  }`}
                ></div>
                <span className={styles.radioLabel}>
                  {translatedText['Freezing/Mechanical']}
                </span>
              </div>
            </div>
          </div>

          {/* Tredje kolumnen */}
          <div className={`${styles.column} ${styles.rightColumn}`}>
            {/* Sugar Dosage */}
            <div>
              <div className={styles.selectContainer}>
                <h3 className={styles.sectionTitle}>
                  {translatedText['Sugar Dosage']}
                </h3>
                <div
                  className={`${styles.select} ${
                    openDropdown === 'dosage' ? styles.open : ''
                  }`}
                  onClick={() => handleSelectClick('dosage')}
                >
                  {wineData.productionDetails?.dosage
                    ? translatedText[wineData.productionDetails.dosage]
                    : ''}
                  <div
                    className={`${styles.selectArrow} ${
                      openDropdown === 'dosage' ? styles.open : ''
                    }`}
                  >
                    <svg width='23' height='14' viewBox='0 0 23 14' fill='none'>
                      <path
                        d='M22 1L11.5 12L1 1'
                        stroke='#717171'
                        strokeWidth='2'
                      />
                    </svg>
                  </div>
                </div>
                {openDropdown === 'dosage' && (
                  <div className={styles.selectDropdown}>
                    <div
                      className={styles.option}
                      onClick={() => handleOptionSelect('dosage', 'nature')}
                    >
                      {translatedText['Brut Nature']}
                    </div>
                    <div
                      className={styles.option}
                      onClick={() => handleOptionSelect('dosage', 'extra')}
                    >
                      {translatedText['Extra Brut']}
                    </div>
                    <div
                      className={styles.option}
                      onClick={() => handleOptionSelect('dosage', 'brut')}
                    >
                      {translatedText['Brut']}
                    </div>
                    <div
                      className={styles.option}
                      onClick={() => handleOptionSelect('dosage', 'Edry')}
                    >
                      {translatedText['Extra Dry']}
                    </div>
                    <div
                      className={styles.option}
                      onClick={() => handleOptionSelect('dosage', 'dry')}
                    >
                      {translatedText['Dry']}
                    </div>
                    <div
                      className={styles.option}
                      onClick={() => handleOptionSelect('dosage', 'demi')}
                    >
                      {translatedText['Demi-Sec']}
                    </div>
                    <div
                      className={styles.option}
                      onClick={() => handleOptionSelect('dosage', 'doux')}
                    >
                      {translatedText['Doux']}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Aging */}
            <div>
              <h3 className={styles.sectionTitle}>{translatedText['Aging']}</h3>
              <div className={styles.selectContainer}>
                <div
                  className={`${styles.select} ${
                    openDropdown === 'aging' ? styles.open : ''
                  }`}
                  onClick={() => handleSelectClick('aging')}
                >
                  {wineData.productionDetails?.aging
                    ? translatedText[
                        `${wineData.productionDetails.aging} months`
                      ]
                    : ''}
                  <div
                    className={`${styles.selectArrow} ${
                      openDropdown === 'aging' ? styles.open : ''
                    }`}
                  >
                    <svg width='23' height='14' viewBox='0 0 23 14' fill='none'>
                      <path
                        d='M22 1L11.5 12L1 1'
                        stroke='#717171'
                        strokeWidth='2'
                      />
                    </svg>
                  </div>
                </div>
                {openDropdown === 'aging' && (
                  <div className={styles.selectDropdown}>
                    <div
                      className={styles.option}
                      onClick={() => handleOptionSelect('aging', '12')}
                    >
                      {translatedText['12 months']}
                    </div>
                    <div
                      className={styles.option}
                      onClick={() => handleOptionSelect('aging', '24')}
                    >
                      {translatedText['24 months']}
                    </div>
                    <div
                      className={styles.option}
                      onClick={() => handleOptionSelect('aging', '36')}
                    >
                      {translatedText['36 months']}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CO2 Pressure */}
            <div>
              <h3 className={styles.sectionTitle}>
                {translatedText['CO2 Pressure']}
              </h3>
              <input
                type='number'
                className={styles.input}
                name='pressure'
                value={wineData.productionDetails?.pressure || ''}
                onChange={(e) => handleChange(e)}
                placeholder=''
                min='1'
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className={styles.navigation}>
        <button className={styles.previousButton} onClick={onPrevious}>
          <div className={styles.circle}>
            <div className={styles.arrow} />
          </div>
          <span>{translatedText['Previous']}</span>
        </button>
        <button className={styles.nextButton} onClick={onNext}>
          <div className={styles.circle}>
            <div className={styles.arrow} />
          </div>
          <span>{translatedText['Next']}</span>
        </button>
      </div>
    </div>
  );
};
