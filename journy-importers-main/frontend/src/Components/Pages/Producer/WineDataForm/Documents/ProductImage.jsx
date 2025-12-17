import uploadImage from '/assets/Images/uploadImage.svg';
import { useState, useEffect } from 'react';
import styles from '../../../../../styles/productImage.module.scss';

export const ProductImage = ({
  image,
  setImage,
  translatedText
}) => {
  const [previewImage, setPreviewImage] = useState(null);

  // Effect to set the previously uploaded image as the preview on initial load
  useEffect(() => {
    if (image && typeof image === 'string') {
      setPreviewImage(image); // Use the image URL from the server
    }
  }, [image]);

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setPreviewImage(imageUrl); // Set the preview image to the new file
      setImage(selectedFile); // Store the selected file in the state for further processing
    }
  };

  return (
    <div className={styles['product-image']}>
      <h2>{translatedText['Product Image']}</h2>
      <div className={styles['upload-wrapper']}>
        {!previewImage ? (
          <>
            <input
              accept='image/*'
              type='file'
              id='imageInput'
              name='imageInput'
              onChange={handleImageChange}
            />
            <label htmlFor='imageInput'>
              <img src={uploadImage} alt='uploadImage' />
            </label>
          </>
        ) : (
          <div className={styles['preview-wrapper']}>
            <img src={previewImage} alt='Product Preview' />
            <button
              onClick={() => {
                setImage(null); // Clear the image in state
                setPreviewImage(null); // Clear the preview image
              }}
            >
              X
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
