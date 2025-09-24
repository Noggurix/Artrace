import BottomToolBar from '@/components/BottomToolBar';
import ControlPanel from '@/components/ControlPanel';
import ExportPanel from '@/components/ExportPanel';
import ImagePreview from '@/components/ImagePreview';
import ModeSwitcher from '@/components/ModeSwitcher';
import Topbar from '@/components/TopBar';
import { useEditorState } from '@/hooks/useEditorState';
import { useImageState } from '@/hooks/useImageState';
import { ImageStore } from '@/hooks/useImageStore';
import { useInitializeImage } from '@/hooks/useInitializeImage';
import { useStencil } from '@/hooks/useStencil';
import { useStencilState } from '@/hooks/useStencilState';
import { useTrace } from '@/hooks/useTrace';
import { useTraceState } from '@/hooks/useTraceState';
import { useEffect, useMemo, useState } from 'react';
import { Dimensions } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

export default function EditorScreen() {
  const {
    imageBase64,
    imageWidth,
    setImageWidth,
    imageHeight,
    setImageHeight,
    viewAsTrace,
    setViewAsTrace
  } = useEditorState(ImageStore.get());

  const { 
    brightness, 
    contrast, 
    saturation, 
    setBrightness, 
    setContrast, 
    setSaturation 
  } = useImageState();

  const {
    threshold,
    strokeWidth,
    erosionWidth,
    invertColors,
    stencilColor,
    setThreshold,
    setStrokeWidth,
    setErosionWidth,
    setInvertColors,
    setStencilColor
  } = useStencilState();

  const {
    numberOfColors,
    ltres,
    qtres,
    pathomit,
    rightAngleEnhance,
    minColorRatio,
    colorSampling,
    colorQuantCycles,
    traceStrokeWidth,
    lineFilter,
    roundCoords,
    blurRadius,
    blurDelta,
    setNumberOfColors,
    setLtres,
    setQtres, 
    setPathomit,
    setRightAngleEnhance,
    setMinColorRatio,
    setColorSampling,
    setColorQuantCycles,
    setTraceStrokeWidth,
    setLineFilter,
    setRoundCoords,
    setBlurRadius,
    setBlurDelta
  } = useTraceState();

  const [showExportPanel, setShowExportPanel] = useState(false);

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const insets = useSafeAreaInsets();

	const [activeControl, setActiveControl] = useState<'image' | 'stencil' | 'trace' | 'color' | null>(null);

  const previewImageStyle = useMemo(() => {
    const aspectRatio = imageWidth && imageHeight ? imageWidth / imageHeight : 1;
    const width = screenWidth;
    const maxHeight = screenHeight - insets.bottom - 100;
    let height = width / aspectRatio;

    if (height > maxHeight) {
      height = maxHeight;
    }

    return {
      width,
      height
    };
  }, [imageWidth, imageHeight, screenWidth]);

  useInitializeImage({
    imageBase64,
    setImageWidth,
    setImageHeight
  });

  const {
    stencilOutput,
    isStencilProcessing,
    stencilRef,
    html: stencilHtml,
    onStencilMessage,
    onWebViewLoad
  } = useStencil({
    imageBase64,
    threshold,
    brightness,
    contrast,
    saturation,
    strokeWidth,
    erosionWidth,
    invertColors,
    stencilColor,
    viewAsTrace
  });

  const {
    traceOutput,
    isTracing,
    traceHTML,
    traceHTMLKey,
    traceRef,
    onTraceMessage,
  } = useTrace({
    imageBase64,
    imageWidth,
    imageHeight,
    numberOfColors,
    ltres,
    qtres,
    pathomit,
    rightAngleEnhance,
    minColorRatio,
    colorSampling,
    colorQuantCycles,
    viewAsTrace,
    traceStrokeWidth,
    lineFilter,
    roundCoords,
    blurRadius,
    blurDelta
  });

  useEffect(() => {
    return () => {
      ImageStore.clear();
    };
  }, []);

  return (
    <SafeAreaProvider style={{ flex: 1}}>
      <Topbar
        isStencilProcessing={isStencilProcessing}
        isTracing={isTracing}
        stencilOutput={stencilOutput}
        traceOutput={traceOutput}
        showExportPanel={showExportPanel}
        setShowExportPanel={setShowExportPanel}
      />

      <ImagePreview
        insets={insets}
        stencilOutput={stencilOutput}
        traceOutput={traceOutput}
        isStencilProcessing={isStencilProcessing}
        isTracing={isTracing}
        viewAsTrace={viewAsTrace}
        dynamicImageStyle={previewImageStyle}
      />

      <ModeSwitcher 
				viewAsTrace={viewAsTrace}
				setViewAsTrace={setViewAsTrace}
			/>

			<ControlPanel
				insets={insets}
        activeControl={activeControl}
        setActiveControl={setActiveControl}
        imageOptions={{ brightness, contrast, saturation, setBrightness, setContrast, setSaturation }}
        stencilOptions={{ threshold, strokeWidth, erosionWidth, invertColors, stencilColor, setThreshold, setStrokeWidth, setErosionWidth, setInvertColors, setStencilColor }}
        traceOptions={{ numberOfColors, ltres, qtres, pathomit, minColorRatio, colorSampling, colorQuantCycles, rightAngleEnhance, traceStrokeWidth, lineFilter, roundCoords, blurRadius, blurDelta, setNumberOfColors, setLtres, setQtres, setPathomit, setMinColorRatio, setColorSampling, setColorQuantCycles, setRightAngleEnhance, setTraceStrokeWidth, setLineFilter, setRoundCoords, setBlurRadius, setBlurDelta }}
			/>

      <ExportPanel
        stencilOutput={stencilOutput}
        traceOutput={traceOutput}
        viewAsTrace={viewAsTrace}
        showExportPanel={showExportPanel}
        setShowExportPanel={setShowExportPanel}
      />

			<BottomToolBar
				insets={insets}
				activeControl={activeControl}
				setActiveControl={setActiveControl}
			/>

      <WebView
        ref={stencilRef}
        source={{ html: stencilHtml }}
        onMessage={onStencilMessage}
        onLoad={onWebViewLoad}
        javaScriptEnabled
        originWhitelist={['*']}
        style={{ height: 0, width: 0 }}
      />
      {traceHTML && (
        <WebView
          key={`trace-${traceHTMLKey}`}
          ref={traceRef}
          source={{ html: traceHTML }}
          onMessage={onTraceMessage}
          javaScriptEnabled
          originWhitelist={['*']}
          style={{ height: 0, width: 0 }}
        />
      )}
    </SafeAreaProvider>
  );
}