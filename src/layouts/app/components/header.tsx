import React from 'react';
// import { Brand } from '@/components/brand'; // Assuming brand component handles logo and name
import ToggleLanguage from '@/translations/components/ToggleLanguage';

export const AppHeader: React.FC = () => {
    return (
        <header className="bg-white shadow-md">
            <div className=" mx-auto flex h-16 items-center justify-end px-4 md:px-6">
                {/* Logo and Brand Name */}
                {/* <Brand /> */}

                {/* Right side controls */}
                <div className="flex items-center space-x-4">
                    <ToggleLanguage />
                </div>
            </div>
        </header>
    );
};
