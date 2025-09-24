import { useState } from 'react';

export function useTraceState() {
  const [numberOfColors, setNumberOfColors] = useState(16);
  const [ltres, setLtres] = useState(1);
  const [qtres, setQtres] = useState(1);
  const [pathomit, setPathomit] = useState(8);
  const [minColorRatio, setMinColorRatio] = useState(0);
  const [colorSampling, setColorSampling] = useState(2);
  const [colorQuantCycles, setColorQuantCycles] = useState(3);
  const [rightAngleEnhance, setRightAngleEnhance] = useState(true);
  const [traceStrokeWidth, setTraceStrokeWidth] = useState(1);
  const [lineFilter, setLineFilter] = useState(false);
  const [roundCoords, setRoundCoords] = useState(1);
  const [blurRadius, setBlurRadius] = useState(0);
  const [blurDelta, setBlurDelta] = useState(20);

  return {
    numberOfColors, 
    ltres, 
    qtres, 
    pathomit, 
    minColorRatio,
    colorSampling, 
    colorQuantCycles, 
    rightAngleEnhance, 
    traceStrokeWidth,
    lineFilter,
    roundCoords,
    blurRadius,
    blurDelta,
    setNumberOfColors, 
    setLtres, 
    setQtres, 
    setPathomit,
    setMinColorRatio, 
    setColorSampling, 
    setColorQuantCycles, 
    setRightAngleEnhance, 
    setTraceStrokeWidth,
    setLineFilter,
    setRoundCoords,
    setBlurRadius,
    setBlurDelta
  };
}