// assets
import { IconDashboard, IconDeviceAnalytics, IconBook } from '@tabler/icons';

// constant
const icons = {
    IconDashboard: IconDashboard,
    IconDeviceAnalytics,
    IconBook
};

//-----------------------|| DASHBOARD MENU ITEMS ||-----------------------//
const nopermission = {
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
    ]
};

const nopermissionItems = {
    items: [nopermission]
    ////, utilities, other
};

export default nopermissionItems;
