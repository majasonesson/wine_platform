import { regions } from '../../../Utils/regions';
import BrandInput from '../../layout/BrandInput';
import { Footer } from '../../layout/Footer';

export const RegisterStep2 = ({
  styles,
  translatedText,
  formData,
  setFormData,
  handleChange,
  language,
  handleLanguageChange,
  nextStepValidation,
}) => {
  return (
    <div className={styles.formSection2}>
      <h2>
        {undefined
          ? 'Company Information'
          : translatedText['Company Information']}
      </h2>
      <div className={styles.formGroup2}>
        <div>
          <label>
            {undefined ? 'Company Names' : translatedText['Company Names']}: *{' '}
          </label>
          <BrandInput
            name='Company'
            brands={formData?.Company}
            setBrands={(newBrands) => {
              setFormData((prev) => ({
                ...prev,
                Company: newBrands,
              }));
            }}
            onChange={handleChange}
            translatedText={translatedText}
          />
          <p className={styles.companyHelperText}>{translatedText['Write the company name and click the (+) or Enter button to add companies']}</p>
        </div>

        <div>
          <label>{undefined ? 'Country' : translatedText['Country']}: *</label>
          <select
            className={styles.inputField}
            name='country'
            onChange={(e) => {
              handleLanguageChange(e);
              handleChange(e);
            }}
            value={language && formData.country}
            required
          >
            <option value='' disabled>
              {translatedText['Select country']}
            </option>
            <option value='en|England'>England</option>
            <option value='fr|France'>France</option>
            <option value='es|Spain'>Spain</option>
            <option value='it|Italy'>Italy</option>
            <option value='el|Greece'>Greece</option>
            <option value='sv|Sweden'>Sweden</option>
            <option value='de|Austria'>Austria</option>
            <option value='nl|Belgium'>Belgium</option>
            <option value='bg|Bulgaria'>Bulgaria</option>
            <option value='hr|Croatia'>Croatia</option>
            <option value='el|Cyprus'>Cyprus</option>
            <option value='cs|Czech'>Czech</option>
            <option value='da|Denmark'>Denmark</option>
            <option value='de|Estonia'>Estonia</option>
            <option value='fi|Finland'>Finland</option>
            <option value='de|Germany'>Germany</option>
            <option value='hu|Hungary'>Hungary</option>
            <option value='ga|Ireland'>Ireland</option>
            <option value='lv|Latvia'>Latvia</option>
            <option value='lt|Lithuania'>Lithuania</option>
            <option value='fr|Luxembourg'>Luxembourg</option>
            <option value='mt|Malta'>Malta</option>
            <option value='nl|Netherlands'>Netherlands</option>
            <option value='pl|Poland'>Poland</option>
            <option value='pt|Portugal'>Portugal</option>
            <option value='ro|Romania'>Romania</option>
            <option value='sk|Slovakia'>Slovakia</option>
            <option value='sl|Slovenia'>Slovenia</option>
          </select>
        </div>
        {formData.country ? (
          <div>
            <label>{undefined ? 'Region' : translatedText['Region']}: *</label>

            <select
              name='region'
              value={formData.region}
              onChange={handleChange}
              className={styles.inputField}
              required
            >
              <option value='' disabled>
                {undefined ? 'Select region' : translatedText['Select region']}
              </option>
              {regions[formData.country.split('|')[1]]?.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <>
            <div>
              <label>{undefined ? 'Region' : translatedText['Region']}:</label>
              <select
                name='region'
                value={formData.region}
                onChange={handleChange}
                className={styles.inputField}
                required
                disabled
              >
                <option value='' required disabled>
                  {translatedText['Select region']}
                </option>
              </select>
            </div>
          </>
        )}
        {formData.region && (
          <div>
            <label>
              {undefined ? 'District *' : translatedText['District']}:{' '}
            </label>
            <input
              className={styles.inputField}
              type='text'
              name='district'
              placeholder={translatedText['Write Here']}
              value={formData.district}
              onChange={handleChange}
            />
          </div>
        )}

        <button type='button' onClick={nextStepValidation}>
          {undefined ? 'Next' : translatedText['Next']}
        </button>
      </div>
    </div>
  );
};
