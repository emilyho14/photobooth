import { useLocalSearchParams, router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PHOTO_STRIP_THEMES } from "@/constants/photostripThemes";

export default function PreviewPhotostrip() {
  const { themeId, photos } = useLocalSearchParams();

  const selectedTheme =
    PHOTO_STRIP_THEMES.find((theme) => theme.id === themeId) ??
    PHOTO_STRIP_THEMES[0];

  const photoUris = photos ? JSON.parse(photos as string) : [];

  return (
    <View style={styles.screen}>
      <Text>Preview Photostrip</Text>

      <View style={styles.strip}>
        <Image source={selectedTheme.background} style={styles.background} />

        {photoUris[0] && (
          <View style={[styles.photoSlot, styles.photoOne]}>
            <Image source={{ uri: photoUris[0] }} style={styles.photo} />
            <View style={[styles.filterOverlay, selectedTheme.filterOverlay]} />
            <Image source={selectedTheme.grain} style={styles.grainOverlay} />
          </View>
        )}

        {photoUris[1] && (
          <View style={[styles.photoSlot, styles.photoTwo]}>
            <Image source={{ uri: photoUris[1] }} style={styles.photo} />
            <View style={[styles.filterOverlay, selectedTheme.filterOverlay]} />
            <Image source={selectedTheme.grain} style={styles.grainOverlay} />
          </View>
        )}

        {photoUris[2] && (
          <View style={[styles.photoSlot, styles.photoThree]}>
            <Image source={{ uri: photoUris[2] }} style={styles.photo} />
            <View style={[styles.filterOverlay, selectedTheme.filterOverlay]} />
            <Image source={selectedTheme.grain} style={styles.grainOverlay} />
          </View>
        )}

        {photoUris[3] && (
          <View style={[styles.photoSlot, styles.photoFour]}>
            <Image source={{ uri: photoUris[3] }} style={styles.photo} />
            <View style={[styles.filterOverlay, selectedTheme.filterOverlay]} />
            <Image source={selectedTheme.grain} style={styles.grainOverlay} />
          </View>
        )}
      </View>

      <TouchableOpacity onPress={() => router.back()}>
        <Text>Retake</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/")}>
        <Text>Done!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  strip: {
    width: 260,
    height: 780,
    position: "relative",
  },

  background: {
    position: "absolute",
    width: 260,
    height: 780,
    top: 0,
    left: 0,
    resizeMode: "cover",
  },

  photoSlot: {
    position: "absolute",
    left: 6.5,
    width: 247,
    height: 182,
    overflow: "hidden",
  },

  photo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  filterOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  photoOne: {
    top: 12,
  },

  photoTwo: {
    top: 202,
  },

  photoThree: {
    top: 392,
  },

  photoFour: {
    top: 582,
  },

  grainOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    opacity: 0.1,
    resizeMode: "cover",
    },
});