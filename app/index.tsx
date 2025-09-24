import { ImageStore } from '@/hooks/useImageStore';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useFocusEffect } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import * as MediaLibrary from 'expo-media-library';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [savedImages, setSavedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [albumPath, setAlbumPath] = useState<string>('');

  async function requestGalleryPermission(): Promise<boolean> {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissão necessária',
        'Você precisa permitir acesso à galeria para continuar.'
      );
      return false;
    }
    return true;
  }

  useFocusEffect(
    useCallback(() => {
      async function loadSavedImages() {
        const granted = await requestGalleryPermission();
        if (!granted) return;

        try {
          const albums = await MediaLibrary.getAlbumsAsync();
          const artraceAlbum = albums.find(a => a.title === 'Artrace');
          if (!artraceAlbum) return;

          const assets = await MediaLibrary.getAssetsAsync({
            album: artraceAlbum,
            mediaType: ['photo'],
            first: 100,
            sortBy: ['creationTime'],
          });

          const images = assets.assets.map(asset => asset.uri);
          setSavedImages(images);

          if (images.length > 0) {
            const uri = images[0];
            let folderPath = uri.substring(0, uri.lastIndexOf('/'));
            if (folderPath.startsWith('file://')) {
              folderPath = folderPath.replace('file:///', '');
            }
            setAlbumPath(folderPath);
          }
        } catch (err) {
          console.error('Erro ao ler imagens salvas:', err);
        }
      }

      loadSavedImages();
    }, [])
  );

  async function convertUriToBase64(uri: string): Promise<string | null> {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error('Erro ao converter URI para Base64:', error);
      return null;
    }
  }
  
  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Você precisa permitir acesso à galeria para escolher uma imagem.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const img = result.assets[0];
      ImageStore.set(img.base64 ?? '');

      router.push('/editor');
    }
  }

  async function openSavedImage(uri: string) {
    if (loading) return;

    setLoading(true);
    try {
      const base64 = await convertUriToBase64(uri);
      if (base64) {
        ImageStore.set(base64);
        router.push('/editor');
      } else {
        Alert.alert('Erro', 'Não foi possível carregar a imagem.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient
      colors={['#00080cff', '#0b141fff', '#00080cff']}
      style={{ flex: 1 }}
    >
      <View style={[styles.projectsHeader, {paddingBottom: insets.bottom + 150}]}>
        <Text style={styles.headerText}>Saved Images: {savedImages.length}</Text>
      <View style={styles.divider} />

      {albumPath  ? (
          <Text style={styles.albumNameText}>{ albumPath }</Text>
        ) : null}

        {savedImages.length > 0 ? (
          <FlatList
            data={savedImages}
            keyExtractor={(item, index) => index.toString()}
            numColumns={4}
            contentContainerStyle={styles.gridContainer}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => openSavedImage(item)} style={styles.imageWrapper}>
                <Image source={{ uri: item }} style={styles.savedImage} />
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text style={styles.emptyText}>No images saved</Text>
        )}
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#00d9ff" />
          <Text style={{ color: '#fff', marginTop: 10 }}>Loading...</Text>
        </View>
      )}

      <View style={styles.bottomContainer}>
        <View style={[styles.bottomButtonsContainer, { paddingBottom: insets.bottom }]}>
          <Text style={styles.buttonText}>Add Image</Text>
        </View>

        <TouchableOpacity style={styles.buttonPickImage} onPress={pickImage}>
          <AntDesign name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bottomContainer: {
    flex: 1,
    backgroundColor: '#000d14ff',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    flexDirection: 'row',
    width: '100%',
    bottom: 0,
    left: 0,
    right: 0,
  },
  gridContainer: {
    paddingHorizontal: 10,
  },
  imageWrapper: {
    flex: 1,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#c1c1c1ff',
    marginVertical: 2,
    marginHorizontal: 8,
  },
  bottomButtonsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  buttonPickImage: {
    backgroundColor: '#009db9c1',
    paddingVertical: 15,
    paddingHorizontal: 17,
    borderRadius: 30,
    marginBottom: 100,
    position: 'absolute',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '400',
    paddingTop: 35
  },
  headerText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '400',
    paddingTop: 20,
    paddingStart: 10
  },
  savedImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
  },
  projectsHeader: {
    backgroundColor: '#00080dff',
    paddingTop: 30
  },
  emptyText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  albumNameText: {
    color: '#aaa',
    fontSize: 12,
    paddingStart: 10,
    paddingTop: 10
  }
});
