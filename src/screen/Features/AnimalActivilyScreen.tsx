import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, PermissionsAndroid, Platform } from "react-native";
import MapView, {Marker, Callout, MapPressEvent} from "react-native-maps";
import Geolocation from '@react-native-community/geolocation';
import {getSolunarData} from "../../api/solunar.ts";
import {SolunarData} from "../../types/solunar-types.ts";

export const AnimalActivityScreen = () => {
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [activityData, setActivityData] = useState<SolunarData | null>(null);

    const requestLocationPermission = async () => {
        if (Platform.OS === "android") {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
    };

    const fetchActivity = async (lat: number, lon: number) => {
        const today = new Date().toISOString().split("T")[0];
        try {
            const response = await getSolunarData(lat.toString(), lon.toString())
            setActivityData(response);
        } catch (err) {
            console.error("Error fetching Solunar data", err);
        }
    };

    const handleMapPress = async (event: MapPressEvent) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setLocation({ latitude, longitude });
        await fetchActivity(latitude, longitude);
    };


    useEffect(() => {
        (async () => {
            const hasPermission = await requestLocationPermission();
            if (!hasPermission) return;

            Geolocation.getCurrentPosition(
                (pos) => {
                    const coords = pos.coords;
                    setLocation({ latitude: coords.latitude, longitude: coords.longitude });
                    fetchActivity(coords.latitude, coords.longitude);
                },
                (err) => console.error(err),
                { enableHighAccuracy: true }
            );
        })();
    }, []);

    if (!location || !activityData) return <View style={styles.loading}><Text>Loading map and data...</Text></View>;

    return (
        <MapView
            style={styles.map}
            onPress={handleMapPress}
            initialRegion={{
                ...location,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            }}>
            <Marker coordinate={location}>
                <Callout>
                    <View style={styles.callout}>
                        <Text style={styles.title}>🦌 Активность животных</Text>
                        <Text>Фаза луны: {activityData.moonPhase}</Text>
                        <Text>Основной период активности: {activityData.major1Start} - {activityData.major1Stop}</Text>
                        <Text>Второй период активности: {activityData.major2Start} - {activityData.major2Stop}</Text>
                        <Text>Освещённость луны: {Math.round(activityData.moonIllumination * 100)}%</Text>
                        <Text>Оценка дня: {activityData.dayRating} из 100</Text>
                    </View>
                </Callout>
            </Marker>
        </MapView>
    );
};

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    map: {
        flex: 1
    },
    callout: {
        width: 250,
        padding: 10
    },
    title: {
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 5
    }
});
