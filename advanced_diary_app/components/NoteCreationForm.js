import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../utils/supabaseClient';
import { useResponsiveContext } from "../context/ResponsiveContext";
import { FEELINGS, FEELINGS_OPTIONS } from '../utils/notes';

export default function NoteCreationForm({ userId, onClose }) {
    const { height, width, moderateScale, verticalScale, horizontalScale } = useResponsiveContext();
    const isLandscape = width > height
    
    const [title, setTitle] = useState(null);
    const [feeling, setFeeling] = useState('');
    const [icon, setIcon] = useState(FEELINGS_OPTIONS[2]);
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        if (!title || title.trim().length === 0) {
          Alert.alert('Error', 'Title is mandatory.');
          return false;
        }

        if (!icon) {
            Alert.alert('Error', 'Choosing a feeling is mandatory.');
            return false;
        }

        return true;
    };


    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        const { data, error } = await supabase
          .from('Notes')
          .insert([{ user_id: userId, title, feeling, icon }]);
        setLoading(false);

        if (error) {
          Alert.alert('Error', error.message);
          console.log("Alert envoye Car error :", error.message);
        } else {
          Alert.alert('Success', 'Note created !');
          // console.log("Alerte envoyé car OK");
          onClose();
        }
      };
  
    const styles = StyleSheet.create({
      container: {
        marginVertical: isLandscape? moderateScale(0) : moderateScale(6),
        maxHeight: isLandscape? height * 0.8 : height * 0.7,
      },
      title: {
        textAlign: 'center',
        marginVertical: isLandscape? moderateScale(0) :  moderateScale(10),
        fontStyle: 'italic'
      },
      input: {
        borderWidth: 1,
        borderColor: '#1a1818',
        borderRadius: moderateScale(10),
        padding:  isLandscape? moderateScale(4) : moderateScale(8),
        marginVertical: 8,
        color: 'black',
      },
      inputPicker: {
        marginVertical: isLandscape? moderateScale(0) : moderateScale(10),
        height: isLandscape ? moderateScale(90) : moderateScale(150),
        transform: isLandscape ? [{ scaleY: 0.9 }] : [],
      },
      button: {
        color: "#2dc61c"
      }
    });

  return (
    <ScrollView
    contentContainerStyle={{paddingBottom: moderateScale(10)}}
    showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
          <Text style={styles.title}>Fill form to create your new entry</Text>
          <TextInput
            placeholder="Title of your note"
            placeholderTextColor="#c6c3c3"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
          <TextInput
            placeholder="Explain how you feel"
            placeholderTextColor="#c6c3c3"
            value={feeling}
            onChangeText={setFeeling}
            style={styles.input}
          />
          <Text style={styles.title}>Choose feeling :</Text>
          <Picker
              selectedValue={icon}
              onValueChange={(itemValue) => setIcon(itemValue)}
              style={styles.inputPicker}
          >
              {FEELINGS_OPTIONS.map((f) => (
                <Picker.Item key={f} label={f} value={f}/>
              ))}
          </Picker>
          <Button title={loading ? "Creating..." : "Create"} onPress={handleSubmit} disabled={loading} color="#2dc61c"/>
      </View>
    </ScrollView>
  );
}
