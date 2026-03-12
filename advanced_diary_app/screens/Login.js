import { StyleSheet , View, Text, TouchableOpacity, Platform } from "react-native";
import { useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context"
import { Image } from 'expo-image'
import { useResponsiveContext } from "../context/ResponsiveContext";
import { supabase } from '../utils/supabaseClient';
import * as AuthSession from 'expo-auth-session';
import * as Linking from 'expo-linking';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useSupabaseSession } from "../context/AuthContext";

const redirectUri = AuthSession.makeRedirectUri({
  scheme: "diary",
  useProxy: false
});
console.log('Test affichage redirect', redirectUri);

const handleLogin = async (provider) => {
  console.log('Appel a handleLogin with provider : ', provider);
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider,
    options: { redirectTo: redirectUri }
  });
  if (error) {
    console.log("Erreur de login Supabase : ", error);
    return;
  }
  if (!data?.url) {
    console.log("Pas d'URL de login");
    return;
  }
  console.log('No error, url OK : ', data.url);
  await Linking.openURL(data.url);
  // MANIERE NATIVE AVEC DEV BUILD
  // const result = await AuthSession.startAsync({authUrl : data.url});
  // if (result?.type === 'success') {
  //   console.log("Connexion reussie");
  //   // Supabase gere le token et la session cote client
  //   // supabase.auth.getSession() //est maintenant utilisable
  //   const {data: sessionData} = await supabase.auth.getSession();
  //   console.log("Session : ", sessionData);  
  // } else {
  //   console.log("Connexion error : ", result);
  // }
  console.log("Sortie de handleLogin");
};

export default function LoginPage() {
  const [showProviders, setShowProviders] = useState(false);
  console.log("Entree dans LoginPage");
  const { height, width, moderateScale } = useResponsiveContext();
  const isLandscape = width > height

  // const { session, user } = useSupabaseSession();
  // console.log("Session dans Login = ", session);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    viewMainContent: {
      paddingBottom: isLandscape ? moderateScale(20) : moderateScale(50),
      flex: 1,
      gap: isLandscape ? moderateScale(25) : moderateScale(35),
      justifyContent: 'center',
      alignItems: 'center',
    },
    viewHeader: {
      padding: moderateScale(10),
      gap: isLandscape ? moderateScale(25) : moderateScale(35),
      alignItems: 'flex-end',
    },
    welcomeSentence: {
      color: 'white',
      fontSize: isLandscape? moderateScale(36) : moderateScale(30)
    },
    textLoginButton: {
      color: 'white',
      fontSize: isLandscape? moderateScale(16) : moderateScale(14)
    },
    loginButton: {
      padding: isLandscape? moderateScale(10) : moderateScale(20),
      paddingHorizontal: isLandscape? moderateScale(10) : moderateScale(20),
      borderWidth:moderateScale(2),
      borderColor: 'white',
  },
    providerButton: {
      padding: isLandscape? moderateScale(5) : moderateScale(10),
      paddingHorizontal: isLandscape? moderateScale(10) : moderateScale(20),
      borderWidth: moderateScale(1),
      borderColor: 'white',
      backgroundColor: 'grey',
      alignItems: 'center',
      gap: 6
  },
    backButton:{
      paddingHorizontal: isLandscape? moderateScale(5) : moderateScale(10),
      borderRadius: moderateScale(30),
      flexDirection: 'row',
      gap: 4
  },
  });

  return (
      <SafeAreaView style={styles.container}>
          <Image
              source={require('../assets/Feuilles.webp')}
              contentFit="cover"
              style={StyleSheet.absoluteFillObject}
          />
          {showProviders ? (
            <View style={styles.container}>
              <View style={styles.viewHeader}>
                <TouchableOpacity onPress={() => setShowProviders(false)} style={styles.backButton}>
                  <Text style={styles.textLoginButton}>Get Back</Text>
                  <AntDesign name="rollback" size={isLandscape? moderateScale(16) : moderateScale(14)} color="white" />
                </TouchableOpacity>
              </View>
              <View style={styles.viewMainContent}>
                <TouchableOpacity onPress={() => handleLogin('github')} style={styles.providerButton}>
                  <Text style={styles.textLoginButton}>Login with Github
                  </Text>
                  <AntDesign name="github" size={isLandscape? moderateScale(16) : moderateScale(14)} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleLogin('google')} style={styles.providerButton}>
                  <Text style={styles.textLoginButton}>Login with Google</Text>
                  <AntDesign name="google" size={isLandscape? moderateScale(16) : moderateScale(14)} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
          <View style={styles.container}>
            <View style={styles.viewMainContent}>
              <Text style={styles.welcomeSentence}>Welcome to your Diary</Text>
              <TouchableOpacity onPress={() => setShowProviders(true)}
              style={styles.loginButton}
              >
                  <Text style={styles.textLoginButton}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
          )}
      </SafeAreaView>
  )
};