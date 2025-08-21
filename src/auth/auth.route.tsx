import OAuthCallBack from "@/auth/pages/oauth/callback";
import RefreshAuth from "@/auth/pages/refresh";
import SignIn from "@/auth/pages/sign-in";

export const authRoutes = [
    {
        path: '/sign-in',
        name: 'signin',
        component: <SignIn />,
        isProtected: false,
    },
    {
        path: '/refresh',
        name: 'refresh',
        component: <RefreshAuth />,
        isProtected: false,
    },
    {
        path: '/oauth/callback',
        name: 'signin',
        component: <OAuthCallBack />,
        isProtected: false,
    },
];