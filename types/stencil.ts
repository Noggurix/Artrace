export interface StencilProps {
  imageBase64: string | null;
  threshold: number;
  brightness: number;
  contrast: number;
  saturation: number;
  strokeWidth: number;
  erosionWidth: number;
  invertColors: boolean;
  stencilColor: string;
  viewAsTrace: boolean;
}