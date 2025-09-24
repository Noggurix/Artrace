import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, LayoutChangeEvent, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ModeSwitcherProps {
  viewAsTrace: boolean;
  setViewAsTrace: (value: boolean) => void;
}

export default function ModeSwitcher({ viewAsTrace, setViewAsTrace }: ModeSwitcherProps) {
  const [visible, setVisible] = useState(true);
  const [height, setHeight] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const slideOffsetAnim = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<number | null>(null);

  const screenWidth = Dimensions.get('window').width;
  const panelWidth = 115;
  const toggleWidth = 40;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const handleToggle = () => {
    setVisible(!visible);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    opacityAnim.setValue(1);
    slideOffsetAnim.setValue(0);

    timeoutRef.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0.5,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideOffsetAnim, {
          toValue: -10,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }, 3000);
  };

useEffect(() => {
  return () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };
}, []);

  const maxTranslate = screenWidth - (panelWidth + toggleWidth);
  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -Math.min(80, maxTranslate)],
  });

  const translateY = -(height / 2);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setHeight(height);
  };

  return (
    <Animated.View
      onLayout={handleLayout}
      style={[styles.container, { transform: [{ translateX }, { translateY }] }]}
    >
      <View style={styles.viewModeRow}>
        <Text style={styles.modeLabel}>Mode</Text>
        <View>
          <TouchableOpacity style={styles.viewModeButton} onPress={() => setViewAsTrace(false)}>
            <Text style={[styles.viewModeText, !viewAsTrace && styles.viewModeTextActive]}>Stencil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.viewModeButton} onPress={() => setViewAsTrace(true)}>
            <Text style={[styles.viewModeText, viewAsTrace && styles.viewModeTextActive]}>Trace</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Animated.View
        style={{
          opacity: opacityAnim,
          transform: [{ translateX: slideOffsetAnim }],
        }}
      >
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={handleToggle}
        >
          <MaterialIcons
            name={visible ? "chevron-left" : "chevron-right"}
            size={28}
            color="white"
          />
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    top: "50%",
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
  },
  viewModeRow: {
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    width: 80,
    backgroundColor: "#0b0e15d3",
    paddingVertical: 10,
  },
  toggleButton: {
    backgroundColor: "#0b0e15d3",
    paddingLeft: 7,
    paddingVertical: 10,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15
  },
  modeLabel: {
    color: "#777777ff",
    marginTop: 2,
    fontSize: 10,
  },
  viewModeButton: {
    paddingVertical: 20,
		alignItems: 'center'
  },
  viewModeText: {
    fontSize: 16,
    color: "white",
    fontWeight: "500",
  },
  viewModeTextActive: {
    color: "lightblue",
    fontWeight: "bold",
  },
});
