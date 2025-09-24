import { ImageStore } from '@/hooks/useImageStore';
import { traceProcessor } from '@/scripts/traceProcessor';
import type { TraceProps } from '@/types/trace';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { WebViewMessageEvent, WebView as WebViewType } from 'react-native-webview';

export function useTrace({
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
}: TraceProps) {
  const [traceOutput, setTraceOutput] = useState<string | null>(null);
  const [isTracing, setIsTracing] = useState(false);
  const [traceHTML, setTraceHTML] = useState<string | null>(null);
  const [traceHTMLKey, setTraceHTMLKey] = useState(0);
  const traceRef = useRef<WebViewType>(null);
  const lastTraceOptionsRef = useRef<any>(null);

  const traceOptions = useMemo(() => ({
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
    traceStrokeWidth,
    lineFilter,
    roundCoords,
    blurRadius,
    blurDelta
  }), [
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
    traceStrokeWidth,
    lineFilter,
    roundCoords,
    blurRadius,
    blurDelta
  ]);

  useEffect(() => {
    if (viewAsTrace && imageBase64) {
      const currentOptions = { imageBase64, ...traceOptions };
      const currentKey = JSON.stringify(currentOptions);
      const lastKey = JSON.stringify(lastTraceOptionsRef.current);

      if (currentKey !== lastKey) {
        setIsTracing(true);
        lastTraceOptionsRef.current = currentOptions;

        const base64Data = imageBase64.startsWith("data:image")
          ? imageBase64
          : `data:image/png;base64,${imageBase64}`;

        const html = traceProcessor(base64Data, traceOptions);
        setTraceHTML(html);
        setTraceHTMLKey(prev => prev + 1);
      }
    }
  }, [viewAsTrace, imageBase64, traceOptions]);

  function onTraceMessage(event: WebViewMessageEvent) {
    const data = event.nativeEvent.data;
    try {
      const msg = JSON.parse(data);
      
      if (msg.svg?.startsWith('<svg')) {
        ImageStore.setVector(msg.svg);

        const html = `
          <canvas id="canvas" width="${imageWidth}" height="${imageHeight}"></canvas>
          <script>
            const svg = \`${msg.svg}\`;
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.onload = () => {
              ctx.drawImage(img, 0, 0);
              const pngBase64 = canvas.toDataURL('image/png');
              window.ReactNativeWebView.postMessage(JSON.stringify({ png: pngBase64 }));
            };
            img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
          </script>
        `;
        traceRef.current?.injectJavaScript(`document.body.innerHTML = \`${html}\``);
      }
      

      if (msg.png?.startsWith('data:image/png')) {
        setTraceOutput(msg.png);
        setIsTracing(false);
      }
    } catch (e) {
      console.warn('Trace WebView unexpected message:', data);
      setIsTracing(false);
    }
  }

  return {
    traceOutput,
    setTraceOutput,
    isTracing,
    traceHTML,
    traceHTMLKey,
    traceRef,
    lastTraceOptionsRef,
    onTraceMessage
  };
}