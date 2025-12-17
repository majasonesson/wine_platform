import { useState, useEffect } from 'react';
import page1Styles from '../../../../styles/productPage1.module.scss';

export const CustomDropdown = ({
  label,
  name,
  value,
  options,
  onChange,
  translatedText,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (e) => {
        if (!e.target.closest(`.${page1Styles.customDropdown}`)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  const handleOptionClick = (optionValue) => {
    onChange(
      {
        target: {
          name: name,
          value: optionValue,
          type: 'select',
        },
      },
      'productInfo'
    );
    setIsOpen(false);
  };

  const displayValue = value
    ? options.find((opt) => opt.value === value)?.label || value
    : '';

  return (
    <div className={page1Styles.field}>
      <label>{translatedText[label]}</label>
      <div className={page1Styles.customDropdown}>
        <div
          className={`${page1Styles.dropdownHeader} ${
            isOpen ? page1Styles.open : ''
          }`}
          onClick={() => setIsOpen(!isOpen)}
          style={{ zIndex: isOpen ? 20 : 10 }}
        >
          {value ? (
            <div className={page1Styles.selectedContainer}>
              <button className={page1Styles['option-badge']}>
                {displayValue}
                <span
                  className={page1Styles['remove-btn']}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(
                      {
                        target: {
                          name: name,
                          value: '',
                          type: 'select',
                        },
                      },
                      'productInfo'
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
          ) : name !== 'NetQuantity' ? (
            <span
              style={{
                fontFamily: 'Instrument Sans',
                fontSize: '16px !important',
                lineHeight: '24px',
                color: '#999999',
                opacity: 0.4,
                fontWeight: 'normal',
              }}
            >
              {translatedText['Select']}
            </span>
          ) : (
            <span
              style={{
                fontFamily: 'Instrument Sans',
                fontSize: '16px !important',
                lineHeight: '24px',
                color: '#999999',
                opacity: 0.4,
                fontWeight: 'normal',
              }}
            ></span>
          )}
          <svg width='23' height='14' viewBox='0 0 23 14' fill='none'>
            <path d='M22 1L11.5 12L1 1' stroke='#717171' strokeWidth='2' />
          </svg>
        </div>
        {isOpen && (
          <div
            className={page1Styles.dropdownList}
            onClick={(e) => e.stopPropagation()}
            style={{ zIndex: 5, paddingTop: '1rem' }}
            id={`div_dropdownList_${name.toLowerCase()}`}
          >
            {options
              .filter((option) => option.value !== '') // Filtrera bort "Select" alternativet
              .map((option) => (
                <div
                  key={option.value}
                  className={page1Styles.option}
                  onClick={() => handleOptionClick(option.value)}
                  data-value={option.value}
                  data-category={name}
                >
                  {option.label}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
