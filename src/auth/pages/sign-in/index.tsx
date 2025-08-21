import { useEffect } from 'react'; // Import useEffect and useRef
import { useAuthStore } from '@/auth/auth.store'; // Import auth store
import { useNavigate, useSearchParams } from 'react-router-dom'; // Import useSearchParams
import AuthLayout from '@/auth/components/layout';
import { MoonLoader } from 'react-spinners';

export default function SignIn() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams(); // Get search params
    // We only need the store state to check if already authenticated
    const accessToken = useAuthStore((state) => state.accessToken);

    useEffect(() => {
        // Check if already authenticated
        if (accessToken) {
            const redirectUrl = searchParams.get('redirect');
            console.log("Already authenticated, redirecting to:", redirectUrl || '/');
            navigate(redirectUrl || '/', { replace: true });
            return;
        }

        // If not authenticated, construct the auth URL and redirect the main window
        else {
            // Get the original redirect URL from the current page's query params
            const originalRedirectUrl = searchParams.get('redirect');

            // Open the authentication app URL in a centered mini window (pop-up)
            const AUTH_BASE_URL = import.meta.env.VITE_APP_AUTH_BASE_URL ?? "http://localhost:5174";
            const APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL ?? "http://localhost:5173";
            const APP_ID = import.meta.env.VITE_APP_ID ?? "services";
            // Construct auth URL for redirection
            let authUrl = `${AUTH_BASE_URL}/oauth/sign-in?app=${APP_ID}&callback=${encodeURIComponent(`${APP_BASE_URL}/oauth/callback`)}`;

            // Append the final destination redirect URL if it exists
            if (originalRedirectUrl) {
                authUrl += `&redirect=${encodeURIComponent(originalRedirectUrl)}`;
            }

            console.log("Not authenticated, redirecting main window to:", authUrl);
            // Redirect the current window/tab
            window.location.replace(authUrl);
            // No need to render anything further as the page will navigate away
        }

    }, [accessToken, navigate, searchParams]); // Depend on accessToken

    // Render a loading/redirecting message or null while the effect runs
    // This prevents rendering the card if navigation happens immediatelyredirectParam

    return (
        <AuthLayout>
            <div className='flex items-center justify-center space-x-2'>
                <MoonLoader size={12} loading={true} />
                <div>Connecting...</div>
            </div>
        </AuthLayout>
    )
}
