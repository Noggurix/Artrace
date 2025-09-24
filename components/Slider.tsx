import Slider from '@react-native-community/slider';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

type SliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
};

export default function SliderControl({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: SliderProps) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ color: 'white', textAlign: 'center' }}>
        {label}: {step < 1 ? displayValue.toFixed(2) : Math.round(displayValue)}
      </Text>
      <Slider
        style={{ width: 250, height: 40 }}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value}
        onValueChange={setDisplayValue}
        onSlidingComplete={onChange}
        minimumTrackTintColor="#888"
        maximumTrackTintColor="#ccc"
        thumbTintColor="#5e94a4ff"
      />
    </View>
  );
}