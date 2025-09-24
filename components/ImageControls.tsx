import type { ImageOptions } from '@/types/controlPanel';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import SliderControl from './Slider';

export default function ImageAdjustSliders({
  brightness,
  setBrightness,
  contrast,
  setContrast,
  saturation,
  setSaturation,
}: ImageOptions) {
  return (
    <View style={styles.container}>     
      <SliderControl label="Brightness" value={brightness} min={0} max={2} step={0.01} onChange={setBrightness} />
      <SliderControl label="Contrast" value={contrast} min={0} max={2} step={0.01} onChange={setContrast} />
      <SliderControl label="Saturation" value={saturation} min={0} max={2} step={0.01} onChange={setSaturation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 3,
    flex: 1,
    paddingTop: 20,
    alignItems: 'center'
  }
});