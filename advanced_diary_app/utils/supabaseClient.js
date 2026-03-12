import { SUPABASE_URL, SUPABASE_API_KEY } from '../env';
import { Platform } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

console.log("Test supabase == ", SUPABASE_URL);

export const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY, {
    auth: {
        storage: Platform.OS === 'web' ? undefined : AsyncStorage, // Crucial sur mobile
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: Platform.OS === 'web'
    },
});