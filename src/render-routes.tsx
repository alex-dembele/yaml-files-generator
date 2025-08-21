import { Route, Routes } from "react-router-dom";
import Loadable from "./components/loadable";
import AuthMiddleware from "./auth/auth.middleware";
import AppLayout from "./layouts/app";
import routes from "@/route.config.tsx";

import ClientsPage from "./routes/clients-page";
import HomePage from "./routes/home-page";

export default function RenderRoutes() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Loadable isPage component={
                        <AuthMiddleware>
                            <AppLayout />
                        </AuthMiddleware>
                    } />
                }
            >
                <Route index element={<HomePage />} />
                <Route path="/clients" element={<ClientsPage />} />

            </Route>

            {routes.map(route => {
                return <Route path={route.path} element={route.component} key={route.name} />
            })}
        </Routes>
    );
}
