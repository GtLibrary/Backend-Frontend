// assets
import { IconSettings } from '@tabler/icons';

// constant
const icons = {
    IconSettings: IconSettings,
};

//-----------------------|| UTILITIES MENU ITEMS ||-----------------------//

export const ccasetting = {
    id: 'advanced',
    title: 'CCoin Admin Setting',
    type: 'group',
    children: [
        {
            id: 'advanced-setdexprice',
            title: 'Set Dex Price',
            type: 'item',
            url: '/advanced/setdexprice',
            icon: icons['IconSettings'],
            breadcrumbs: false
        },
        {
            id: 'advanced-setxout',
            title: 'Set Max out',
            type: 'item',
            url: '/advanced/setoutamount',
            icon: icons['IconSettings'],
            breadcrumbs: false
        },
        {
            id: 'advanced-setreward',
            title: 'Set Reward per hour',
            type: 'item',
            url: '/advanced/setreward',
            icon: icons['IconSettings'],
            breadcrumbs: false
        },
        {
            id: 'advanced-addonrevocate',
            title: 'Addon Revocation',
            type: 'item',
            url: '/advanced/addonrevocation',
            icon: icons['IconSettings'],
            breadcrumbs: false
        },
    ]
};
