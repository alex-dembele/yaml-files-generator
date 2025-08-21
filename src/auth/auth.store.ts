import Cookies from 'js-cookie'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const ACCESS_TOKEN = '_';
const REFRESH_TOKEN = '_r';
const IS_AUTHORIZED = '_authorized';


interface AuthUser {
    id: string;
    email: string;
    role: string; // Keep as string
    name: string;
    avatar?: string;
}

// Define state and actions at the top level
interface AuthState {
    user: AuthUser | null;
    accessToken: string;
    encodedPermissions: string,
    refreshToken: string;
    isAuthenticated: boolean;
    setUser: (user: AuthUser | null) => void;
    setAccessToken: (accessToken: string) => void;
    setRefreshToken: (refreshToken: string) => void;
    setIsAuthorized: (encodedPermissions: string) => void;
    reset: () => void;
    // resetAccessToken is redundant if reset clears the token
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => {
            // Initialize token and auth status ONLY from cookie now
            const cookieToken = Cookies.get(ACCESS_TOKEN);
            const cookieendcodedPermissions = Cookies.get(IS_AUTHORIZED);

            const initialToken = cookieToken ? JSON.parse(cookieToken) : '';
            const initialIsAuthenticated = !!initialToken;
            const initialEncodedPermissions = cookieendcodedPermissions ? JSON.parse(cookieendcodedPermissions) : '';

            // Initialize token and auth status ONLY from cookie now
            const cookieRefreshToken = Cookies.get(REFRESH_TOKEN);
            const initialRefreshToken = cookieRefreshToken ? JSON.parse(cookieRefreshToken) : '';

            return {
                // Initial state values
                user: null, // Will be hydrated from localStorage if present
                accessToken: initialToken, // Initialized ONLY from cookie
                isAuthenticated: initialIsAuthenticated, // Initialized ONLY from cookie state
                refreshToken: initialRefreshToken, // Initialized ONLY from cookie
                encodedPermissions: initialEncodedPermissions,
                // Actions defined at the top level
                setUser: (user) => set({ user }), // Simpler update
                setIsAuthorized: (encodedPermissions) => {
                    Cookies.set(IS_AUTHORIZED, JSON.stringify(encodedPermissions));
                    set({ encodedPermissions: encodedPermissions })
                },
                setAccessToken: (accessToken) => {
                    const isAuthenticated = Boolean(accessToken && accessToken.trim());
                    if (isAuthenticated) {
                        Cookies.set(ACCESS_TOKEN, JSON.stringify(accessToken));
                    } else {
                        Cookies.remove(ACCESS_TOKEN); // Remove cookie if token is empty/null
                    }
                    set({ accessToken: accessToken, isAuthenticated: isAuthenticated }); // Update state
                },
                setRefreshToken: (refreshToken: string) => {
                    const isAuthenticated = Boolean(refreshToken && refreshToken.trim());
                    if (isAuthenticated) {
                        Cookies.set(REFRESH_TOKEN, JSON.stringify(refreshToken));
                    } else {
                        Cookies.remove(REFRESH_TOKEN); // Remove cookie if token is empty/null
                    }
                    set({ refreshToken: refreshToken, isAuthenticated: isAuthenticated }); // Update state
                },
                reset: () => {
                    Cookies.remove(REFRESH_TOKEN);
                    Cookies.remove(ACCESS_TOKEN);
                    Cookies.remove(IS_AUTHORIZED);

                    set({ user: null, accessToken: '', isAuthenticated: false }); // Reset state
                },
            }; // Close the return object for the store creator function
        }, // Close the store creator function itself
        { // Start the persist middleware config object correctly
            name: 'auth-storage', // name of the item in the storage
            storage: createJSONStorage(() => localStorage), // use localStorage
            // Persist only specific fields, not actions
            // Persist only user and isAuthenticated flag to localStorage
            partialize: (state) => ({
                user: state.user,
                // accessToken: state.accessToken, // DO NOT persist token to localStorage
                // isAuthenticated: state.isAuthenticated, // Persist auth status derived from token
            }),
        } // Close the persist config object
    ) // Close the persist middleware call
); // Close the create call