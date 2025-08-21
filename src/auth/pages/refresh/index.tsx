import { useEffect } from 'react'; // Import useEffect and useRef
import { useAuthStore } from '@/auth/auth.store'; // Import auth store
import { useSearchParams } from 'react-router-dom'; // Import useSearchParams
import AuthLayout from '@/auth/components/layout';
import { MoonLoader } from 'react-spinners';

export default function RefreshAuth() {
    const [searchParams] = useSearchParams(); // Get search params
    // We only need the store state to check if already authenticated
    const refreshToken = useAuthStore((state) => state.refreshToken);

    useEffect(() => {
        // Check if the refresh Token exist already authenticated
        if (refreshToken) {
            // Get the original redirect URL from the current page's query params
            const originalRedirectUrl = searchParams.get('redirect');
            const AUTH_BASE_URL = import.meta.env.VITE_APP_AUTH_BASE_URL ?? "http://localhost:5174";
            const APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL ?? "http://localhost:5173";
            const APP_ID = import.meta.env.VITE_APP_ID ?? "whatsappbusiness";
            // Construct auth URL for redirection
            let authUrl = `${AUTH_BASE_URL}/oauth/refresh?app=${APP_ID}&rt=${refreshToken}&callback=${encodeURIComponent(`${APP_BASE_URL}/oauth/callback`)}`;
            // Append the final destination redirect URL if it exists
            if (originalRedirectUrl) {
                authUrl += `&redirect=${encodeURIComponent(originalRedirectUrl)}`;
            }
            // Redirect the current window/tab
            window.location.replace(authUrl);
        }

    }, []); // Depend on accessToken

    // Render a loading/redirecting message or null while the effect runs

    return (
        <AuthLayout>
            <div className='flex items-center justify-center space-x-2'>
                <MoonLoader size={12} loading={true} />
                <div>Reconnecting...</div>
            </div>
        </AuthLayout>
    )
}
