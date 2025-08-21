import React from 'react';
import { Brand } from '@/components/brand'; // Assuming brand component handles logo and name
import { ProfileDropdown } from '@/components/profile-dropdown'; // Assuming this handles the admin dropdown
import { Button } from '@/components/ui/button'; // Using the shadcn/ui button
import { LogOut } from 'lucide-react'; // Icon for logout
import { useAuthStore } from '@/auth/auth.store';
import { useQueryClient } from '@tanstack/react-query';
import ToggleLanguage from '@/translations/components/ToggleLanguage';
import { useTranslation } from 'react-i18next';

export const AppHeader: React.FC = () => {
    const { t } = useTranslation();
    const { reset } = useAuthStore();
    const queryClient = useQueryClient();
    // Placeholder for logout logic
    const handleLogout = () => {
        console.log('Logout clicked');
        queryClient.clear();

        reset();
        // Add actual logout logic here (e.g., clear token, redirect)
    };

    return (
        <header className="bg-slate-50 shadow-md">
            <div className=" mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                {/* Logo and Brand Name */}
                <Brand />

                {/* Right side controls */}
                <div className="flex items-center space-x-4">
                    <ToggleLanguage />
                    {/* Admin Profile Dropdown */}
                    <ProfileDropdown />

                    {/* Logout Button */}
                    <Button
                        variant="ghost" // Use ghost or a suitable variant for header buttons
                        size="sm"
                        onClick={handleLogout}
                        className="hover:bg-primary/90 hover:text-primary-foreground" // Adjust hover styles if needed
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        {t('layout.app.components.header.logout')}
                    </Button>
                </div>
            </div>
        </header>
    );
};
