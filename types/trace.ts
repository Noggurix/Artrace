export interface TraceProps {
  imageBase64: string | null;
  imageWidth: number;
  imageHeight: number;
  numberOfColors: number;
  ltres: number;
  qtres: number;
  pathomit: number;
  rightAngleEnhance: boolean;
  minColorRatio: number;
  colorSampling: number;
  colorQuantCycles: number;
  viewAsTrace: boolean;
  traceStrokeWidth: number;
  lineFilter: boolean;
  roundCoords: number;
  blurRadius: number;
  blurDelta: number;
}

export interface TraceProcessorOptions {
  imageWidth: number;
  imageHeight: number;
  numberOfColors: number;
  ltres: number;
  qtres: number;
  pathomit: number;
  rightAngleEnhance: boolean;
  minColorRatio: number;
  colorSampling: number;
  colorQuantCycles: number;
  traceStrokeWidth: number;
  lineFilter: boolean;
  roundCoords: number;
  blurRadius: number;
  blurDelta: number;
}