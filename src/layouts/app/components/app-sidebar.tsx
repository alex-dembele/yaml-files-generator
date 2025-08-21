import React from 'react';
import { NavLink } from 'react-router-dom';
// import { LayoutDashboard, TicketIcon } from 'lucide-react'; // Import icons
import { cn } from '@/lib/utils'; // Utility for conditional classes

// Define the structure for navigation items
interface NavItem {
    path: string;
    label: string;
    icon: React.ElementType;
}

// import { app_urls } from '@/routes'; // Import app URLs
import { useTranslation } from 'react-i18next';
export default function AppSidebar() {
    const { t } = useTranslation();
    // const translate = (key: string) => {
    //     return t(`${key}`);
    // };


    const navItems: NavItem[] = [
        // { path: app_urls.get_dashboard_url, label: translate('module.dashboard.title'), icon: LayoutDashboard },
        // { path: app_urls.get_employee_url, label: translate('module.employee.title'), icon: TicketIcon },
        // { path: app_urls.get_tasks_url, label: translate('module.task.title'), icon: TicketIcon },
        // { path: app_urls.get_objectives_url, label: translate('module.objective.title'), icon: TicketIcon },
        // { path: app_urls.get_evaluation_url, label: translate('module.evaluation.title'), icon: TicketIcon },
        // { path: app_urls.get_attendance_url, label: translate('module.attendance.title'), icon: TicketIcon },

    ];
    return (
        <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col border-r border-border">
            <nav className="flex-1 p-4 space-y-2">
                <ul>
                    {navItems.map((item) => (
                        <li key={item.path} className='my-2 '>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    cn(
                                        'flex items-center px-3 py-2 rounded-md text-xs  font-medium transition-colors',
                                        isActive
                                            ? 'bg-sidebar-active text-sidebar-active-foreground font-semibold'
                                            : 'hover:bg-sidebar-active'
                                    )
                                }
                            >
                                <item.icon className="mr-3 h-5 w-5" />
                                {t(item.label)}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}
