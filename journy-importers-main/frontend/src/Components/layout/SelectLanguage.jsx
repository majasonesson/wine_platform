export const SelectLanguage = ({ handleLanguageChange, language, styles }) => {
  return (
    <select onChange={handleLanguageChange} value={language} className={styles}>
      <option value='en'>English</option>
      <option value='it'>Italian</option>
      <option value='fr'>French</option>
      <option value='es'>Spanish</option>
      <option value='sv'>Swedish</option>
      <option value='pt'>Portuguese</option>
      <option value='el'>Greek</option>
      <option value='bg'>Bulgarian</option>
      <option value='hr'>Croatian</option>
      <option value='cs'>Czech</option>
      <option value='da'>Danish</option>
      <option value='nl'>Dutch</option>
      <option value='et'>Estonian</option>
      <option value='fi'>Finnish</option>
      <option value='de'>German</option>
      <option value='hu'>Hungarian</option>
      <option value='ga'>Irish</option>
      <option value='lv'>Latvian</option>
      <option value='lt'>Lithuanian</option>
      <option value='mt'>Maltese</option>
      <option value='pl'>Polish</option>
      <option value='ro'>Romanian</option>
      <option value='sk'>Slovak</option>
      <option value='sl'>Slovenian</option>
    </select>
  )
}