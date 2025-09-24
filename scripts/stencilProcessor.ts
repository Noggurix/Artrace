export const stencilProcessorHTML = (
  threshold: number,
  brightness: number,
  contrast: number,
  saturation: number,
  strokeWidth: number = 0,
  erosionWidth: number = 0,
  invertColors: number = 0,
  stencilColor: string = '#000000'
) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Stencil Processor</title>
  <style>
    body, html { margin: 0; padding: 0; background: #000; color: #fff; }
    canvas { display: none; }
  </style>
</head>
<body>
  <canvas id="canvas"></canvas>
  <script>
    function hexToRgb(hex) {
      const bigint = parseInt(hex.replace('#', ''), 16);
      return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
    }

    function processImage(
      imageBase64,
      threshold = ${threshold},
      brightness = ${brightness},
      contrast = ${contrast},
      saturation = ${saturation},
      strokeWidth = ${strokeWidth},
      erosionWidth = ${erosionWidth},
      invertColors = ${invertColors},
      stencilColor = "${stencilColor}"
    ) {
      const [sr, sg, sb] = hexToRgb(stencilColor);
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.filter = "brightness(" + brightness + ") contrast(" + contrast + ") saturate(" + saturation + ")";
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const gray = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
          if (gray < threshold) {
            data[i] = sr; data[i + 1] = sg; data[i + 2] = sb;
          } else {
            data[i] = 255; data[i + 1] = 255; data[i + 2] = 255;
          }
        }

        if (invertColors === 1) {
          for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];
            data[i + 1] = 255 - data[i + 1];
            data[i + 2] = 255 - data[i + 2];
          }
        }

        const applyMorphology = (srcData, radius, matchColor, keepColor, mode = 'dilate') => {
          const output = ctx.createImageData(imageData);
          const odata = output.data;
          for (let i = 0; i < odata.length; i++) odata[i] = 255;

          for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
              const idx = (y * canvas.width + x) * 4;
              let shouldSet = mode === 'dilate' ? false : true;

              for (let dy = -radius; dy <= radius; dy++) {
                for (let dx = -radius; dx <= radius; dx++) {
                  const nx = x + dx, ny = y + dy;
                  if (nx >= 0 && nx < canvas.width && ny >= 0 && ny < canvas.height) {
                    const nIdx = (ny * canvas.width + nx) * 4;
                    const match = srcData[nIdx] === matchColor[0] &&
                      srcData[nIdx + 1] === matchColor[1] &&
                      srcData[nIdx + 2] === matchColor[2];
                    if ((mode === 'dilate' && match) || (mode === 'erode' && !match)) {
                      shouldSet = mode === 'dilate' ? true : false;
                      break;
                    }
                  }
                }
                if ((mode === 'dilate' && shouldSet) || (mode === 'erode' && !shouldSet)) break;
              }

              if (shouldSet) {
                odata[idx] = keepColor[0];
                odata[idx + 1] = keepColor[1];
                odata[idx + 2] = keepColor[2];
                odata[idx + 3] = 255;
              }
            }
          }

          return output;
        };

        if (erosionWidth > 0) {
          const eroded = applyMorphology(data, Math.round(erosionWidth), [sr, sg, sb], [sr, sg, sb], 'erode');
          data.set(eroded.data);
        }

        if (strokeWidth > 0) {
          const dilated = applyMorphology(data, Math.round(strokeWidth), [sr, sg, sb], [sr, sg, sb], 'dilate');
          ctx.putImageData(dilated, 0, 0);
        } else {
          ctx.putImageData(imageData, 0, 0);
        }

        const result = canvas.toDataURL('image/png');
        window.ReactNativeWebView.postMessage(result);
      };

      img.src = imageBase64;
    }
  </script>
</body>
</html>
`;
