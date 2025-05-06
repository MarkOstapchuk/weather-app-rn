import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image
} from "react-native";
import {getForecast} from "../../api/api.ts";
import {RouteProp, useRoute} from "@react-navigation/native";

type Params = {
    HoroscopeDetail: {
        lat: number;
        lon: number;
    };
};
const WeatherForecastScreen: React.FC = () => {
    const [forecast, setForecast] = useState<any[]>([]);
    const [dailyList, setDailyList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const route = useRoute<RouteProp<Params, "HoroscopeDetail">>();
    const { lat, lon } = route.params;
    useEffect(() => {
        const fetchForecast = async () => {
            try {
                const response = await getForecast(lat, lon)
                const daily = response.list.filter((item: any) =>
                    item.dt_txt.includes('12:00:00')
                ).slice(0, 5);
                setForecast(response.list);
                setDailyList(daily)
            } catch (error) {
                console.error('Ошибка загрузки прогноза:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchForecast();
    }, []);
    const renderDailyItem = ({ item }: any) => {
        const date = new Date(item.dt_txt);
        const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;

        return (
            <View style={styles.dailyCard}>
                <Text style={styles.date}>
                    {date.toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'short',
                    })}
                </Text>
                <View>
                    <View style={styles.row}>
                        <Text style={styles.temp}>🌡️ {Math.round(item.main.temp)}°C</Text>
                        <Text style={styles.desc}>☁️ {item.weather[0].description}</Text>
                        <Text>💧 {item.main.humidity}% | 💨 {item.wind.speed} м/с</Text>
                    </View>
                </View>
                <Image source={{ uri: iconUrl }} style={styles.icon} />
            </View>
        );
    };
    const renderItem = ({ item }: any) => {
        const date = new Date(item.dt_txt);
        const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;

        return (
            <View style={styles.card}>
                <Text style={styles.time}>
                    {date.toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: 'short',
                    })}{'\n'}
                    {date.toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </Text>
                <Image source={{ uri: iconUrl }} style={styles.icon} />
                <Text style={styles.temp}>{Math.round(item.main.temp)}°C</Text>
                <Text style={styles.desc}>{item.weather[0].description}</Text>
            </View>
        );
    };

    if (loading) {
        return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={forecast}
                style={styles.hourContainer}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 8 }}
            />
            <Text style={styles.title}>Прогноз на 5 дней (12:00)</Text>
            <FlatList
                data={dailyList}
                keyExtractor={(item, index) => 'daily-' + index}
                renderItem={renderDailyItem}
                contentContainerStyle={{ paddingBottom: 16 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        paddingHorizontal: 10,
        flex: 1
    },
    hourContainer: {
        flexShrink: 0,
    },
    date: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 8,
        textTransform: 'capitalize',
    },
    row: {
        alignItems: 'flex-start',
        gap: 5
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 15,
        marginTop: 50,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 12,
        minWidth: 150,
        marginHorizontal: 6,
        alignItems: 'center',
    },
    dailyCard: {
        backgroundColor: '#ffffff',
        padding: 14,
        borderRadius: 10,
        marginBottom: 12,
        flexDirection: 'row',
        gap: 20,
        justifyContent: 'space-between'
    },
    time: {
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 6,
    },
    icon: {
        width: 50,
        height: 50,
    },
    temp: {
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 4,
    },
    desc: {
        fontSize: 11,
        color: '#555',
        textAlign: 'center',
        marginTop: 2,
    },
});

export default WeatherForecastScreen;
