import ImageControls from '@/components/ImageControls';
import StencilControls from '@/components/StencilControls';
import TraceControls from '@/components/TraceControls';
import type { ControlPanelProps } from '@/types/controlPanel';
import React, { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

export default function ControlPanel({
	insets,
  activeControl,
  imageOptions,
  stencilOptions,
  traceOptions,
  setActiveControl,

} : ControlPanelProps) {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const prevActive = useRef<String | null>(null);

  useEffect(() => {
    if (!activeControl) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }

    prevActive.current = activeControl;
  }, [activeControl]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 400],
  });

  if (!activeControl && prevActive.current === null) return null;

  return (
    <View style={StyleSheet.absoluteFill}> 
      {activeControl && (
        <TouchableWithoutFeedback onPress={() => setActiveControl(null)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}
      <Animated.View style={[styles.controlsOverlay, { transform: [{ translateY }] }]}>
        <ScrollView
          contentContainerStyle={{ ...styles.scrollContent, paddingBottom: insets.bottom + 50, flexGrow: 1, }}
          showsVerticalScrollIndicator={false} 
        >
          {activeControl === "image" && <ImageControls {...imageOptions} />}
          {activeControl === "stencil" && <StencilControls {...stencilOptions} />}
          {activeControl === "trace" && <TraceControls {...traceOptions} />}
        </ScrollView>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    zIndex: 8,
    
  },
	controlsOverlay: {
		position: "absolute",
		bottom: 0,
    alignSelf: "center",
		width: '95%',
		height: "40%",
		zIndex: 9,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#0000079f'
	},
	scrollContent: { 
		backgroundColor: 'transparent',
  }
});