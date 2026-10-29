import { CameraView, useCameraPermissions } from "expo-camera";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
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
    const cameraRef = useRef<CameraView>(null); // for the actual camera component
    const [ countdown, setCountdown ] = useState<number | null>(null);
    const [ isTakingPhotos, setIsTakingPhotos ] = useState(false);

    const requestCameraAccess = async () => {
        if (!permission?.granted) {
            const res = await requestPermission();
            return res.granted;
        }

        return true;
    };

    const handleCameraPermissions = async () => {
        if (await requestCameraAccess()) {
            setStarted(true);
        }
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
                        <View style={styles.cameraScreen}>
                            <CameraView
                                ref={cameraRef}
                                style={StyleSheet.absoluteFill}
                                facing="front"
                            />

                            {countdown !== null && (
                                <View style={styles.countdownContainer}>
                                    <Text style={styles.countdownText}>
                                        {countdown}
                                    </Text>
                                </View>
                            )}

                            <View style={styles.cameraControls}>
                                <TouchableOpacity
                                    style={[styles.captureButton, isTakingPhotos && styles.disabledButton]}
                                    onPress={handleTakePhotos}
                                    disabled={isTakingPhotos}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.captureButtonText}>
                                        {isTakingPhotos ? "Taking photos…" : "Start photos"}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setStarted(false)}
                                    disabled={isTakingPhotos}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                );
        }

        return (
                <View style={styles.page}>
                        <TouchableOpacity style={styles.backButton} onPress={() => router.push("/select-theme")}>
                                <Text style={[styles.backText, { fontSize: scaleFont(16)}]}>Back</Text>
                        </TouchableOpacity>

                        <Text style={[styles.selectionText, { fontSize: scaleFont(30), lineHeight: scaleFont(38) }]}>
                            Your selected theme
                        </Text>
                        <Text style={[styles.themeName, { fontSize: scaleFont(20) }]}>
                            {selectedTheme?.name}
                        </Text>

                        <View style={[styles.previewFrame, { width: Math.min(width - 48, 340) }]}>
                            {permission?.granted ? (
                                <CameraView style={styles.previewCamera} facing="front" />
                            ) : (
                                <View style={styles.cameraPlaceholder}>
                                    <Text style={styles.cameraIcon}>♡</Text>
                                    <Text style={styles.placeholderTitle}>Camera preview</Text>
                                    <Text style={styles.placeholderText}>
                                        Allow camera access to see yourself before taking photos.
                                    </Text>
                                    <TouchableOpacity
                                        style={styles.permissionButton}
                                        onPress={requestCameraAccess}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.permissionButtonText}>Enable camera</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>

                        <Text style={[styles.instruction, { fontSize: scaleFont(16) }]}>
                            Get ready to strike a pose!
                        </Text>

                        <TouchableOpacity
                            style={styles.beginButton}
                            onPress={handleCameraPermissions}
                            activeOpacity={0.85}
                        >
                            <Animated.Text style={[
                                styles.beginButtonText,
                                { fontSize: scaleFont(21), transform: [{ scale: pulse }] },
                            ]}>
                                Let’s Begin ♡
                            </Animated.Text>
                        </TouchableOpacity>
                </View>
        );
};

const styles = StyleSheet.create({
        page: {
            flex: 1,
            backgroundColor: "#FFF2E8",
            paddingHorizontal: 24,
            paddingTop: 60,
            alignItems: "center",
        },
        backButton: {
            alignSelf: "flex-start",
            backgroundColor: "#F6C7B3",
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 999,
            marginBottom: 24,
        },
        backText: {
            color: "#4A2418",
            fontWeight: "700",
        },
        selectionText: {
            fontWeight: "800",
            color: "#4A2418",
            textAlign: "center",
        },
        themeName: {
            color: "#8A5A44",
            textAlign: "center",
            marginTop: 4,
            marginBottom: 18,
        },
        previewFrame: {
            aspectRatio: 3 / 4,
            maxHeight: 420,
            alignSelf: "center",
            overflow: "hidden",
            borderRadius: 28,
            borderWidth: 4,
            borderColor: "#F3B89F",
            backgroundColor: "#F6C7B3",
            shadowColor: "#4A2418",
            shadowOpacity: 0.16,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 6 },
            elevation: 5,
        },
        previewCamera: {
            flex: 1,
        },
        cameraPlaceholder: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 24,
            backgroundColor: "#F9DED1",
        },
        cameraIcon: {
            color: "#C17C63",
            fontSize: 44,
            marginBottom: 8,
        },
        placeholderTitle: {
            color: "#4A2418",
            fontSize: 20,
            fontWeight: "800",
            marginBottom: 8,
        },
        placeholderText: {
            color: "#8A5A44",
            textAlign: "center",
            lineHeight: 22,
            marginBottom: 18,
        },
        permissionButton: {
            backgroundColor: "#F6C7B3",
            paddingVertical: 11,
            paddingHorizontal: 20,
            borderRadius: 999,
        },
        permissionButtonText: {
            color: "#4A2418",
            fontWeight: "800",
        },
        instruction: {
            color: "#8A5A44",
            marginTop: 18,
            textAlign: "center",
        },
        beginButton: {
            marginTop: 12,
            backgroundColor: "#F6C7B3",
            paddingVertical: 14,
            paddingHorizontal: 28,
            borderRadius: 999,
            borderWidth: 2,
            borderColor: "#F3B89F",
            shadowColor: "#000",
            shadowOpacity: 0.12,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
            elevation: 4,
        },
        beginButtonText: {
            color: "#4A2418",
            textAlign: "center",
            fontWeight: "800",
        },
        cameraScreen: {
            flex: 1,
            backgroundColor: "#1A0F0A",
        },
        countdownContainer: {
            ...StyleSheet.absoluteFillObject,
            alignItems: "center",
            justifyContent: "center",
        },
        countdownText: {
            color: "white",
            fontSize: 100,
            fontWeight: "800",
            textShadowColor: "rgba(0,0,0,0.5)",
            textShadowRadius: 8,
        },
        cameraControls: {
            position: "absolute",
            left: 24,
            right: 24,
            bottom: 42,
            alignItems: "center",
            gap: 12,
        },
        captureButton: {
            minWidth: "75%",
            alignItems: "center",
            backgroundColor: "#F6C7B3",
            paddingVertical: 16,
            paddingHorizontal: 24,
            borderRadius: 999,
            borderWidth: 2,
            borderColor: "#FFF2E8",
        },
        disabledButton: {
            opacity: 0.65,
        },
        captureButtonText: {
            color: "#4A2418",
            fontSize: 18,
            fontWeight: "800",
        },
        cancelButton: {
            paddingVertical: 10,
            paddingHorizontal: 22,
            borderRadius: 999,
            backgroundColor: "rgba(26,15,10,0.55)",
        },
        cancelButtonText: {
            color: "white",
            fontSize: 16,
            fontWeight: "700",
        },
});