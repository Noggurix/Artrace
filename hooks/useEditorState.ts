import { useState } from 'react';

export function useEditorState(initialImageBase64: string | null) {
  const [imageBase64] = useState<string | null>(initialImageBase64);
  const [imageWidth, setImageWidth] = useState<number>(0);
  const [imageHeight, setImageHeight] = useState<number>(0);

  const [viewAsTrace, setViewAsTrace] = useState(false);

  return {
    imageBase64,
    imageWidth,
    setImageWidth,
    imageHeight,
    setImageHeight,
    viewAsTrace,
    setViewAsTrace
  };
}