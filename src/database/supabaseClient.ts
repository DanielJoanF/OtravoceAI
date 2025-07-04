import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iwpglvultrexcyfqpyvp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3cGdsdnVsdHJleGN5ZnFweXZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MzI3ODgsImV4cCI6MjA2NjMwODc4OH0.JdEWRwSGXIGbDwOdBpX9f36050uCLQvo5YgZJJKFolA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
