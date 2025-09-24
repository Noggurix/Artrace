import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import SliderControl from './Slider';

interface TraceControlsProps {
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

export default function TraceControls({
  numberOfColors,
  setNumberOfColors,
  ltres,
  setLtres,
  qtres,
  setQtres,
  pathomit,
  setPathomit,
  minColorRatio,
  setMinColorRatio,
  colorSampling,
  setColorSampling,
  colorQuantCycles,
  setColorQuantCycles,
  rightAngleEnhance,
  setRightAngleEnhance,
  traceStrokeWidth,
  setTraceStrokeWidth,
  lineFilter,
  setLineFilter,
  roundCoords,
  setRoundCoords,
  blurRadius,
  setBlurRadius,
  blurDelta,
  setBlurDelta,
}: TraceControlsProps) {
  return (
    <>
      <View style={styles.container}>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Enhance Right Angles</Text>
          <Switch value={rightAngleEnhance} onValueChange={setRightAngleEnhance} thumbColor={rightAngleEnhance ? '#888' : '#ccc'} />
        </View>
        <SliderControl label="Straight Line Tolerance" value={ltres} min={0.1} max={10} step={0.01} onChange={setLtres} />
        <SliderControl label="Quadratic Curve Tolerance" value={qtres} min={0.1} max={10} step={0.01} onChange={setQtres} />
        <SliderControl label="Ignore Small Paths" value={pathomit} min={0} max={200} step={1} onChange={setPathomit} />
        <SliderControl label="Color Sampling Type" value={colorSampling} min={0} max={2} step={1} onChange={setColorSampling} />
        <SliderControl label="Number of Colors" value={numberOfColors} min={2} max={256} step={1} onChange={setNumberOfColors} />
        <SliderControl label="Minimum Color Proportion" value={minColorRatio} min={0} max={1} step={0.01} onChange={setMinColorRatio} />
        <SliderControl label="Color Quantization Cycles" value={colorQuantCycles} min={1} max={10} step={1} onChange={setColorQuantCycles} />
        <SliderControl label="Stroke Width" value={traceStrokeWidth} min={0} max={5} step={0.1} onChange={setTraceStrokeWidth} />
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Line Filter</Text>
          <Switch value={lineFilter} onValueChange={setLineFilter} thumbColor={lineFilter ? '#888' : '#ccc'} />
        </View>
        <SliderControl label="Round Coords" value={roundCoords} min={0} max={9} step={0.1} onChange={setRoundCoords} />
        <SliderControl label="Blur Radius" value={blurRadius} min={0} max={5} step={1} onChange={setBlurRadius} />
        <SliderControl label="Blur Delta" value={blurDelta} min={0} max={100} step={1} onChange={setBlurDelta} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {  gap: 3, flex: 1, justifyContent: 'center', alignItems: 'center'},
  switchContainer: { flexDirection: 'row', alignItems: 'center'},
  switchLabel: { color: 'white', marginRight: 10, fontSize: 16 },
});