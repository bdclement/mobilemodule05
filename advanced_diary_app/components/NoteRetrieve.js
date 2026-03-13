import { useResponsiveContext } from "../context/ResponsiveContext";
import { supabase } from '../utils/supabaseClient';
import { View, TextInput, Button, Alert, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FEELINGS } from '../utils/notes';
import { FontAwesome5 } from '@expo/vector-icons';

const handleDeleteItem = async (itemId, onCloseModal) => {
    console.log("Appel a handleDeleteItem avce itemId : ", itemId);
    const { error } = await supabase
        .from('Notes')
        .delete()
        .eq('id', itemId);

        if (error) {
            Alert.alert("Erreur", error.message);
        } else {
            Alert.alert("Succès", "La note a été supprimée");
        }
        onCloseModal();
};

export default function NoteRetrieve({item, onCloseModal}) {
    const { height, width, moderateScale, verticalScale, horizontalScale } = useResponsiveContext();
    const isLandscape = width > height

    const styles = StyleSheet.create({
      container: {
        marginVertical: isLandscape ? moderateScale(10) :moderateScale(6),
        padding: isLandscape? moderateScale(2) : moderateScale(4),
        minHeight: isLandscape? height * 0.4 : height * 0.50,
        justifyContent: 'space-between',
        // backgroundColor: 'white'
      },
      title: {
        color: "#f3e7bb",
        textAlign: 'center',
        fontSize: isLandscape? moderateScale(20) : moderateScale(26),
      },    
      text: {
        color: "#f3e7bb",
        textAlign: 'center',
        fontStyle: 'italic'
      },
      icon: {
        // size: isLandscape? moderateScale(20) : moderateScale(50),
        color: item.icon.toLowerCase().includes("sad") ? "#de7c1b" : "#2dc61c",
        textAlign: 'center',
        margin: isLandscape? moderateScale(6) : moderateScale(0)
      },
      button: {
        backgroundColor: "red",
        borderRadius: moderateScale(50),
        alignItems: 'center',
        padding: isLandscape? moderateScale(4) : moderateScale(12),
        marginTop: isLandscape? moderateScale(12) : moderateScale(),
      }
    });

    return (
        <View style={styles.container}>
            <Text style={styles.title} numberOfLines={3}>{item.title}</Text>
            <Text style={styles.text}>{new Date(item.created_at).toLocaleDateString()}</Text>
            <FontAwesome5 name={FEELINGS[item.icon] ?? "question"} style={styles.icon} size={isLandscape? moderateScale(30) : moderateScale(50)}></FontAwesome5>
            <Text style={styles.text} numberOfLines={4}>{item.feeling}</Text>
            <TouchableOpacity onPress={() => handleDeleteItem(item.id, onCloseModal)} style={styles.button}>
                <Text>Supprimer la note</Text>
            </TouchableOpacity>
        </View>
    )
}