// assets
import { IconDashboard, IconDeviceAnalytics, IconBook } from '@tabler/icons';

// constant
const icons = {
    IconDashboard: IconDashboard,
    IconDeviceAnalytics,
    IconBook
};

//-----------------------|| DASHBOARD MENU ITEMS ||-----------------------//

export const dashboard = {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    children: [
        {
            id: 'default',
            title: 'Dashboard',
            type: 'item',
            url: '/dashboard/default',
            icon: icons['IconDashboard'],
            breadcrumbs: false
        },
        {
            id: 'booklist',
            title: 'Books',
            type: 'item',
            url: '/dashboard/booklist',
            icon: icons['IconBook'],
            breadcrumbs: false
        }
    ]
};
