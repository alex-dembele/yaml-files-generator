import { Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Loadable from "./components/loadable";
import AppLayout from "./layouts/app";

import { authRoutes } from "@/auth/auth.route";
import { errorsRoutes } from "@/errors/errors.route";
import HomePage from "./pages/home";

const routes = [
    {
        name: "undefinedRoutes",
        path: "*",
        component: <Navigate to="/404" replace />,
        isProtected: false,
    },
    ...errorsRoutes,
    ...authRoutes,
];

export default function RenderRoutes() {
    return (
        <Routes>
            <Route
                path="/" element={<Loadable isPage component={<AppLayout />} />} >
                <Route path="/" element={<HomePage />} />

            </Route>
            {routes.map(route => {
                return <Route path={route.path} element={route.component} key={route.name} />
            })}
        </Routes>
    );
}
