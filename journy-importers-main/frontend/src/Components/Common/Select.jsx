import React from 'react';
import styles from '../../styles/generalProductInformation.module.scss';

export const Select = ({ value, onChange, options, placeholder }) => {
  return (
    <div className={styles.selectContainer}>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className={styles.select}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}; 