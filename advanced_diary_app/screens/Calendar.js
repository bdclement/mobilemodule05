import { useState, useMemo } from "react";
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsiveContext } from "../context/ResponsiveContext";
import { formatDatePartsEn, formatLocalDate } from "../utils/utils";
import { useSupabaseSession } from "../context/AuthContext";
import ModalToFill from "../components/Modal";
import NoteRetrieve from "../components/NoteRetrieve";
import { FontAwesome5 } from "@expo/vector-icons";
import { FEELINGS } from "../utils/notes";

export default function CalendarScreen() {
    const { height, width, moderateScale, verticalScale, horizontalScale } = useResponsiveContext();
    const isLandscape = width > height
    const { notes } = useSupabaseSession();

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedNote, setSelectedNote] = useState(null);

    const notesForSelectedDate = useMemo(() => {
        if (!selectedDate) return [];
        return notes.filter((n) => formatLocalDate(n.created_at) === selectedDate);
      }, [notes, selectedDate]);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "#b8b8b8",
            flexDirection: isLandscape ? "row" : "column",
            width: "100%",
            gap: isLandscape ? moderateScale(10) : moderateScale(0),
        },
        calendarContainer: {
            marginVertical: isLandscape ? moderateScale(14) : moderateScale(40),
            borderRadius: isLandscape ? moderateScale(8) : moderateScale(0),
            borderColor: "#0e6f03c5",
            borderWidth: isLandscape ? 1 : 0,
        },
        listNotesContainer: {
            marginVertical: isLandscape ? moderateScale(12) : moderateScale(0),
            padding: isLandscape ? moderateScale(0) : moderateScale(6),
            height: isLandscape? '100%' : '50%',
            borderColor: "#e3e3e3",
            borderTopWidth: isLandscape? 0: 1,
        },
        messageInfoListNotes: {
            padding: moderateScale(20),
            textAlign: 'center',
            fontSize: moderateScale(16),
            color: "#0e6f03c5",
        },
        listItem: {
            height: isLandscape ? moderateScale(56) : moderateScale(80),
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            backgroundColor: '#e3e3e3',
            marginHorizontal: isLandscape? moderateScale(12) : moderateScale(10),
            marginVertical: isLandscape? moderateScale(2) : moderateScale(4),
            borderRadius: moderateScale(3),
            padding: isLandscape? moderateScale(4) : moderateScale(8),
        },
        listItemDate: {
            flexDirection: 'column',
            gap: moderateScale(2),
            alignItems: 'center',
            width: '25%'
        },
        listTitleWrapper: {
            height: '100%',
            borderLeftWidth: moderateScale(2),
            borderLeftColor: "#0e6f03c5",
            justifyContent: "center", 
        },
        listItemTitle: {
            textAlign: 'center',
            paddingLeft: moderateScale(30),
            width: isLandscape? moderateScale(110) : moderateScale(160) 
        }
    });
    return (
        <SafeAreaView style={styles.container}>
            <Calendar
                onDayPress={day => {
                    // console.log("Day press : ", day);
                    setSelectedDate(day.dateString);
                }}
                markedDates={{
                    ...(selectedDate && {
                      [selectedDate]: {
                        selected: true,
                        selectedColor: "#0e6f03c5",
                        selectedTextColor: "#ffffff",
                      },
                    }),
                  }}
                style={styles.calendarContainer}
                theme={{
                    calendarBackground: "#b8b8b8",
                    monthTextColor: "#0e6f03c5",
                    arrowColor: "#0e6f03c5",
                    
                    textSectionTitleColor: "#1f2937",
                    dayTextColor: "black",
                    selectedDayTextColor: "white",

                    todayTextColor: "#de7c1b",
                }}
                showSixWeeks={true}
                hideExtraDays={false}
            />
            <FlatList
              style={styles.listNotesContainer}
              data={selectedDate ? notesForSelectedDate : []}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ margin: 0, padding: 0, gap: 0}}
              renderItem={({ item }) => {

                const { day, month, year } = formatDatePartsEn(item.created_at);
                return (
                <Pressable style={styles.listItem} onPress={() => setSelectedNote(item)}>
                    <View style={styles.listItemDate}>
                        <Text>{day}</Text>
                        <Text>{month}</Text>
                        <Text>{year}</Text>
                    </View>
                    <FontAwesome5 name={FEELINGS[item.icon] ?? "question"} size={isLandscape? moderateScale(16) : moderateScale(22)} color={item.icon.toLowerCase().includes("sad") ? "#de7c1b" : "#2dc61c"}/>
                    <View style={styles.listTitleWrapper}>
                        <Text style={styles.listItemTitle} numberOfLines={1}>
                        {item.title}
                        </Text>
                    </View>
                </Pressable>
                )}}
              ListEmptyComponent={
                  <Text style={styles.messageInfoListNotes}>
                    {!selectedDate
                      ? "Aucune date sélectionnée"
                      : "Aucune note disponible pour ce jour"}
                  </Text>
              }
            />
            <ModalToFill visible={!!selectedNote} onClose={() => setSelectedNote(null)}>
              {selectedNote && (
                <NoteRetrieve item={selectedNote} onCloseModal={() => setSelectedNote(null)} />
              )}
            </ModalToFill>
        </SafeAreaView>
    )
}