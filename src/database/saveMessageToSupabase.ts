import { supabase } from './supabaseClient';

export async function saveMessageToSupabase(message: string) {
  console.log('📡 Mengirim pesan ke Supabase:', message);

  const { data, error } = await supabase
    .from('user_responses')
    .insert([{ user_message: message }]);

  if (error) {
    console.error('❌ Gagal menyimpan ke Supabase:', error.message);
  } else {
    console.log('✅ Berhasil simpan ke Supabase:', data);
  }
}
