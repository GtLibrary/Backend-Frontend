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
        },
        {
            id: 'deposite',
            title: 'Balance',
            type: 'item',
            url: '/dashboard/balance',
            icon: icons['IconDeviceAnalytics'],
            breadcrumbs: false
        },
        {
            id: 'getapikey',
            title: 'Benji-Key',
            type: 'item',
            url: '/dashboard/getapikey',
            icon: icons['IconDeviceAnalytics'],
            breadcrumbs: false
        }
    ]
};
