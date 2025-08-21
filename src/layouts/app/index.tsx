// import { PropsWithChildren } from 'react'; // Import PropsWithChildren

// import { AppHeader } from './components/header';
import { Footer } from './components/footer';
import { Outlet } from "react-router-dom";
// import AppSidebar from './components/app-sidebar';

// Use PropsWithChildren directly if no other props are needed
export default function AppLayout() {


    return (
        <div className="flex min-h-screen w-full flex-col">
            {/* Header - sticky */}
            <div className="sticky top-0 z-50">
                {/* <AppHeader /> */}
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 flex-grow flex-col overflow-hidden w-full">
                {/* Sidebar */}
                {/* <AppSidebar /> */}

                {/* Page Content */}
                <div className="flex flex-grow w-full flex-col overflow-auto">
                    <Outlet />
                </div>
            </div>

            <Footer />
        </div>
    );
}
