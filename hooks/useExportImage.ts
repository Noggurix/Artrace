import { ImageStore } from '@/hooks/useImageStore';
import { File, Paths } from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { Platform, ToastAndroid } from 'react-native';

function base64ToUint8Array(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function stringToUtf8Bytes(str: string) {
  return new TextEncoder().encode(str);
}

async function saveToGallery(file: File) {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission to access the gallery is required.');
    return;
  }
  const asset = await MediaLibrary.createAssetAsync(file.uri);
  await MediaLibrary.createAlbumAsync('Artrace', asset, false);

  let fileName = file.uri.split('/').pop();
  
  if (Platform.OS === 'android') {
    ToastAndroid.show(`Saved in: Artrace/${fileName}`, ToastAndroid.LONG);
  }
}

async function createFile(name: string, bytes: Uint8Array) {
  const file = new File(Paths.document, name);
  await file.create();
  await file.write(bytes);
  return file;
}

export function useExportImage() {
  const [isExporting, setIsExporting] = useState(false);

  async function exportImage(
    type: 'png' | 'svg' | 'share',
    stencilOutput: string | null,
    traceOutput: string | null
  ) {
    if (isExporting) return;
    setIsExporting(true);

    try {
      let data: string | null = null;

      if (stencilOutput) data = stencilOutput;
      else if (traceOutput) data = traceOutput;

      if (!data && type !== 'svg') {
        throw new Error('No valid data provided for export');
      }

      if (type === 'png') {
        const base64 = data!.replace(/^data:image\/png;base64,/, '');
        const bytes = base64ToUint8Array(base64);
        const file = await createFile(`export_${Date.now()}.png`, bytes);
        await saveToGallery(file);

      } else if (type === 'svg') {
        const svgData = ImageStore.traceImage;
        if (!svgData) throw new Error('SVG not available for export');
        const bytes = stringToUtf8Bytes(svgData);
        const file = await createFile(`export_${Date.now()}.svg`, bytes);
        await saveToGallery(file);

      } else if (type === 'share') {
        if (!data!.startsWith('data:image/png;base64,')) {
          throw new Error('File is not a valid base64 PNG image');
        }
        if (!(await Sharing.isAvailableAsync())) {
          alert('Sharing not available on this device');
          return;
        }
        const base64 = data!.replace(/^data:image\/png;base64,/, '');
        const bytes = base64ToUint8Array(base64);
        const file = await createFile(`share_${Date.now()}.png`, bytes);
        await Sharing.shareAsync(file.uri, { mimeType: 'image/png' });
      }
    } catch (err) {
      console.error('Error exporting image:', err);
      alert('Error exporting image. Check the console for details.');
    } finally {
      setIsExporting(false);
    }
  }

  return { exportImage, isExporting };
}
