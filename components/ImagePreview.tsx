import React from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';

interface ImagePreviewProps {
  insets: EdgeInsets;
  stencilOutput: string | null;
  traceOutput: string | null;
  isStencilProcessing: boolean;
  isTracing: boolean;
  viewAsTrace: boolean;
  dynamicImageStyle?: any;
}

export default function ImagePreview({
  insets,
  stencilOutput,
  traceOutput,
  isStencilProcessing,
  isTracing,
  viewAsTrace,
  dynamicImageStyle,
}: ImagePreviewProps) {
  if (!stencilOutput) {
    return (
      <View style={[styles.container, {paddingBottom: insets.bottom - 50}]}>
        <View style={styles.initialProcessingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{ color: 'white', marginTop: 10 }}>
            Processing image...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, {paddingBottom: insets.bottom - 50}]}>
      <View>
        {viewAsTrace ? (
          traceOutput ? (
            <Image
              source={{ uri: traceOutput.startsWith("data:image") ? traceOutput : `data:image/png;base64,${traceOutput}` }}
              style={dynamicImageStyle}
              fadeDuration={0}
              blurRadius={isStencilProcessing || isTracing ? 5 : 0}
              resizeMode="contain"
            />
          ) : (
              <Image
                source={{ uri: stencilOutput.startsWith('data:image') ? stencilOutput : `data:image/png;base64,${stencilOutput}` }}
                style={dynamicImageStyle}
                fadeDuration={0}
                blurRadius={isStencilProcessing || isTracing ? 5 : 0}
                resizeMode="contain"
              />
          )
        ) : (
            <Image 
              source={{ uri: stencilOutput.startsWith('data:image') ? stencilOutput : `data:image/png;base64,${stencilOutput}` }}
              style={dynamicImageStyle}
              fadeDuration={0} 
              blurRadius={isStencilProcessing || isTracing ? 5 : 0}
              resizeMode="contain"
            />
        )}
        {(isStencilProcessing || isTracing) && (
          <View style={[StyleSheet.absoluteFillObject, styles.processingOverlay]}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={{ color: 'white', marginTop: 10 }}>
              {isStencilProcessing && isTracing
                ? 'Processing and vectorizing image...'
                : isTracing
                ? 'Vectorizing image...'
                : 'Processing image...'
              }
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  processingOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  initialProcessingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  container: {
    flex: 1,
    justifyContent:'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  }
});