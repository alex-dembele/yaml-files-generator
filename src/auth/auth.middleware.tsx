import { FC, PropsWithChildren } from "react";
import { useAuthStore } from "./auth.store";
import { Navigate, useLocation } from "react-router-dom"; // Import useLocation
import env from "@/env";

type AuthMiddlewareProps = {

} & PropsWithChildren;

const AuthMiddleware: FC<AuthMiddlewareProps> = ({ children }) => {
    const location = useLocation(); // Get current location
    console.log("Auth Middleware: Checking auth for", location.pathname + location.search);
    const { accessToken } = useAuthStore();

    if (!accessToken) {
        console.log("No access token detected, redirecting to sign-in.");
        // Construct the redirect path including the original location
        const redirectPath = `/sign-in?redirect=${encodeURIComponent(env.APP_BASE_URL + location.pathname + location.search)}`;
        return <Navigate to={redirectPath} replace />;
    }
    return children;
}

export default AuthMiddleware
