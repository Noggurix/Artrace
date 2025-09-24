import { useExportImage } from "@/hooks/useExportImage";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

interface ExportPanelProps {
  stencilOutput: string | null;
  traceOutput: string | null;
  viewAsTrace: boolean;
  showExportPanel: boolean;
  setShowExportPanel: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ExportPanel({
  stencilOutput,
  traceOutput,
  viewAsTrace,
  showExportPanel,
  setShowExportPanel
}: ExportPanelProps) {

  const { exportImage } = useExportImage();

  const slideAnim = useRef(new Animated.Value(1)).current;
  const [isMounted, setIsMounted] = React.useState(showExportPanel);

  useEffect(() => {
    if (showExportPanel) {
      setIsMounted(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        setIsMounted(false);
      });
    }
  }, [showExportPanel]);

  if (!isMounted) return null;

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 400],
  });

  return (
    <View style={StyleSheet.absoluteFill}>
      <TouchableWithoutFeedback onPress={() => setShowExportPanel(false)}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.exportOverlay, { transform: [{ translateY }] }]}>
        {!viewAsTrace && stencilOutput && (
          <>
            <Image
              source={{
                uri: stencilOutput.startsWith("data:image")
                  ? stencilOutput
                  : `data:image/png;base64,${stencilOutput}`,
              }}
              style={styles.previewImage}
              resizeMode="contain"
            />

            <View style={styles.buttonsRow}>
              <View style={styles.buttonsContainer}>
                <Text style={{ color: "white" }}>PNG</Text>
                <TouchableOpacity
                  onPress={() => exportImage('png', stencilOutput, null)}
                  style={styles.button}
                >
                  <MaterialIcons name="image" size={28} color="white" />
                </TouchableOpacity>
              </View>

              <View style={styles.buttonsContainer}>
                <Text style={{ color: "white" }}>Share</Text>
                <TouchableOpacity
                  onPress={() => exportImage('share', stencilOutput, null)}
                  style={styles.button}
                >
                  <MaterialIcons name="share" size={28} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        {viewAsTrace && traceOutput && (
          <>
            <Image
              source={{
                uri: traceOutput.startsWith("data:image")
                  ? traceOutput
                  : `data:image/svg+xml;base64,${traceOutput}`,
              }}
              style={styles.previewImage}
              resizeMode="contain"
            />

            <View style={styles.buttonsRow}>
              <View style={styles.buttonsContainer}>
                <Text style={{ color: "white" }}>PNG</Text>
                <TouchableOpacity
                  onPress={() => exportImage('png', null, traceOutput)}
                  style={styles.button}
                >
                  <MaterialIcons name="image" size={28} color="white" />
                </TouchableOpacity>
              </View>

              <View style={styles.buttonsContainer}>
                <Text style={{ color: "white" }}>SVG</Text>
                <TouchableOpacity
                  onPress={() => exportImage('svg', null, traceOutput)}
                  style={styles.button}
                >
                  <MaterialIcons name="image-aspect-ratio" size={28} color="white" />
                </TouchableOpacity>
              </View>

              <View style={styles.buttonsContainer}>
                <Text style={{ color: "white" }}>Share</Text>
                <TouchableOpacity
                  onPress={() => exportImage('share', null, traceOutput)}
                  style={styles.button}
                >
                  <MaterialIcons name="share" size={28} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#00000054",
    zIndex: 10,
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: "#222",
  },
  exportOverlay: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    width: "100%",
    height: "40%",
    zIndex: 11,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    overflow: "hidden",
    backgroundColor: "black",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center"
  },
  buttonsContainer: {
    flexDirection: "column",
    alignItems: "center"
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "50%",
    paddingBottom: 90
  },
  button: {
    padding: 8,
    borderRadius: 8,
    zIndex: 11
  }
});
