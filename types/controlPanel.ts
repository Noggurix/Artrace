import type { EdgeInsets } from 'react-native-safe-area-context';
import type { ControlType } from './controls';

export interface ImageOptions {
  brightness: number;
  setBrightness: (v: number) => void;
  contrast: number;
  setContrast: (v: number) => void;
  saturation: number;
  setSaturation: (v: number) => void;
}

export interface StencilOptions {
  imageBase64?: string | null;
  threshold: number;
  brightness?: number;
  setBrightness?: (v: number) => void;
  contrast?: number;
  setContrast?: (v: number) => void;
  saturation?: number;
  setSaturation?: (v: number) => void;
  viewAsTrace?: boolean;
  setThreshold: (v: number) => void;
  strokeWidth: number;
  setStrokeWidth: (v: number) => void;
  erosionWidth: number;
  setErosionWidth: (v: number) => void;
  invertColors: boolean;
  setInvertColors: (v: boolean) => void;
  stencilColor: string;
  setStencilColor: (v: string) => void;
}

export interface TraceOptions {
  numberOfColors: number;
  setNumberOfColors: (v: number) => void;
  ltres: number;
  setLtres: (v: number) => void;
  qtres: number;
  setQtres: (v: number) => void;
  pathomit: number;
  setPathomit: (v: number) => void;
  minColorRatio: number;
  setMinColorRatio: (v: number) => void;
  colorSampling: number;
  setColorSampling: (v: number) => void;
  colorQuantCycles: number;
  setColorQuantCycles: (v: number) => void;
  rightAngleEnhance: boolean;
  setRightAngleEnhance: (v: boolean) => void;
  traceStrokeWidth: number;
  setTraceStrokeWidth: (v: number) => void;
  lineFilter: boolean;
  setLineFilter: (v: boolean) => void;
  roundCoords: number;
  setRoundCoords: (v: number) => void;
  blurRadius: number;
  setBlurRadius: (v: number) => void;
  blurDelta: number;
  setBlurDelta: (v: number) => void;
}

export interface ControlPanelProps {
  insets: EdgeInsets;
  activeControl: ControlType | null;
  setActiveControl: (control: ControlType | null) => void;
  imageOptions: ImageOptions;
  stencilOptions: StencilOptions;
  traceOptions: TraceOptions;
}