// import { PropsWithChildren } from 'react'; // Import PropsWithChildren

// import { AppHeader } from './components/header';
// import { Footer } from './components/footer';
import { Outlet } from "react-router-dom";
import { AppHeader } from './components/header';
// import AppSidebar from './components/app-sidebar';

// Use PropsWithChildren directly if no other props are needed
export default function AppLayout() {


    return (
        <div className="flex min-h-screen bg-white mx-auto max-w-md flex-col">
            <AppHeader />
            {/* Main Content Area */}
            <div className="flex flex-1 flex-grow h-full  flex-col overflow-hidden w-full">
                <Outlet />

            </div>

            {/* <Footer /> */}
        </div>
    );
}
