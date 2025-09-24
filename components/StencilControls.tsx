import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';
import SliderControl from './Slider';

interface StencilControlProps {
  threshold: number;
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

export default function StencilControls({
  threshold,
  setThreshold,
  strokeWidth,
  setStrokeWidth,
  erosionWidth,
  setErosionWidth,
  invertColors,
  setInvertColors,
  stencilColor,
  setStencilColor
}: StencilControlProps) {
  return (
    <>
      <View style={styles.container}>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Invert Colors</Text>
          <Switch value={invertColors} onValueChange={setInvertColors} thumbColor={invertColors ? '#888' : '#ccc'} />
        </View>
        <SliderControl label="Intensity" value={threshold} min={0} max={255} step={1} onChange={setThreshold} />
        <SliderControl label="Stroke Width" value={strokeWidth} min={0} max={10} step={0.1} onChange={setStrokeWidth} />
        <SliderControl label="Erosion" value={erosionWidth} min={0} max={10} step={1} onChange={setErosionWidth} />
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent:'center', paddingVertical: 15 }}>
      <View style={{ width: 300, height: 250 }}>
        <ColorPicker
          color={stencilColor}
          onColorChangeComplete={setStencilColor}
          thumbSize={14}
          sliderSize={30}
          noSnap={true}
          row={true}
          swatches={true}
          swatchesLast={false}
        />
      </View>
  </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { gap: 3, flex: 1, alignItems: "center"},
  switchContainer: { flexDirection: 'row', alignItems: 'center'},
  switchLabel: { color: 'white', marginRight: 10, fontSize: 16 },
});