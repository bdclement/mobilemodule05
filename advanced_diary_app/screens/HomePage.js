import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from 'expo-image'
import { FontAwesome5 } from '@expo/vector-icons';
import { useSupabaseSession } from "../context/AuthContext";
import { useResponsiveContext } from "../context/ResponsiveContext";
import { supabase } from '../utils/supabaseClient';
import { getDisplayName, getAvatarUrl } from '../utils/utils';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import ModalToFill from '../components/Modal';
import NoteCreationForm from '../components/NoteCreationForm';
import { FEELINGS } from '../utils/notes';
import NoteRetrieve from '../components/NoteRetrieve';

const handleLogout = async () => {
  console.log('Appel a handleLogout');
  const resultLogout = await supabase.auth.signOut();
  console.log("result Logout", resultLogout);
};

export default function HomePage() {
  // console.log("Entree dans HomePage");
  const { height, width, moderateScale, verticalScale, horizontalScale } = useResponsiveContext();
  const isLandscape = width > height
  const { session, user, notes, percentages } = useSupabaseSession();
  const [modalCeationNoteVisible, setModalCeationNoteVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const userName = getDisplayName(user);

  const avatarUrl = getAvatarUrl(user);

  console.log('Notes recupérée depuis HomePage : ', notes);
  console.log("Percentages recupérés depuis HomePage : ", percentages);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      height: isLandscape? height * 0.25 : height * 0.15,
      backgroundColor: 'rgba(3, 3, 3, 0.6)',
      justifyContent: "space-around",
      alignItems: 'center',
      flexDirection: "row",
    },
    avatar: {
      width: isLandscape? moderateScale(30) : moderateScale(50),
      height: isLandscape? moderateScale(30) : moderateScale(50),
      borderRadius: 100,
    },
    username: {
      color: "white",
      fontSize: moderateScale(20),
      fontStyle: "italic",
      letterSpacing: moderateScale(1),

    },
    textButtonLogout: {
      color: 'white',
      fontSize: isLandscape? moderateScale(10) : moderateScale(14),
      borderWidth:moderateScale(2),
      borderColor: 'white',
    },
    buttonLogout: {

    },
    listContainer: {
      flex: 1,
      // minHeight: isLandscape? height * 0.50 : height * 0.63,
      padding: isLandscape? moderateScale(5) : moderateScale(15),
    },
    mainList: {
      flex: 1,
      margin: isLandscape? moderateScale(4) : moderateScale(15),
      backgroundColor: 'rgba(3, 3, 3, 0.7)',
      borderRadius: 15,
    },
    list: {
      flex: 1,
      flexDirection: isLandscape? 'row' : 'column',
    },
    emptyMainList: {
      flex: 1,
      justifyContent: 'space-evenly',
      alignItems: 'center',
    },
    listTitle: {
      color: "#f3e7bb",
      textAlign: 'center',
      margin: isLandscape? moderateScale(0) : moderateScale(2),
      fontWeight: 'bold',
      fontSize: isLandscape? moderateScale(8) : moderateScale(14),
    },
    listItem: {
      backgroundColor: "#0e6f03c5",
      height: isLandscape? moderateScale(16) : moderateScale(60),
      marginHorizontal: isLandscape? moderateScale(22) : moderateScale(10),
      marginVertical: isLandscape? moderateScale(1) : moderateScale(12),
      borderRadius: 15,
      flexDirection: 'row',
      justifyContent: isLandscape ? 'center' : '',
      alignItems: 'center',
      gap: isLandscape? moderateScale(8) : moderateScale(20),
    },
    titleItem: {
      color: "#f3e7bb",
      width: "35%",
      borderRightWidth: isLandscape? moderateScale(1) : moderateScale(2),
      borderRightColor: "#f3e7bb",
      padding: isLandscape? moderateScale(2) : moderateScale(14),
      flexDirection: isLandscape ? 'row' : 'column'
    },
    percentageItem: {
      flex: 1,
      flexDirection: 'row',
    },
    percentageIcon: {
      marginVertical:isLandscape ? moderateScale(2) : moderateScale(2),
      width: '50%',
      textAlign: 'center'
    },
    percentageText: {
      marginVertical:isLandscape ? moderateScale(2) : moderateScale(2),
      width: '50%',
      color: "#f3e7bb",
      fontSize: isLandscape ? moderateScale(8) : moderateScale(18),
      textAlign: isLandscape? 'left' : 'center',
    },
    footer: {
      height: isLandscape? height * 0.1 : height * 0.06,
      margin: isLandscape? moderateScale(0) : moderateScale(4),
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
    buttonCreate: {
      backgroundColor: "#1a1818",
      paddingVertical: isLandscape? moderateScale(3) : moderateScale(10),
      paddingHorizontal: isLandscape? moderateScale(14) : moderateScale(20),
      borderRadius: 50,
    },
    textButtonCreate: {
      color: "#2dc61c",
      fontSize: isLandscape? moderateScale(9) : moderateScale(14),
    },
  });

  return (
      <SafeAreaView style={styles.container}>
        <Image 
            source={require('../assets/ChemineeCosy.jpg')}
            contentFit="cover"
            style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.header}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar}/>
          ) : (
            <Image source={require('../assets/AvatarDefault.jpg')} style={styles.avatar}/>
          )}
          <Text style={styles.username}>{userName}'s Diary</Text>
          <TouchableOpacity onPress={() => handleLogout()} style={styles.buttonLogout}>
            <SimpleLineIcons name="logout" size={isLandscape? moderateScale(16) : moderateScale(14)} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.listContainer}>
          <View style={styles.mainList}>
            <Text style={styles.listTitle}>Your last diary entries</Text>
            <FlatList
            style={styles.list}
            data={notes.slice(0, 2)} // la source de données
            keyExtractor={(item) => item.id} // clé unique par item
            renderItem={({ item }) => (
                <Pressable 
                onPress={() => setSelectedNote(item)}
                style={styles.listItem}
                >
                  <Text style={styles.titleItem}>{new Date(item.created_at).toLocaleDateString()}</Text>
                  <Text style={styles.titleItem} numberOfLines={1}>{item.title}</Text>
                  <FontAwesome5 name={FEELINGS[item.icon] ?? "question"} size={isLandscape? moderateScale(12) : moderateScale(20)} color={item.icon.toLowerCase().includes("sad") ? "#de7c1b" : "#2dc61c"}></FontAwesome5>
                </Pressable>
              )}
              contentContainerStyle={[styles.listContent, { flexGrow: 1 }]} // style du container interne
              ItemSeparatorComponent={() => <View style={{ height: isLandscape? moderateScale(1) : moderateScale(6)}} />} 
              ListEmptyComponent={
                <View style={styles.emptyMainList}>
                  <Text style={{color: "#f3e7bb", fontSize: isLandscape ? moderateScale(8) : moderateScale(18), textAlign: 'center'}}>Looks like you don't have any entry yet.</Text>
                  <FontAwesome5 name={FEELINGS["Very sad"]} size={isLandscape? moderateScale(12) : moderateScale(40)} color={"#de7c1b"}></FontAwesome5>
                </View>
              }
              
            />

          </View>
        </View>
        <View style={styles.listContainer}>
              <View style={styles.mainList}>
                <Text style={styles.listTitle}>
                  {notes.length === 0 ? "Create entry to see your feel percentages" : notes.length === 1 ? `Your feel for your only entry` :  `Your feel for your ${notes.length} entries`}
                </Text>
                {notes.length > 0 ? 
                <View style={styles.list}>
                  <FlatList 
                  contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-evenly' }}
                    style={[styles.list]}
                    data={percentages}
                    keyExtractor={(item) => item[0]}
                    numColumns={isLandscape ? percentages.length : 1}
                    key={isLandscape ? 'landscape' : 'portrait'}  
                    renderItem={({item}) => {
                      const feeling = item[0];
                      const percentage = item[1];
                      
                      return (
                        <View style={[styles.percentageItem,]}>
                          <FontAwesome5 name={FEELINGS[feeling]} style={styles.percentageIcon} size={isLandscape? moderateScale(14) : moderateScale(24)} color={feeling.toLowerCase().includes("sad") ? "#de7c1b" : "#2dc61c"}></FontAwesome5>
                          <Text style={styles.percentageText}>{percentage}%</Text>
                        </View>
                      );
                    }}
                    ItemSeparatorComponent={() => <View style={{ flex: 1, height: isLandscape? moderateScale(1) : moderateScale(12)}} />} 
                  />
                </View> 
                : 
                <View style={[styles.list, {justifyContent: 'center'}]}>
                  <Text style={{color: "#f3e7bb", fontSize: isLandscape ? moderateScale(8) : moderateScale(14), textAlign: 'center'}}>No percentages available</Text>
                </View> 
                }
              </View>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => setModalCeationNoteVisible(true)} style={styles.buttonCreate}>
            <Text style={styles.textButtonCreate}>Create new entry</Text>
          </TouchableOpacity>
        </View>
        <ModalToFill visible={modalCeationNoteVisible} onClose={() => setModalCeationNoteVisible(false)}>
              <NoteCreationForm userId={user.id} onClose={() => setModalCeationNoteVisible(false)}/>
        </ModalToFill>
        <ModalToFill visible={!!selectedNote} onClose={() => setSelectedNote(null)}>
              {selectedNote && (
                <NoteRetrieve item={selectedNote} onCloseModal={() => setSelectedNote(null)}></NoteRetrieve>
              )}
        </ModalToFill>
      </SafeAreaView>
  )
}