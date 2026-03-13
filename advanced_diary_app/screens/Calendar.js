import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsiveContext } from "../context/ResponsiveContext";

export default function CalendarScreen() {
    const { height, width, moderateScale, verticalScale, horizontalScale } = useResponsiveContext();
    const isLandscape = width > height

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "#b8b8b8",
            flexDirection: isLandscape ? "row" : "column",
            width: "100%",
            gap: isLandscape ? moderateScale(10) : moderateScale(0),
        },
        calendarContainer: {
            marginVertical: isLandscape ? moderateScale(14) : moderateScale(50),
            flex:1,
            height: isLandscape? '97%' : '60%',
            borderRadius: moderateScale(8),
        },
        listNotesContainer: {
            backgroundColor: "white",
            borderRadius: moderateScale(8),
            marginVertical: isLandscape ? moderateScale(14) : moderateScale(0),
            paddingVertical: isLandscape ? moderateScale(14) : moderateScale(0),
            width: isLandscape ? '20%' : '100%',
            height: isLandscape? '97%' : '60%',
        }
    });
    return (
        <SafeAreaView style={styles.container}>
            <Calendar
                onDayPress={day => {
                    console.log("Day press : ", day);
                }}
                style={styles.calendarContainer}
                theme={{
                    todayTextColor: "#0e6f03c5",
                    monthTextColor: "#0e6f03c5",
                    arrowColor: "#0e6f03c5",
                }}
            />
            <ScrollView style={styles.listNotesContainer}>
                <Text>TEST</Text>
            </ScrollView>
        </SafeAreaView>
    )
}