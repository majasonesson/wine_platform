import { useState, useEffect } from 'react';
import page1Styles from '../../../../styles/productPage1.module.scss';

export const CustomSelect = ({
  value,
  onChange,
  otherValue,
  onOtherChange,
  translatedText,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempInputValue, setTempInputValue] = useState(otherValue || '');
  const grapeOptions = [
    translatedText['Merlot'],
    translatedText['Pinot Noir'],
    translatedText['Chardonnay'],
    translatedText['Other (please specify)'],
  ];

  // Synkronisera tempInputValue med otherValue från parent när det ändras
  useEffect(() => {
    if (otherValue !== undefined) {
      setTempInputValue(otherValue);
    }
  }, [otherValue]);

  const handleRemove = (e) => {
    e.stopPropagation();
    e.preventDefault();

    // När vi tar bort ett värde, gör vi det i denna ordning:
    // 1. Återställ tempInputValue om det är "Other"
    if (value === translatedText['Other (please specify)']) {
      setTempInputValue('');
      onOtherChange('');
    }

    // 2. Återställ huvudvärdet (detta kommer även att återställa otherValue via handleGrapeChange)
    onChange('');

    // 3. Stäng dropdown
    setIsOpen(false);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      onOtherChange(tempInputValue);
      e.target.blur();
    }
  };

  return (
    <div className={page1Styles.customSelect}>
      <div
        className={page1Styles.selectTrigger}
        onClick={() => setIsOpen(!isOpen)}
      >
        {value === translatedText['Other (please specify)'] && otherValue ? (
          <div className={page1Styles.selectedBadge}>
            {otherValue}
            <button className={page1Styles.removeButton} onClick={handleRemove}>
              <div className={page1Styles.removeIcon}>
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
              </div>
            </button>
          </div>
        ) : value === translatedText['Other (please specify)'] &&
          !otherValue ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              position: 'relative',
            }}
          >
            <input
              type='text'
              value={tempInputValue}
              onChange={(e) => setTempInputValue(e.target.value)}
              onKeyDown={handleInputKeyDown}
              onBlur={() => onOtherChange(tempInputValue)}
              onClick={(e) => e.stopPropagation()}
              placeholder={translatedText['Enter grape variety...']}
              className={page1Styles.otherInput}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                width: 'calc(100% - 40px)',
              }}
            />
            <button
              className={page1Styles.removeButton}
              onClick={handleRemove}
              style={{
                position: 'absolute',
                right: '30px',
                cursor: 'pointer',
                zIndex: 10,
                background: 'transparent',
                border: 'none',
                boxShadow: 'none',
                outline: 'none',
                padding: 0,
              }}
            >
              <div className={page1Styles.removeIcon}>
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
              </div>
            </button>
          </div>
        ) : value ? (
          <div className={page1Styles.selectedBadge}>
            {value}
            <button className={page1Styles.removeButton} onClick={handleRemove}>
              <div className={page1Styles.removeIcon}>
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
              </div>
            </button>
          </div>
        ) : (
          <span
            style={{
              fontFamily: 'Instrument Sans',
              fontSize: '19px',
              lineHeight: '24px',
              color: '#999999',
              opacity: 0.4,
              fontWeight: 'normal',
            }}
          >
            {value || translatedText['Select Grape']}
          </span>
        )}
        <span className={page1Styles.arrow}></span>
      </div>

      {isOpen && (
        <div className={page1Styles.grapeDropdown}>
          {grapeOptions.map((grape) => (
            <div
              key={grape}
              className={page1Styles.option}
              onClick={() => {
                onChange(grape);
                setIsOpen(false);
              }}
            >
              {grape}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
