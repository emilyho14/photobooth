import { CameraView, useCameraPermissions } from "expo-camera";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { PHOTO_STRIP_THEMES } from "@/constants/photostripThemes";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function TakePhotoScreen() {
    const { themeId } = useLocalSearchParams();

    const selectedTheme = PHOTO_STRIP_THEMES.find(
        (theme) => theme.id === themeId
    )

    const { width } = useWindowDimensions();
    
    const scaleFont = (size: number) => {
        const baseWidth = 390;
        const scale = width / baseWidth;
        const scaledSize = size * scale;

        return Math.round(Math.min(Math.max(scaledSize, size * 0.9), size * 1.25));
    };

    const pulse = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
            Animated.timing(pulse, {
                toValue: 1.08,
                duration: 700,
                useNativeDriver: true,
            }),
            Animated.timing(pulse, {
                toValue: 1,
                duration: 700,
                useNativeDriver: true,
            }),
            ])
        ).start();
    }, []);

    const [ permission, requestPermission ] = useCameraPermissions()
    const [ started, setStarted ] = useState(false);
    const [ photoUris, setPhotoUris ] = useState<string[]>([]); // to remember the photo for previewing later
    const cameraRef = useRef<CameraView>(null); // for the actual camera component
    const [ countdown, setCountdown ] = useState<number | null>(null);
    const [ isTakingPhotos, setIsTakingPhotos ] = useState(false);

    const handleCameraPermissions = async() => {
        console.log("permission before; ", permission)
        if (!permission?.granted) {
            const res = await requestPermission();
            console.log("permission res; ", res)
            if (!res.granted) {
                return;
            }
        }

        setStarted(true);
    }

    const handleTakePhotos = async () => {
        // timer for 4 seconds between photos
        if (!cameraRef.current || isTakingPhotos) return;

        setIsTakingPhotos(true);
        const takenPhotos: string[] = []; // to be able to preview later

        for (let i = 0; i < 4; i++) {
            setCountdown(4);
            await sleep(1000);

            setCountdown(3);
            await sleep(1000);

            setCountdown(2);
            await sleep(1000);

            setCountdown(1);
            await sleep(1000);

            setCountdown(null);


            const camera = cameraRef.current;

            if (!camera) {
                setIsTakingPhotos(false);
                setCountdown(null);
                return;
            }
            const photo = await cameraRef.current.takePictureAsync();

            if (photo) {
                takenPhotos.push(photo.uri);
                setPhotoUris([...takenPhotos]);
            }

            await sleep(1000);
        }

        setIsTakingPhotos(false);

        router.push({
            pathname: "/preview-photostrip",
            params: {
                themeId: themeId as string,
                photos: JSON.stringify(takenPhotos)
            }
        })
    }

    if (started) {
        return (
            <View>

            <CameraView
                ref={cameraRef}
                style={{ flex: 1 }}
                facing="front"
            />

            {countdown !== null && (
                <View
                style={{
                    position: "absolute",
                    top: "40%",
                    left: 0,
                    right: 0,
                    alignItems: "center",
                }}
                >
                <Text
                    style={{
                    fontSize: 100,
                    fontWeight: "800",
                    color: "white",
                    }}
                >
                    {countdown}
                </Text>
                </View>
            )}

            <TouchableOpacity onPress={handleTakePhotos}>
                <Text> START </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setStarted(false)}>
                <Text>Cancel</Text>
            </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.page}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.push("/select-theme")}>
                <Text style={[styles.backText, { fontSize: scaleFont(16)}]}> Back </Text>
            </TouchableOpacity>
            <Text style={[styles.selectionText, { fontSize: scaleFont(32), lineHeight: scaleFont(40) }]} > Theme Selection: {selectedTheme?.name} </Text>

            <TouchableOpacity onPress={handleCameraPermissions}>
                <Animated.Text style={[styles.beginButton, { fontSize: scaleFont(28), lineHeight: scaleFont(36), transform: [{scale: pulse}], }]}> Let's Begin! ʕ•ᴥ•ʔ⁠っ  ♡ </Animated.Text>
            </TouchableOpacity>

        </View>

    );
};

const styles = StyleSheet.create({
    page: {
    flex: 1,
    backgroundColor: "#FFF2E8",
    paddingHorizontal: 24,
    paddingTop: 70,
  },
  backButton: {
    width: "12%",

    alignSelf: "flex-start",
    backgroundColor: "#F6C7B3",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    marginBottom: 32,
  },
  backText: {
    textAlign: "center",
    color: "#4A2418",
    // fontSize: 16,
    fontWeight: "700",
  },
  selectionText: {
    fontWeight: "800",
    color: "#4A2418",
    textAlign: "center",
    marginBottom: 8,
  },
  beginButton: {
    alignSelf: "center",
    textAlign: "center",
    color: "#4A2418",
    fontWeight: "400",
    marginTop: 25
  }
});