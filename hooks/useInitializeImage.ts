import { useEffect } from 'react';
import { Image } from 'react-native';

export function useInitializeImage({
  imageBase64,
  setImageWidth,
  setImageHeight
}: any) {
  useEffect(() => {
      const base64Uri = `data:image/png;base64,${imageBase64}`;

      Image.getSize(base64Uri, (width, height) => {

        setImageWidth(width);
        setImageHeight(height);
      }, (error) => {
        console.warn('Error getting image dimensions:', error);
        setImageWidth(0);
        setImageHeight(0);
      });
  }, [imageBase64]);
}