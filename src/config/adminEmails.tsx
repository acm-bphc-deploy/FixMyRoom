import { supabase } from '../supabaseClient';

const adminEmails = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('admins')
    .select('email_id');
  if (error) {
    console.error('Error fetching admin emails:', error);
    return [];
  }
  return (data || []).map((row) => row.email_id);
};

export default adminEmails;