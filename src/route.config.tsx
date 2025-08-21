
import { Navigate } from "react-router-dom";
import { authRoutes } from "@/auth/auth.route";
import { errorsRoutes } from "@/errors/errors.route";

export const routes = [
    {
        name: "undefinedRoutes",
        path: "*",
        component: <Navigate to="/404" replace />,
        isProtected: false,
    },
    ...errorsRoutes,
    ...authRoutes,
];


export default routes;