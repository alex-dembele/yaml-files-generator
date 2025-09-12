import { Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Loadable from "./components/loadable";
import AppLayout from "./layouts/app";
import CheckSalespointPage from "./pages/check-salespoint-page";
import IdentityCheckPage from "./pages/identity-check-page";
import ScanRecieptPage from "./pages/scan-reciept-page";
import TombolaCompletePage from "./pages/tombolo-complete-page";

import { authRoutes } from "@/auth/auth.route";
import { errorsRoutes } from "@/errors/errors.route";
import UpdateInfoPage from "./pages/update-info-page";
import ManualFillRecieptPage from "./pages/manual-fill-reciept-page";

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
                <Route path="/" element={<CheckSalespointPage />} />
                <Route path="/identity-check" element={<IdentityCheckPage />} />
                <Route path="/identity-check/:identityUUID" element={<UpdateInfoPage />} />
                <Route path="/identity-check/:identityUUID/:salespointUUID/scan-receipt" element={<ScanRecieptPage />} />
                <Route path="/identity-check/:identityUUID/:salespointUUID/manual-fill-reciept" element={<ManualFillRecieptPage />} />
                <Route path="/identity-check/:identityUUID/:salespointUUID/tombola-complete" element={<TombolaCompletePage />} />
            </Route>
            {routes.map(route => {
                return <Route path={route.path} element={route.component} key={route.name} />
            })}
        </Routes>
    );
}
