// assets
import { IconSettings } from '@tabler/icons';

// constant
const icons = {
    IconSettings: IconSettings,
};

//-----------------------|| UTILITIES MENU ITEMS ||-----------------------//

export const profilesetting = {
    id: 'profile',
    title: 'Profile Setting',
    type: 'group',
    children: [
        {
            id: 'profile-setting',
            title: 'Profile',
            type: 'item',
            url: '/profile/setting',
            icon: icons['IconSettings'],
            breadcrumbs: false
        },
        {
            id: 'profile-password',
            title: 'Change Password',
            type: 'item',
            url: '/profile/changepassword',
            icon: icons['IconSettings'],
            breadcrumbs: false
        },
    ]
};
