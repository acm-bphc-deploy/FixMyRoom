import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import adminEmails from './config/adminEmails';

export default function RedirectPage() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    
    const allowedDomain = 'hyderabad.bits-pilani.ac.in';

    const handleUserRedirect = async (user: any) => {
      if (!user?.email || !user.email.endsWith(`@${allowedDomain}`)) {
        await supabase.auth.signOut();
        navigate('/');
        return;
      }
      if (adminEmails.includes(user.email)) {
        navigate('/AdminDashboard');
      } else {
        navigate('/MaintenancePortal');
      }
    };

<<<<<<< HEAD
    const tryGetSession = async () => {
=======
    const tryExchangeAndGetSession = async () => {
      // Try to exchange OAuth code from the URL into a session first. This
      // helps ensure the session is available on the redirect page.
      try {
        const { data: urlData, error: urlError } = await supabase.auth.getSessionFromUrl();
        if (urlError) {
          // Not necessarily fatal; continue to try getting session below.
          console.debug('getSessionFromUrl error (ignored):', urlError.message || urlError);
        } else {
          // If a session was returned directly, handle it.
          if (urlData?.session?.user) {
            await handleUserRedirect(urlData.session.user);
            return;
          }
        }
      } catch (err) {
        console.debug('getSessionFromUrl threw:', err);
      }

      // Fallback: try to read an existing session (after exchange might have completed)
>>>>>>> 1fc6e67 (added maint req feature)
      const { data, error } = await supabase.auth.getSession();
      const session = data.session;
      if (error) {
        navigate('/');
        return;
      }
      if (session?.user) {
        await handleUserRedirect(session.user);
      }
    };

<<<<<<< HEAD
    tryGetSession();
=======
    tryExchangeAndGetSession();
>>>>>>> 1fc6e67 (added maint req feature)

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await handleUserRedirect(session.user);
      } else if (event === 'SIGNED_OUT') {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='text-center'>
        <div className='w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto'></div>
        <h1 className='mt-4 text-2xl font-semibold text-gray-700'>
          {isProcessing ? 'Finalizing your login...' : 'Redirecting...'}
        </h1>
        <p className='text-gray-500'>
          Please wait, we're processing your authentication.
        </p>
      </div>
    </div>
  );
}
