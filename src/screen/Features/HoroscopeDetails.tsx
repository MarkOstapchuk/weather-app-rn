import React from "react";
import {View, Text, StyleSheet, Image} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import {zodiacIcons} from "../../assets/icons/zodiacs";

type Params = {
    HoroscopeDetail: {
        sign: string;
        message: string;
    };
};

export const HoroscopeDetailScreen = () => {
    const route = useRoute<RouteProp<Params, "HoroscopeDetail">>();
    const { sign, message } = route.params;

    return (
        <View style={styles.container}>
            <Image
                source={zodiacIcons[sign as keyof typeof zodiacIcons]}
                style={{ width: 60, height: 60 }}
            />
            <Text style={styles.sign}>{sign}</Text>
            <Text style={styles.message}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center"
    },
    sign: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 30,
    },
    message: {
        fontSize: 18,
        lineHeight: 26
    }
});
