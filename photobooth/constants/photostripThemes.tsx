export const PHOTO_STRIP_THEMES = [
    { 
        id: "DarkVintage",
        name: "Old Timey - Dark",
        background: require("@/assets/photostrips/DarkVintage.png"),
        useBlackAndWhite: true,
        filterOverlay: {
            backgroundColor: "rgba(90, 55, 25, 0.22)"
        },
        grain: require("@/assets/filters/grain.png"),
    },
    { 
        id: "LightVintage",
        name: "Old Timey- Light",
        background: require("@/assets/photostrips/LightVintage.png"),
        useBlackAndWhite: true,
        filterOverlay: {
            backgroundColor: "rgba(230, 220, 200, 0.18)",
        },
        grain: require("@/assets/filters/grain.png"),
    }
]