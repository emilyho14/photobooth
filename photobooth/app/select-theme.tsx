import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { PHOTO_STRIP_THEMES } from "../constants/photostripThemes";


export default function SelectTheme() {
    const { width } = useWindowDimensions();

    const scaleFont = (size: number) => {
        const baseWidth = 390;
        const scale = width / baseWidth;
        const scaledSize = size * scale;

        return Math.round(Math.min(Math.max(scaledSize, size * 0.9), size * 1.25));
    };

    const handleThemePress = (themeId: string) => {
        setTimeout(() => {
            router.push({
                pathname: "/take-photo",
                params: {themeId}
            });
        }, 120);
    };

    return (
        <View  style={styles.page}>

            <TouchableOpacity  style={styles.backButton} onPress={() => router.push("/")}>
                <Text style={[styles.backText, { fontSize: scaleFont(16)}]}> 
                    Back
                </Text>
            </TouchableOpacity>
            
            <Text style={[styles.title, { fontSize: scaleFont(32), lineHeight: scaleFont(40) }]}> ʕ •ᴥ•ʔ Choose Your Photostrip ♡ </Text>
            <Text style={[styles.subtitle, { fontSize: scaleFont(22) }]}> Pick a Theme! </Text>
            
            <View style={styles.themeList}>

                {PHOTO_STRIP_THEMES.map((theme) => (
                    <TouchableOpacity
                        key={theme.id}
                        style={styles.themeButton}
                        activeOpacity={0.6}
                        onPress={() => handleThemePress(theme.id) }
                    >
                        <Text style={[styles.themeText, { fontSize: scaleFont(20) }]}> ☆  {theme.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>

        </View>
    )
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
    fontWeight: "700",
  },

  title: {
    fontWeight: "800",
    color: "#4A2418",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    color: "#8A5A44",
    textAlign: "center",
    marginBottom: 32,
  },

  themeList: {
    gap: 16,
  },

  themeButton: {
    width: "75%",
    alignSelf: "center",

    backgroundColor: "#FFFFFF",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#F3B89F",

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },

    elevation: 4,
  },

  themeText: {
    // fontSize: 20,
    fontWeight: "800",
    color: "#4A2418",
    textAlign: "center",
  },
});