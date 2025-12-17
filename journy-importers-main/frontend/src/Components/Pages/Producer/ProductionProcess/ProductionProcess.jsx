import styles from '../../../../styles/productionProcess.module.scss';
import { HandpickedIcon, OakBarrelIcon, StainlessIcon } from './icons';
import { useState, useEffect } from 'react';
import { SparklingWineProcess } from './SparklingWineProcess';

export const ProductionProcess = ({
  wineData,
  handleWineChange,
  translatedText,
  onNext,
  onPrevious,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(
    wineData.productionDetails?.harvestMethod || ''
  );

  const [isFermOpen, setIsFermOpen] = useState(false);
  const [isAgingOpen, setIsAgingOpen] = useState(false);
  const [isOriginOpen, setIsOriginOpen] = useState(false);

  const isSparklingWine = wineData.productInfo.Category === 'Sparkling Wine';

  const fermProcess = wineData.productionDetails?.fermentationProcess || '';
  const agingProcess = wineData.productionDetails?.agingProcess || '';
  const grapeOrigin = wineData.productionDetails?.grapeOrigin || '';

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('handleChange called with:', name, value); // Debug log
    const customEvent = {
      target: {
        name: name,
        value: value,
        type: 'text',
      },
    };

    handleWineChange(customEvent, 'productionDetails');
  };

  const handleOptionClick = (value) => {
    setSelectedValue(value);
    setIsOpen(false);
    handleWineChange(
      {
        target: {
          name: 'harvestMethod',
          value: value,
          type: 'text',
        },
      },
      'productionDetails'
    );
  };

  const handleFermOptionClick = (value) => {
    setIsFermOpen(false);
    handleWineChange(
      {
        target: {
          name: 'fermentationProcess',
          value: value,
          type: 'text',
        },
      },
      'productionDetails'
    );
  };

  const handleAgingOptionClick = (value) => {
    setIsAgingOpen(false);
    handleWineChange(
      {
        target: {
          name: 'agingProcess',
          value: value,
          type: 'text',
        },
      },
      'productionDetails'
    );
  };

  const handleOriginOptionClick = (value) => {
    setIsOriginOpen(false);
    handleWineChange(
      {
        target: {
          name: 'grapeOrigin',
          value: value,
          type: 'text',
        },
      },
      'productionDetails'
    );
  };

  // Helper function to get the appropriate icon
  const getIcon = (type, value) => {
    // console.log('getIcon called with:', type, value); // Debug log
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

  // Skapa en hjälpfunktion i din komponent som översätter mellan värde och visningstexten
  const getDisplayText = (type, value) => {
    switch (type) {
      case 'harvest':
        switch (value) {
          case 'handpicked':
            return translatedText['Handpicked'];
          case 'machine':
            return translatedText['Machine-harvested'];
          case 'mixed':
            return translatedText['Mixed (Handpicked + Machine)'];
          default:
            return '';
        }

      case 'fermentation':
        switch (value) {
          case 'stainless':
            return translatedText['Stainless steel tank'];
          case 'oak':
            return translatedText['Oak barrels'];
          case 'amphora':
            return translatedText['Amphora (Clay vessels)'];
          default:
            return '';
        }

      case 'aging':
        switch (value) {
          case 'no_aging':
            return translatedText['No aging'];
          case 'oak_barrels':
            return translatedText['Aged in oak barrels'];
          case 'stainless':
            return translatedText['Aged in stainless steel tanks'];
          case 'concrete':
            return translatedText['Aged in concrete tanks'];
          default:
            return '';
        }

      case 'origin':
        switch (value) {
          case 'single':
            return translatedText['Single vineyard'];
          case 'multiple':
            return translatedText['Blended from multiple vineyards'];
          default:
            return '';
        }

      default:
        return '';
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Om klicket inte är på en .customDropdown, stäng alla dropdowns
      if (!e.target.closest(`.${styles.customDropdown}`)) {
        setIsOpen(false);
        setIsFermOpen(false);
        setIsAgingOpen(false);
        setIsOriginOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [styles.customDropdown]);

  const handleNextClick = () => {
    if (isSparklingWine && currentPage === 1) {
      setCurrentPage(2);
    } else {
      onNext();
    }
  };

  const handlePreviousClick = () => {
    if (currentPage === 2) {
      setCurrentPage(1);
    } else {
      onPrevious();
    }
  };

  const Page1 = () => (
    <>
      {/* Harvest Method */}
      <div className={`${styles.field} ${isOpen ? styles.activeField : ''}`}>
        <p>{translatedText['How was the harvest performed?']}</p>
        <div className={styles.customDropdown}>
          <div
            className={`${styles.dropdownHeader} ${isOpen ? styles.open : ''}`}
            onClick={() => {
              // Stäng andra dropdowns om de är öppna
              setIsFermOpen(false);
              setIsAgingOpen(false);
              setIsOriginOpen(false);

              // Växla denna dropdown
              setIsOpen(!isOpen);
            }}
          >
            {selectedValue ? (
              <div className={styles.selectedContainer}>
                <button className={styles['option-badge']}>
                  {getDisplayText('harvest', selectedValue)}
                  <span
                    className={styles['remove-btn']}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedValue('');
                      handleWineChange(
                        {
                          target: {
                            name: 'harvestMethod',
                            value: '',
                            type: 'text',
                          },
                        },
                        'productionDetails'
                      );
                    }}
                  >
                    <svg
                      width='13'
                      height='13'
                      viewBox='0 0 13 13'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <circle cx='6.5' cy='6.5' r='6.5' fill='#E7E7E7' />
                      <path
                        d='M4 4L9.10001 8.71429M9.10001 4L4 8.71429'
                        stroke='#D8D8D8'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </span>
                </button>
              </div>
            ) : (
              <span></span>
            )}
            <svg
              width='23'
              height='14'
              viewBox='0 0 23 14'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M22 1L11.5 12L1 1' stroke='#717171' strokeWidth='2' />
            </svg>
          </div>
          {isOpen && (
            <div
              className={styles.dropdownList}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`${styles.option} ${
                  selectedValue === 'handpicked' ? styles.selected : ''
                }`}
                onClick={() => handleOptionClick('handpicked')}
              >
                <span>{translatedText['Handpicked']}</span>
              </div>
              <div
                className={`${styles.option} ${
                  selectedValue === 'machine' ? styles.selected : ''
                }`}
                onClick={() => handleOptionClick('machine')}
              >
                <span>{translatedText['Machine-harvested']}</span>
              </div>
              <div
                className={`${styles.option} ${
                  selectedValue === 'mixed' ? styles.selected : ''
                }`}
                onClick={() => handleOptionClick('mixed')}
              >
                <span>{translatedText['Mixed (Handpicked + Machine)']}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fermentation Process */}
      <div
        className={`${styles.field} ${isFermOpen ? styles.activeField : ''}`}
      >
        <p>{translatedText['How was the wine fermented?']}</p>
        <div className={styles.customDropdown}>
          <div
            className={`${styles.dropdownHeader} ${
              isFermOpen ? styles.open : ''
            }`}
            onClick={() => {
              // Stäng andra dropdowns om de är öppna
              setIsOpen(false);
              setIsAgingOpen(false);
              setIsOriginOpen(false);

              // Växla denna dropdown
              setIsFermOpen(!isFermOpen);
            }}
          >
            {fermProcess ? (
              <div className={styles.selectedContainer}>
                <button className={styles['option-badge']}>
                  {getDisplayText('fermentation', fermProcess)}
                  <span
                    className={styles['remove-btn']}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWineChange(
                        {
                          target: {
                            name: 'fermentationProcess',
                            value: '',
                            type: 'text',
                          },
                        },
                        'productionDetails'
                      );
                    }}
                  >
                    <svg
                      width='13'
                      height='13'
                      viewBox='0 0 13 13'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <circle cx='6.5' cy='6.5' r='6.5' fill='#E7E7E7' />
                      <path
                        d='M4 4L9.10001 8.71429M9.10001 4L4 8.71429'
                        stroke='#D8D8D8'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </span>
                </button>
              </div>
            ) : (
              <span></span>
            )}
            <svg
              width='23'
              height='14'
              viewBox='0 0 23 14'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M22 1L11.5 12L1 1' stroke='#717171' strokeWidth='2' />
            </svg>
          </div>
          {isFermOpen && (
            <div
              className={styles.dropdownList}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`${styles.option} ${
                  fermProcess === 'stainless' ? styles.selected : ''
                }`}
                onClick={() => handleFermOptionClick('stainless')}
              >
                <span>{translatedText['Stainless steel tank']}</span>
              </div>
              <div
                className={`${styles.option} ${
                  fermProcess === 'oak' ? styles.selected : ''
                }`}
                onClick={() => handleFermOptionClick('oak')}
              >
                <span>{translatedText['Oak barrels']}</span>
              </div>
              <div
                className={`${styles.option} ${
                  fermProcess === 'amphora' ? styles.selected : ''
                }`}
                onClick={() => handleFermOptionClick('amphora')}
              >
                <span>{translatedText['Amphora (Clay vessels)']}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Aging Process */}
      <div
        className={`${styles.field} ${isAgingOpen ? styles.activeField : ''}`}
      >
        <p>{translatedText['How was the wine aged?']}</p>
        <div className={styles.customDropdown}>
          <div
            className={`${styles.dropdownHeader} ${
              isAgingOpen ? styles.open : ''
            }`}
            onClick={() => {
              // Stäng andra dropdowns om de är öppna
              setIsOpen(false);
              setIsFermOpen(false);
              setIsOriginOpen(false);

              // Växla denna dropdown
              setIsAgingOpen(!isAgingOpen);
            }}
          >
            {agingProcess ? (
              <div className={styles.selectedContainer}>
                <button className={styles['option-badge']}>
                  {getDisplayText('aging', agingProcess)}
                  <span
                    className={styles['remove-btn']}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWineChange(
                        {
                          target: {
                            name: 'agingProcess',
                            value: '',
                            type: 'text',
                          },
                        },
                        'productionDetails'
                      );
                    }}
                  >
                    <svg
                      width='13'
                      height='13'
                      viewBox='0 0 13 13'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <circle cx='6.5' cy='6.5' r='6.5' fill='#E7E7E7' />
                      <path
                        d='M4 4L9.10001 8.71429M9.10001 4L4 8.71429'
                        stroke='#D8D8D8'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </span>
                </button>
              </div>
            ) : (
              <span></span>
            )}
            <svg
              width='23'
              height='14'
              viewBox='0 0 23 14'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M22 1L11.5 12L1 1' stroke='#717171' strokeWidth='2' />
            </svg>
          </div>
          {isAgingOpen && (
            <div
              className={styles.dropdownList}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`${styles.option} ${
                  agingProcess === 'no_aging' ? styles.selected : ''
                }`}
                onClick={() => handleAgingOptionClick('no_aging')}
              >
                <span>{translatedText['No aging']}</span>
              </div>
              <div
                className={`${styles.option} ${
                  agingProcess === 'oak_barrels' ? styles.selected : ''
                }`}
                onClick={() => handleAgingOptionClick('oak_barrels')}
              >
                <span>{translatedText['Aged in oak barrels']}</span>
              </div>
              <div
                className={`${styles.option} ${
                  agingProcess === 'stainless' ? styles.selected : ''
                }`}
                onClick={() => handleAgingOptionClick('stainless')}
              >
                <span>{translatedText['Aged in stainless steel tanks']}</span>
              </div>
              <div
                className={`${styles.option} ${
                  agingProcess === 'concrete' ? styles.selected : ''
                }`}
                onClick={() => handleAgingOptionClick('concrete')}
              >
                <span>{translatedText['Aged in concrete tanks']}</span>
              </div>
            </div>
          )}
        </div>

        {/* Conditional input for oak barrel aging months */}
        {agingProcess && agingProcess !== 'no_aging'  && (
          <div className={styles.flex}>
            <input
              type='number'
              name='agingMonths'
              className={styles.input}
              value={wineData.productionDetails?.agingMonths || ''}
              onChange={handleChange}
              placeholder={translatedText['Number of months']}
              required
              min='1'
            />
            <p>{translatedText['months']}</p>
          </div>
        )}
      </div>

      {/* Grape Origin */}
      <div
        className={`${styles.field} ${isOriginOpen ? styles.activeField : ''}`}
      >
        <p>{translatedText['Where did the grapes come from?']}</p>
        <div className={styles.customDropdown}>
          <div
            className={`${styles.dropdownHeader} ${
              isOriginOpen ? styles.open : ''
            }`}
            onClick={() => {
              // Stäng andra dropdowns om de är öppna
              setIsOpen(false);
              setIsFermOpen(false);
              setIsAgingOpen(false);

              // Växla denna dropdown
              setIsOriginOpen(!isOriginOpen);
            }}
          >
            {grapeOrigin ? (
              <div className={styles.selectedContainer}>
                <button className={styles['option-badge']}>
                  {getDisplayText('origin', grapeOrigin)}
                  <span
                    className={styles['remove-btn']}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWineChange(
                        {
                          target: {
                            name: 'grapeOrigin',
                            value: '',
                            type: 'text',
                          },
                        },
                        'productionDetails'
                      );
                    }}
                  >
                    <svg
                      width='13'
                      height='13'
                      viewBox='0 0 13 13'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <circle cx='6.5' cy='6.5' r='6.5' fill='#E7E7E7' />
                      <path
                        d='M4 4L9.10001 8.71429M9.10001 4L4 8.71429'
                        stroke='#D8D8D8'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </span>
                </button>
              </div>
            ) : (
              <span></span>
            )}
            <svg
              width='23'
              height='14'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M22 1L11.5 12L1 1' stroke='#717171' strokeWidth='2' />
            </svg>
          </div>
          {isOriginOpen && (
            <div
              className={styles.dropdownList}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`${styles.option} ${
                  grapeOrigin === 'single' ? styles.selected : ''
                }`}
                onClick={() => handleOriginOptionClick('single')}
              >
                <span>{translatedText['Single vineyard']}</span>
              </div>
              <div
                className={`${styles.option} ${
                  grapeOrigin === 'multiple' ? styles.selected : ''
                }`}
                onClick={() => handleOriginOptionClick('multiple')}
              >
                <span>{translatedText['Blended from multiple vineyards']}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      {currentPage === 1 ? (
        // Page1 visas i ett kort
        <div className={styles.formContent}>
          <h2 className={styles.title}>
            3. {translatedText['Production Process']}
          </h2>
          <div className={styles.fieldsContainer}>
            <Page1 />
          </div>

          {/* Navigation Buttons */}
          <div className={styles.navigation}>
            <button
              className={styles.previousButton}
              onClick={handlePreviousClick}
            >
              <div className={styles.circle}>
                <div className={styles.arrow} />
              </div>
              <span>{translatedText['Previous']}</span>
            </button>
            <button className={styles.nextButton} onClick={handleNextClick}>
              <div className={styles.circle}>
                <div className={styles.arrow} />
              </div>
              <span>{translatedText['Next']}</span>
            </button>
          </div>
        </div>
      ) : (
        // SparklingWineProcess hanterar sitt eget kort och navigation
        <SparklingWineProcess
          wineData={wineData}
          handleWineChange={handleWineChange}
          translatedText={translatedText}
          onNext={onNext}
          onPrevious={() => setCurrentPage(1)}
        />
      )}
    </>
  );
};
