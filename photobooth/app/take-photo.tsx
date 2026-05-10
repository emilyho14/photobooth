import { CameraView, useCameraPermissions } from "expo-camera";
import { useLocalSearchParams, router } from "expo-router";
import { useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { PHOTO_STRIP_THEMES } from "@/constants/photostripThemes";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function TakePhotoScreen() {
    const { themeId } = useLocalSearchParams();

    const selectedTheme = PHOTO_STRIP_THEMES.find(
        (theme) => theme.id === themeId
    )

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
            <View style={{ flex: 1 }}>
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
        <View>
            <TouchableOpacity onPress={() => router.back()}>
                <Text> Back </Text>
            </TouchableOpacity>
            <Text> Selected Theme: {selectedTheme?.name} </Text>

            <TouchableOpacity onPress={handleCameraPermissions}>
                <Text> Let's Begin! </Text>
            </TouchableOpacity>

        </View>

    );
};