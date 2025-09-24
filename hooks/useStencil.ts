import { stencilProcessorHTML } from '@/scripts/stencilProcessor';
import type { StencilProps } from '@/types/stencil';
import debounce from 'lodash/debounce';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { WebViewMessageEvent, WebView as WebViewType } from 'react-native-webview';

export function useStencil({
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
}: StencilProps) {
  const [stencilOutput, setStencilOutput] = useState<string | null>(null);
  const [isStencilProcessing, setIsStencilProcessing] = useState(false);
  const stencilRef = useRef<WebViewType>(null);
  const lastProcessedHashRef = useRef<string | null>(null);
  const isWebViewDefReady = useRef(false);

  const simpleHash = (str: string) => {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return (hash >>> 0).toString(16);
  };

  const html = useMemo(() => {
    return stencilProcessorHTML(
      threshold,
      brightness,
      contrast,
      saturation,
      strokeWidth,
      erosionWidth,
      invertColors ? 1 : 0,
      stencilColor
    );
  }, [threshold, brightness, contrast, saturation, strokeWidth, erosionWidth, invertColors, stencilColor]);

  const processImageDebounce = useRef(
    debounce(
      (
        imageBase64: string,
        threshold: number,
        brightness: number,
        contrast: number,
        saturation: number,
        strokeWidth: number,
        erosionWidth: number,
        invertColors: boolean,
        stencilColor: string,
        viewAsTrace: boolean
      ) => {
        if (viewAsTrace) return;
        const jsToSend = `processImage(
          "data:image/png;base64,${imageBase64}",
          ${threshold}, ${brightness}, ${contrast}, ${saturation},
          ${strokeWidth}, ${erosionWidth}, ${invertColors ? 1 : 0}, "${stencilColor}"
        ); true;`;

        stencilRef.current?.injectJavaScript(jsToSend);
      },
      150
    )
  );

  const forceProcess = () => {
    if (viewAsTrace || !stencilRef.current || !isWebViewDefReady.current || !imageBase64) return;

    setIsStencilProcessing(true);
    processImageDebounce.current(
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
    );

    lastProcessedHashRef.current = simpleHash(
      [
        imageBase64,
        threshold,
        brightness,
        contrast,
        saturation,
        strokeWidth,
        erosionWidth,
        invertColors,
        stencilColor
      ].join('|')
    );
  };

  useEffect(() => {
    if (!stencilRef.current || !isWebViewDefReady.current || !imageBase64) return;

    if (viewAsTrace) return;

    const currentHash = simpleHash(
      [
        imageBase64,
        threshold,
        brightness,
        contrast,
        saturation,
        strokeWidth,
        erosionWidth,
        invertColors,
        stencilColor
      ].join('|')
    );

    if (lastProcessedHashRef.current === currentHash && lastProcessedHashRef.current !== null) {
      return;
    }
    
    lastProcessedHashRef.current = currentHash;
    setIsStencilProcessing(true);

    processImageDebounce.current(
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
    );

    return () => {
      processImageDebounce.current?.cancel();
    };
  }, [imageBase64, threshold, brightness, contrast, saturation, strokeWidth, erosionWidth, invertColors, stencilColor, viewAsTrace]);

  function onStencilMessage(event: WebViewMessageEvent) {
    const data = event.nativeEvent.data;

    if (typeof data === 'string') {
      if (data.startsWith('ERROR:')) {
        setIsStencilProcessing(false);
      } else if (data.startsWith('data:image')) {
        if (data !== stencilOutput) {
          setStencilOutput(data);
        }
        setIsStencilProcessing(false);
      }
    } else {
      console.warn('Unexpected message in WebView (Stencil):', data);
    }
  }

  function onWebViewLoad() {
    isWebViewDefReady.current = true;
    forceProcess();
  }

  return {
    stencilOutput,
    setStencilOutput,
    isStencilProcessing,
    setIsStencilProcessing,
    stencilRef,
    html,
    onStencilMessage,
    onWebViewLoad,
    forceProcess
  };
}
