import { View, Text, StyleSheet } from 'react-native';

export default function Calendar() {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: "#b8b8b8",
        },
    });
    return (
        <View style={styles.container}>
            <Text>Calendrier a venir</Text>
        </View>
    )
}