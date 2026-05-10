import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { PHOTO_STRIP_THEMES } from "../constants/photostripThemes";

export default function SelectTheme() {
    return (
        <View>

            <TouchableOpacity onPress={() => router.back()}>
                <Text> Back </Text>
            </TouchableOpacity>
            <Text> Select Theme Below </Text>
            
            {PHOTO_STRIP_THEMES.map((theme) => (
                <TouchableOpacity
                    key={theme.id}
                    onPress={() =>
                        router.push({
                            pathname: "/take-photo",
                            params: {themeId: theme.id}
                        })
                    }
                >
                    <Text>{theme.name}</Text>
                </TouchableOpacity>
            ))}

        </View>
    )

};