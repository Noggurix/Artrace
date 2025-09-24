import { useState } from 'react';

export function useStencilState() {
  const [threshold, setThreshold] = useState(128);
  const [strokeWidth, setStrokeWidth] = useState(0);
  const [erosionWidth, setErosionWidth] = useState(0);
  const [invertColors, setInvertColors] = useState(false);
  const [stencilColor, setStencilColor] = useState('#000000');

  return {
    threshold, strokeWidth, erosionWidth, invertColors, stencilColor,
    setThreshold, setStrokeWidth, setErosionWidth, setInvertColors, setStencilColor,
  };
}