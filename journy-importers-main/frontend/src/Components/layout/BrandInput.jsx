import React, { useState, useRef, useEffect } from 'react';
import { X, PlusCircle } from 'lucide-react';
import styles from './brandInput.module.scss';

const BrandInput = ({
  name,
  brands,
  setBrands,
  translatedText,
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const addBrand = () => {
    if (inputValue && !brands.includes(inputValue)) {
      // Format the brand with a space suffix if it's not the first brand
      const formattedInput = brands.length > 0 ? ` ${inputValue}` : inputValue;
      const newBrands = [...brands, formattedInput];

      setBrands(newBrands);
      setInputValue('');
    } else if (inputValue && brands.includes(inputValue)) {
      // Could add a visual feedback for duplicates here
      setInputValue('');
    }
  };

  const removeBrand = (indexToRemove) => {
    const newBrands = brands.filter((_, index) => index !== indexToRemove);
    setBrands(newBrands);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addBrand();
    } else if (e.key === 'Backspace' && !inputValue && brands.length > 0) {
      removeBrand(brands.length - 1);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className={styles.brandInputWrapper}>
      <div
        className={styles.brandInputContainer}
        onClick={handleContainerClick}
        ref={containerRef}
      >
        {brands.map((brand, index) => (
          <div className={styles.brandBubble} key={index}>
            <span className={styles.brandText}>{brand}</span>
            <button
              type='button'
              className={styles.removeBrand}
              onClick={(e) => {
                e.stopPropagation();
                removeBrand(index);
              }}
              aria-label={`Remove ${brand}`}
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <input
          ref={inputRef}
          type='text'
          name={name}
          className={styles.brandInput}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </div>
      <button 
        type="button"
        className={styles.addButton}
        onClick={(e) => {
          e.preventDefault();
          addBrand();
        }}
        aria-label="Add company"
      >
        <PlusCircle size={20} />
      </button>
    </div>
  );
};

export default BrandInput;
