import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/auth/auth.store';
import { decodeJwtToken } from '@/helpers/token-helper'; // Assuming this helper exists and works
import AuthLayout from '@/auth/components/layout'; // Use the same layout for consistency
import { MoonLoader } from 'react-spinners';

// Define expected JWT payload structure (adjust based on actual token)
interface JwtPayload {
    iss?: string;
    sub: string; // User ID
    email: string;
    phone?: string;
    firstname?: string; // Changed from firstname
    lastname?: string; // Changed from lastname
    org_id?: number;
    iat?: number;
    exp?: number;
    // Add other potential fields like roles if present in the token
    role?: string | string[]; // Example if role is in token
}

// Define AuthUser structure for the store (ensure this matches src/stores/authStore.ts or types)
// Ideally, import this type if it's defined elsewhere
interface AuthUser {
    id: string;
    email: string;
    role: string; // Assuming role might come from another source or default
    name: string;
}


export default function OAuthCallBack() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setAccessToken, setRefreshToken, setUser, setIsAuthorized } = useAuthStore();

    useEffect(() => {
        const token = searchParams.get('t');
        const refreshToken = searchParams.get('rt');
        const redirectPath = searchParams.get('redirect'); // Get the original redirect path
        const isAuthorized = searchParams.get('authorize');

        if (token && refreshToken) {
            console.log("OAuth Callback: Token received.");
            try {
                // 1. Store the access token and the refresh Token
                setAccessToken(token);
                setRefreshToken(refreshToken);


                // 2. Decode the token and cast to expected type
                const decodedPayload = decodeJwtToken(token) as JwtPayload; // Cast the result
                // console.log("Decoded Payload:", decodedPayload);

                // Validate essential fields from token
                if (!decodedPayload || !decodedPayload.sub || !decodedPayload.email) {
                    throw new Error("Invalid token payload: Missing required fields (sub, email).");
                }

                // 3. Format user data for the store, providing defaults for optional fields
                const userRole = typeof decodedPayload.role === 'string' ? decodedPayload.role : 'user'; // Default role
                const userName = (`${decodedPayload.firstname || ''} ${decodedPayload.lastname || ''}`.trim()) || decodedPayload.email; // Construct name or fallback to email

                const user: AuthUser = {
                    id: decodedPayload.sub,
                    email: decodedPayload.email, // Now guaranteed by the check above
                    role: userRole,
                    name: userName,
                };
                // console.log("User object for store:", user);

                // Set the stringify encoded version of the array of applications permissions
                if (isAuthorized) {
                    setIsAuthorized(isAuthorized);
                }
                // console.log("Permissions: ", encodedPermissions);

                // 4. Store the user object
                setUser(user);

                // 5. Navigate to the original redirect path or dashboard
                const finalRedirectPath = redirectPath ?? encodeURIComponent("/")
                console.log("Redirecting to:", finalRedirectPath);
                window.location.replace(decodeURIComponent(finalRedirectPath));

            } catch (error) {
                console.error("OAuth Callback Error:", error);
                // Handle errors (e.g., invalid token)
                // Optionally clear token/user from store if set partially
                // navigate('/sign-in?error=auth_failed', { replace: true }); // Example error redirect
                navigate('/sign-in', { replace: true }); // Simple redirect back to sign-in
            }
        } else {
            console.error("OAuth Callback: No token found in URL.");
            // Handle missing token error
            navigate('/sign-in', { replace: true });
        }
        // Effect should only run once on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array ensures it runs only once

    // Render loading state while processing
    return (
        <AuthLayout>
            <div className='flex items-center justify-center space-x-2'>
                <MoonLoader size={12} loading={true} />
                <div>Connecting...</div>
            </div>
        </AuthLayout>
    );
}
