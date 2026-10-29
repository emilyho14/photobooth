import { useLocalSearchParams, router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { PHOTO_STRIP_THEMES } from "@/constants/photostripThemes";

export default function PreviewPhotostrip() {
  const { themeId, photos } = useLocalSearchParams();
  const { width, height } = useWindowDimensions();

  const selectedTheme =
    PHOTO_STRIP_THEMES.find((theme) => theme.id === themeId) ??
    PHOTO_STRIP_THEMES[0];

  const photoUris = photos ? JSON.parse(photos as string) : [];
  const stripScale = Math.max(
    0.45,
    Math.min(1, (width - 48) / 260, (height - 230) / 780)
  );
  const stripWidth = 260 * stripScale;
  const stripHeight = 780 * stripScale;

  const photoSlotStyle = (index: number) => ({
    top: (12 + index * 190) * stripScale,
    left: 6.5 * stripScale,
    width: 247 * stripScale,
    height: 182 * stripScale,
  });

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Your photostrip is ready! </Text>
      <Text style={styles.subtitle}>Save it, or retake your photos.</Text>

      <View style={[styles.stripFrame, { width: stripWidth, height: stripHeight }]}>
        <View style={[styles.strip, { width: stripWidth, height: stripHeight }]}>
          <Image
            source={selectedTheme.background}
            style={{ width: stripWidth, height: stripHeight }}
          />

          {photoUris[0] && (
            <View style={[styles.photoSlot, photoSlotStyle(0)]}>
              <Image source={{ uri: photoUris[0] }} style={styles.photo} />
              <View style={[styles.filterOverlay, selectedTheme.filterOverlay]} />
              <Image source={selectedTheme.grain} style={styles.grainOverlay} />
            </View>
          )}

          {photoUris[1] && (
            <View style={[styles.photoSlot, photoSlotStyle(1)]}>
              <Image source={{ uri: photoUris[1] }} style={styles.photo} />
              <View style={[styles.filterOverlay, selectedTheme.filterOverlay]} />
              <Image source={selectedTheme.grain} style={styles.grainOverlay} />
            </View>
          )}

          {photoUris[2] && (
            <View style={[styles.photoSlot, photoSlotStyle(2)]}>
              <Image source={{ uri: photoUris[2] }} style={styles.photo} />
              <View style={[styles.filterOverlay, selectedTheme.filterOverlay]} />
              <Image source={selectedTheme.grain} style={styles.grainOverlay} />
            </View>
          )}

          {photoUris[3] && (
            <View style={[styles.photoSlot, photoSlotStyle(3)]}>
              <Image source={{ uri: photoUris[3] }} style={styles.photo} />
              <View style={[styles.filterOverlay, selectedTheme.filterOverlay]} />
              <Image source={selectedTheme.grain} style={styles.grainOverlay} />
            </View>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.retakeButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text style={styles.retakeText}>Retake</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => router.push("/")}
          activeOpacity={0.8}
        >
          <Text style={styles.doneText}>Done! ♡</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF2E8",
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 28,
  },

  title: {
    color: "#4A2418",
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
    textAlign: "center",
  },

  subtitle: {
    color: "#8A5A44",
    fontSize: 15,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 18,
  },

  stripFrame: {
    overflow: "hidden",
    borderRadius: 16,
    borderWidth: 3,
    borderColor: "#F3B89F",
    backgroundColor: "#FFFFFF",
    shadowColor: "#4A2418",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },

  strip: {
    position: "relative",
  },

  photoSlot: {
    position: "absolute",
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

  actions: {
    width: "100%",
    maxWidth: 380,
    flexDirection: "row",
    justifyContent: "center",
    gap: 14,
    marginTop: 20,
  },

  retakeButton: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "#F3B89F",
  },

  retakeText: {
    color: "#4A2418",
    fontSize: 16,
    fontWeight: "800",
  },

  doneButton: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F6C7B3",
    paddingVertical: 14,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "#F3B89F",
  },

  doneText: {
    color: "#4A2418",
    fontSize: 16,
    fontWeight: "800",
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