import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { AppState, Linking, Platform } from 'react-native';
import { supabase } from '../utils/supabaseClient';

const SessionContext = createContext();

const extractTokensFromUrl = (url) => {
  try {
    const fragment = url.split('#')[1];
    if (!fragment) return null;
    const params = new URLSearchParams(fragment);
    return {
      access_token: params.get('access_token'),
      refresh_token: params.get('refresh_token'),
    };
  } catch (err) {
    console.error("Erreur parsing URL:", err);
    return null;
  }
};

const initSession = async (setSession) => {
  console.log("initSession called !");
  const { data, error } = await supabase.auth.getSession();
  if (error) console.log("Erreur getting session :", error);
  else {
    console.log("Session récupéréee : ", data?.session ?? null);
    setSession(data?.session ?? null);
  };
};

const handleDeepLink = async (event) => {
  const url = event.url;
  console.log("URL de redirection reçu :", url);
  try {
    const tokens = extractTokensFromUrl(url);
    if (!tokens || !tokens.access_token) {
      console.log("Pas de tokens dans l'URL");
      return;
    }
    const { error } = await supabase.auth.setSession(tokens);
    if (error) {
      console.log("Erreur setSession : ", error);
    } else {
      console.log("Session set");
    }
  } catch (err) {
    console.error("Erreur ou timeout handleDeepLink:", err);
  }
};

const fetchNotes = async (user, setNotes) => {
  if (!user) return;
  const { data, error } = await supabase
    .from('Notes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', {ascending: false});
    if (!error) setNotes(data);
    else console.log('Error Fecthing Notes', error);
};

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [notes, setNotes] = useState([]);

  console.log("SessionProvider rendu !");

  // Session Logic
  useEffect(() => {
    console.log("useEffect monté !");
    initSession(setSession);
    // Listener sur les changement de sessions
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log("Auth state changed : ", _event);//session
        setSession(session);
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    }
  }, []);// Au montage

  // Redirection Auth0 Logic
  useEffect(() => {
    let deepLinkListener;

    console.log("Config listener mobile");
    deepLinkListener = Linking.addEventListener('url', handleDeepLink);

    return () => {
      deepLinkListener?.remove();
    }
  }, []);

  const user = session?.user ?? null;

  // Notes Logic
  console.log('Before useEffect');
  useEffect(() => {
    if (!user) {
      setNotes([]);
      return;
    }

    console.log('Durant useEffect');
    fetchNotes(user, setNotes);
    console.log(`UseState Session provider avec user ${user?.id ?? "null"}, fetchNotes : `, notes);
    
    // Listenner sur la db 
    const subscription = supabase
      .channel(`notes_user-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Notes',
          filter: `user_id=eq.${user.id}`,
        },
        payload => {
          console.log('Changement sur la table Notes reçu : ', payload)
          // Recharge toute la liste (pas très opti mais suffisant pour notre utilisation)
          fetchNotes(user, setNotes);
        }
      )
      .subscribe();

      return () => {
        // Nettoyage au demontage
        supabase.removeChannel(subscription);
      }
  }, [user]);

  return <SessionContext.Provider value={{session, user, notes}}>
    {children}
  </SessionContext.Provider>;
}

export const useSupabaseSession = () => useContext(SessionContext);