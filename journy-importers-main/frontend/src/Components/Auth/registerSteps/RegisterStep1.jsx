export const RegisterStep1 = ({
  styles,
  translatedText,
  formData,
  handleChange,
  nextStepValidation,
  termsError,
  setTermsError,
  termsAccepted,
  setTermsAccepted,
}) => {
  return (
    <div className={styles.stepOneContainer}>
      <div className={styles.imageContainer}>
        <div className={styles.textQrContainer}>
          <div className={styles.textContent}>
            <h2>
              {translatedText['Are you ready']} <br />{' '}
              {translatedText['to share your story?']}
            </h2>
            <p>
              {translatedText['Stand out and make an impact with our e-labels']}
              .
            </p>
          </div>
          <img
            src='/assets/Images/Qr1.png'
            alt='Qr-code'
            className={styles.qrImage}
          />
        </div>
        <img
          src='/assets/Images/wineyard1.png'
          alt='Wineyard'
          className={styles.wineyardImage}
        />
      </div>
      <div className={styles.formSection}>
        <h2>{undefined ? 'Sign Up' : translatedText['Sign Up']}</h2>
        <div className={styles.formGroup}>
          <div>
            <label className={styles.label}>
              {undefined ? 'Name' : translatedText['Name']}:{' '}
            </label>
            <input
              className={styles.inputField}
              type='text'
              name='fullName'
              placeholder={translatedText['Write Here']}
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>{undefined ? 'Email' : translatedText['Email']}: </label>
            <input
              className={styles.inputField}
              type='email'
              name='email'
              placeholder={translatedText['Write Here']}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>
              {undefined ? 'Password' : translatedText['Password']}:{' '}
            </label>
            <input
              className={styles.inputField}
              type='password'
              name='password'
              placeholder={translatedText['Write Here']}
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>
              {undefined ? 'Role' : translatedText['Role']}:{' '}
            </label>
            <select
              className={styles.inputField}
              name='role'
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                {translatedText['Select role']}
              </option>
              <option value="Producer">
                {translatedText['Producer']}
              </option>
              <option value="Importer">
                {translatedText['Importer']}
              </option>
            </select>
          </div>
          <div className={styles.checkboxContainer}>
            <label className={styles.customCheckbox}>
              <input
                type='checkbox'
                id='terms'
                checked={termsAccepted}
                onChange={(e) => {
                  setTermsAccepted(e.target.checked);
                  if (e.target.checked) setTermsError(false);
                }}
                required
              />
              <span className={styles.checkmark}></span>
            </label>

            <label
              htmlFor='terms'
              className={termsError ? styles.errorText : ''}
            >
              <a
                rel='document'
                href='/assets/documents/Terms_and_conditions.pdf'
                target='_blank'
                style={{ color: '#4e001d' }}
              >
                {translatedText['I agree to the Terms and Conditions']}
              </a>
            </label>
          </div>

          <button type='button' onClick={nextStepValidation}>
            {undefined ? 'Next' : translatedText['Next']}
          </button>
          <div className={styles.loginLink}>
            Or <a href='/login'>{translatedText['Log in']}</a>{' '}
            {translatedText['if you already have an account']}
          </div>
        </div>
          <footer data-name="footer" className={styles.footer}>
            @Journy{new Date().getFullYear()}{' '}
            {translatedText['all rights reserved']}
          </footer>
      </div>
    </div>
  );
};
