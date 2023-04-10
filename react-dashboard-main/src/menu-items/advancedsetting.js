// assets
import { IconSettings } from '@tabler/icons';

// constant
const icons = {
    IconSettings: IconSettings,
};

//-----------------------|| UTILITIES MENU ITEMS ||-----------------------//

export const advancedsetting = {
    id: 'advanced',
    title: 'Advanced Setting',
    type: 'group',
    children: [
        {
            id: 'advanced-setaddon',
            title: 'Set Addon',
            type: 'item',
            url: '/advanced/setaddon',
            icon: icons['IconSettings'],
            breadcrumbs: false
        },
        {
            id: 'advanced-setdexprice',
            title: 'Set Dex Price',
            type: 'item',
            url: '/advanced/setdexprice',
            icon: icons['IconSettings'],
            breadcrumbs: false
        },
    ]
};
