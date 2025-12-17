import styles from '../../../../../styles/sustainabilityCertificationLogo.module.scss';

export const SustainabilityCertificationLogos = ({
  wineData,
  handleWineChange,
  sustainabilityImages,
  setSustainabilityImages,
  translatedText,
}) => {

  // Handle the addition of sustainability certification images
  const handleSustainabilityImagesChange = (e) => {
    const selectedFiles = Array.from(e.target.files); // Convert FileList to an array
    setSustainabilityImages((prevImages) => [...prevImages, ...selectedFiles]); // Append new files to the existing state
  };

  // Handle the removal of a specific sustainability image
  const handleSustainabilityImagesRemove = (image) => {
    setSustainabilityImages(
      sustainabilityImages.filter((img) => {
        if (typeof img === 'string') {
          return extractFileNameFromUrl(img) !== extractFileNameFromUrl(image);
        } else {
          return img.name !== image.name;
        }
      })
    );
  };

  // Function to extract the image name from a URL
  const extractFileNameFromUrl = (url) => {
    try {
      const decodedUrl = decodeURIComponent(url);
      return decodedUrl.split('/').pop().split('?')[0];
    } catch (error) {
      console.error('Error extracting file name from URL:', error);
      return translatedText['Unknown file'];
    }
  };

  return (
    <div className={styles['sustainability-certification']}>
      <h3>
        {translatedText['Sustainability Certification Logos']}
      </h3>
      <div className={styles['sustainability-content']}>
        <div className={styles['upload-wrapper']}>
          <input
            type='file'
            id='sustainabilityImagesInput'
            multiple
            onChange={(e) => handleSustainabilityImagesChange(e)}
          />
          <label htmlFor='sustainabilityImagesInput' className='cursor-pointer'>
            <img src={'/assets/Images/uploadImage.svg'} alt='uploadImage' className='h-52' />
          </label>
        </div>

        <div className={styles['checkbox-container']}>
          <label className={styles['toggle-switch']}>
            <input
              type='checkbox'
              name='Organic'
              checked={wineData.Organic}
              onChange={(e) => handleWineChange(e)}
            />
            <span className={styles['slider']}></span>
          </label>
          {translatedText['Organic Wine']}
        </div>

        {sustainabilityImages.map((image, index) => (
          <div key={index} className={styles['image-preview']}>
            <span>
              {typeof image === 'string'
                ? extractFileNameFromUrl(image)
                : image.name}
            </span>
            <button
              onClick={() => handleSustainabilityImagesRemove(image)}
              style={{ marginLeft: '10px', color: 'red' }}
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
