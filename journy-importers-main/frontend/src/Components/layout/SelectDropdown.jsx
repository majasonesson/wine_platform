import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "../../styles/select.module.css"

export default function SelectDropdown({
  multiple,
  selectedValue,
  onChange,
  options,
  required,
  translatedText,
  placeholder = 'Select...',
  name,
  className
}) {
  const [isOpen, setIsOpen] = useState(false); // State to track if the dropdown is open
  const [highlightedIndex, setHighlightedIndex] = useState(0); // State to track the highlighted option for keyboard navigation
  const containerRef = useRef(null); // Ref to the select container for event handling
  const valueRef = useRef(null); // Ref to the value container to detect overflow
  const selectButtonRef = useRef(null); // Ref to the select button container
  const [defaultValue, setDefaultValue] = useState(true); // State to manage the display of the default value
  const [showError, setShowError] = useState(false); // State to track if the required error should be shown
  const [contentOverflow, setContentOverflow] = useState(false); // State to track if content overflows

  // Säkerställ att options är en array
  const safeOptions = Array.isArray(options) ? options : [];

  // Hitta det valda alternativet säkert
  const selectedOption = safeOptions.find(option => option.value === selectedValue);

  // Function to check for content overflow
  const checkForOverflow = useCallback(() => {
    if (selectButtonRef.current) {
      // Mät containerns faktiska bredd
      const containerWidth = selectButtonRef.current.clientWidth;
      let badgesWidth = 0;
      let badgesCount = 0;
      
      // Beräkna total bredd av alla badges
      if (selectedValue && selectedValue.length > 0) {
        const badges = selectButtonRef.current.querySelectorAll(`.${styles["option-badge"]}`);
        badges.forEach(badge => {
          badgesWidth += badge.offsetWidth;
          badgesCount++;
        });
        
        // Lägg till marginalen mellan badges (2px på varje sida)
        if (badgesCount > 1) {
          badgesWidth += (badgesCount - 1) * 4;
        }
      }
      
      // Reservera utrymme för caret-icon och padding
      const reservedSpace = 60; // 40px för caret + 20px för inre padding
      
      // Jämför den faktiska bredden med tillgängligt utrymme
      const hasOverflow = badgesWidth > (containerWidth - reservedSpace);
      
      // Sätt contentOverflow endast om utrymmet faktiskt inte räcker
      setContentOverflow(hasOverflow);
    }
  }, [selectedValue]);

  // Check for overflow when selected values change
  useEffect(() => {
    checkForOverflow();
    // Add a small delay to ensure accurate measurement after rendering
    const timer = setTimeout(() => {
      checkForOverflow();
    }, 10);
    return () => clearTimeout(timer);
  }, [selectedValue, checkForOverflow]);

  // Also check on window resize
  useEffect(() => {
    window.addEventListener('resize', checkForOverflow);
    return () => window.removeEventListener('resize', checkForOverflow);
  }, [checkForOverflow]);

  // Function to clear the selected options
  function clearOptions(e) {
    e.preventDefault();

    multiple ? onChange([]) : onChange(undefined);
    setDefaultValue(true); // Show default value again when cleared
  }

  function selectOption(option) {
    let newOption;
    // If multiple selection is true, toggle the option in the selected values
    if (multiple) {
      if (selectedValue.some(selected => selected.value === option.value)) {
        newOption = selectedValue.filter(selected => selected.value !== option.value); // Deselect option
      } else {
        newOption = [...selectedValue, option]; // Select option
      }

      onChange(newOption);
    // If multiple selection is false
    } else {
      // Select option or deselect if already selected
      const isSelected = selectedValue.some(selected => selected.value === option.value);
      newOption = !isSelected ? [option] : [];
      onChange(newOption);
    }

    // Hide default value when at least one option is selected
    setDefaultValue(newOption.length === 0);
    setShowError(newOption.length === 0 && required);
  }

  useEffect(() => {
    // Reset highlighted index
    if (isOpen) setHighlightedIndex(0);
  }, [isOpen]);

  // Effect to handle keyboard navigation and selection
  useEffect(() => {
    const handler = (e) => {
      if (e.target !== containerRef.current) return;
      switch (e.code) {
        // Enter or Space toggles the dropdown and selects the highlighted option if the dropdown is open
        case "Enter":
        case "Space":
          setIsOpen(prev => !prev); // Toggle dropdown open/close
          if (isOpen) selectOption(selectedOption[highlightedIndex]);
          break;
        // ArrowUp and ArrowDown navigate through the options
        case "ArrowUp":
        case "ArrowDown": {
          if (!isOpen) {
            setIsOpen(true);
            break;
          }

          // Navigate through options with arrow keys
          const newOption = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1);
          if (newOption >= 0 && newOption < selectedOption.length) {
            setHighlightedIndex(newOption); // Update highlighted index
          }
          break;
        }
        case "Escape":
          setIsOpen(false); // Close dropdown on Escape key
          break;
      }
    };

    /* Add event listeners for keyboard events */
    if (containerRef.current) {
      containerRef.current.addEventListener("keydown", handler); // Add event listener for keyboard navigation
    }
    
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("keydown", handler); // Clean up event listener
      }
    };
  }, [isOpen, highlightedIndex, selectedOption]);

  // Stäng dropdown när man klickar utanför
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options to exclude selected ones
  const filteredOptions = safeOptions?.filter(
    option => !selectedValue.some(selectedOption => selectedOption.value === option.value)
  );
  
  // // Using all options instead of filtering out selected ones
  // const filteredOptions = safeOptions;

  // Lista över kategorinamn som ska döljas (oavsett språk)
  const hiddenCategoryPatterns = [
    /undefined/i
    // Ytterligare språkmönster för andra språk kan läggas till här
  ];

  // Funktion för att kontrollera om en kategori ska döljas
  const shouldHideCategory = (category) => {
    return hiddenCategoryPatterns.some(pattern => pattern.test(category));
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className={`${styles.selectDropdownWrapper} ${className || ''} ${required && (!selectedValue || selectedValue.length === 0) ? styles.required : ''}`}
    >
      {/* Select field container */}
      <div 
        className={`${styles.container} 
          ${isOpen ? styles.open : ''} 
          ${className || ''} 
          ${required && (!selectedValue || selectedValue.length === 0) ? styles.required : ''}
          ${multiple && selectedValue.length > 1 ? styles['has-multiple-values'] : ''}
          ${multiple && selectedValue.length >= 3 ? styles['has-three-plus-values'] : ''}
          ${contentOverflow ? styles['content-overflow'] : ''}
        `}
        onClick={() => setIsOpen(prev => !prev)}
      >
        <div className={styles.selectButton} ref={selectButtonRef}>
          <span ref={valueRef}>
            {multiple
              ? selectedValue.map(selected => (
                <button
                  key={selected.value}
                  onClick={e => {
                    e.preventDefault()
                    e.stopPropagation();
                    selectOption(selected);
                  }}
                  className={styles["option-badge"]}
                  title={selected.label}
                >
                  {/* Direct text rendering for certificates */}
                  {className?.includes('certificatesSelect') ? selected.label : (
                    <span className={styles["option-label"]}>{selected.label}</span>
                  )}
                  <span className={styles["remove-btn"]}>
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="6.5" cy="6.5" r="6.5" fill="#E7E7E7"/>
                      <path d="M4 4L9.10001 8.71429M9.10001 4L4 8.71429" stroke="#D8D8D8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </button>
              ))
              : placeholder}
          </span>
        </div>

        <div 
          className={styles.caret}
        ></div>
      </div>

      {/* Dropdown menu as a sibling to the select field */}
      {isOpen && (
        <div className={`${styles.dropdownContainer} ${className?.includes('certificatesDropdownTop') ? styles.dropdownOnTop : ''}`}>
          <ul className={styles.optionsList}>
            {Object.entries(
              filteredOptions.reduce((acc, option) => {
                if (!acc[option.category]) {
                  acc[option.category] = [];
                }
                acc[option.category].push(option);
                return acc;
              }, {})
            ).map(([category, categoryOptions]) => (
              <React.Fragment key={category}>
                {/* Rendera kategorinamnet bara om det inte finns i listan över dolda kategorier */}
                {!shouldHideCategory(category) && (
                  <li className={styles.category}>{category}</li>
                )}
                {categoryOptions.map((option, index) => {
                  // Beräkna om just detta alternativ ska vara markerat
                  const isSelected = multiple 
                    ? selectedValue.some(selected => selected.value === option.value)
                    : selectedValue.some(selected => selected.value === option.value);
                  
                  // Beräkna om just detta alternativ är highlightat
                  const isHighlighted = index === highlightedIndex 
                    && categoryOptions === filteredOptions[category];

                  // Om det är första option i första kategorin, lägg den i en egen div
                  if (index === 0 && category === Object.keys(filteredOptions.reduce((acc, opt) => {
                    if (!acc[opt.category]) acc[opt.category] = [];
                    acc[opt.category].push(opt);
                    return acc;
                  }, {}))[0]) {
                    return (
                        <li
                          key={index}
                          onClick={e => {
                            e.stopPropagation();
                            selectOption(option);
                            setIsOpen(false);
                          }}
                          onMouseEnter={() => setHighlightedIndex(index)}
                          className={`${styles.option} ${isSelected ? styles.selected : ""} ${isHighlighted ? styles.highlighted : ""}`}
                        >
                          {option.label}
                        </li>
                    );
                  }
                    
                  return (
                    <li
                      key={option.value}
                      onClick={e => {
                        e.stopPropagation();
                        selectOption(option);
                        setIsOpen(false);
                      }}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={`${styles.option} ${isSelected ? styles.selected : ""} ${isHighlighted ? styles.highlighted : ""}`}
                    >
                      {option.label}
                    </li>
                  );
                })}
              </React.Fragment>
            ))}
          </ul>
        </div>
      )}
      
      {/* Display error message if the field is required and not selected */}
      {/* Commented out the error message:
      {required && showError && <div className={styles.error}>{translatedText['This field is required']}</div>}
      */}
    </div>
  );
}
