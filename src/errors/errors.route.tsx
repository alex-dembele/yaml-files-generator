import ForbiddenError from "./pages/forbidden";
import GeneralError from "./pages/general-error";
import MaintenanceError from "./pages/maintenance-error";
import NotFoundError from "./pages/not-found-error";
import UnauthorisedError from "./pages/unauthorized-error";

export const errorsRoutes = [
    {
        path: '/401',
        name: 'unauthorized_access',
        component: <UnauthorisedError />,
        isProtected: false,
    },
    {
        path: '/403',
        name: 'forbidden_access',
        component: <ForbiddenError />,
        isProtected: false,
    },
    {
        path: '/404',
        name: 'not_found_error',
        component: <NotFoundError />,
        isProtected: false,
    },
    {
        path: '/500',
        name: 'server_error',
        component: <GeneralError />,
        isProtected: false,
    },
    {
        path: '/503',
        name: 'maintenance_error',
        component: <MaintenanceError />,
        isProtected: false,
    },
];