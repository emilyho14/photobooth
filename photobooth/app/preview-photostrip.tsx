import { useLocalSearchParams, router } from "expo-router";
import { useRef, useState } from "react";
import { Alert, Image, Platform, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { captureRef } from "react-native-view-shot";
import { PHOTO_STRIP_THEMES } from "@/constants/photostripThemes";

export default function PreviewPhotostrip() {
  const { themeId, photos } = useLocalSearchParams();
  const { width, height } = useWindowDimensions();
  const stripRef = useRef<View>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const selectedTheme =
    PHOTO_STRIP_THEMES.find((theme) => theme.id === themeId) ??
    PHOTO_STRIP_THEMES[0];

  const photoUris = photos ? JSON.parse(photos as string) : [];
  const stripScale = Math.max(
    0.4,
    Math.min(1, (width - 54) / 266, (height - 350) / 780)
  );
  const stripWidth = 260 * stripScale;
  const stripHeight = 780 * stripScale;
  const stripBorderWidth = 7;

  const photoSlotStyle = (index: number) => ({
    top: (12 + index * 190) * stripScale,
    left: 6.5 * stripScale,
    width: 247 * stripScale,
    height: 182 * stripScale,
  });

  const capturePhotostrip = async () => {
    const stripElement = stripRef.current;
    if (!stripElement) {
      throw new Error("The photostrip is still loading. Please try again.");
    }

    if (Platform.OS === "web") {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(stripElement as unknown as HTMLElement, {
        backgroundColor: null,
        scale: 2,
      });
      return canvas.toDataURL("image/png");
    }

    return captureRef(stripElement, {
      format: "png",
      quality: 1,
      result: "tmpfile",
    });
  };

  const handleSave = async () => {
    if (isSaving) return;
    if (!stripRef.current) {
      setSaveMessage("The photostrip is still loading. Please try again.");
      return;
    }

    setIsSaving(true);
    setSaveMessage("");
    try {
      const imageUri = await capturePhotostrip();

      if (Platform.OS === "web") {
        if (typeof document === "undefined") {
          throw new Error("Image download is not available in this browser.");
        }
        const link = document.createElement("a");
        link.href = imageUri;
        link.download = "photostrip.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setSaveMessage("Download started. Check your browser’s downloads.");
        return;
      }

      const permission = await MediaLibrary.requestPermissionsAsync();
      if (!permission.granted) {
        const message = permission.canAskAgain
          ? "Allow photo library access to save your photostrip to your device."
          : "Enable photo library access for Photobooth in your device settings, then try again.";
        setSaveMessage(message);
        Alert.alert("Photo access needed", message);
        return;
      }

      await MediaLibrary.saveToLibraryAsync(imageUri);
      setSaveMessage("Saved to your photo library!");
      Alert.alert("Saved!", "Your photostrip is in your photo library.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Please try again.";
      setSaveMessage(`Could not save photostrip: ${message}`);
      if (Platform.OS !== "web") Alert.alert("Could not save photostrip", message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    try {
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Sharing unavailable", "Sharing is not available on this device.");
        return;
      }
      const imageUri = await capturePhotostrip();
      await Sharing.shareAsync(imageUri, {
        mimeType: "image/png",
        UTI: "public.png",
      });
    } catch (error) {
      Alert.alert(
        "Could not share photostrip",
        error instanceof Error ? error.message : "Please try again."
      );
    }
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Your photostrip is ready! </Text>
      <Text style={styles.subtitle}>Save it, or retake your photos.</Text>

      <View
        style={[
          styles.stripFrame,
          {
            width: stripWidth + stripBorderWidth * 2,
            height: stripHeight + stripBorderWidth * 2,
            borderWidth: stripBorderWidth,
          },
        ]}
      >
        <View
          ref={stripRef}
          collapsable={false}
          style={[styles.strip, { width: stripWidth, height: stripHeight }]}
        >
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
          style={styles.secondaryButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text style={styles.retakeText}>Retake</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.replace("/select-theme")}
          activeOpacity={0.8}
        >
          <Text style={styles.retakeText}>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.saveActions}>
        <TouchableOpacity
          style={styles.doneButton}
          onPress={handleSave}
          disabled={isSaving}
          activeOpacity={0.8}
        >
          <Text style={styles.doneText}>{isSaving ? "Saving…" : "Save photostrip"}</Text>
        </TouchableOpacity>
        {Platform.OS !== "web" && (
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShare}
            activeOpacity={0.8}
          >
            <Text style={styles.retakeText}>Share</Text>
          </TouchableOpacity>
        )}
        {!!saveMessage && (
          <Text accessibilityLiveRegion="polite" style={styles.saveMessage}>
            {saveMessage}
          </Text>
        )}
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
    overflow: "visible",
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

  secondaryButton: {
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
    width: "100%",
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

  saveActions: {
    width: "100%",
    maxWidth: 380,
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },

  shareButton: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "#F3B89F",
  },

  saveMessage: {
    color: "#4A2418",
    fontSize: 14,
    textAlign: "center",
    marginTop: 2,
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