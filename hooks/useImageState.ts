import { useState } from 'react';

export function useImageState() {
  const [brightness, setBrightness] = useState(1);
  const [contrast, setContrast] = useState(1);
  const [saturation, setSaturation] = useState(1);

  return { brightness, contrast, saturation, setBrightness, setContrast, setSaturation };
}