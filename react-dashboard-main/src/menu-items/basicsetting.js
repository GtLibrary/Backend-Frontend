// assets
import { IconSettings } from '@tabler/icons';

// constant
const icons = {
    IconSettings: IconSettings,
};

//-----------------------|| UTILITIES MENU ITEMS ||-----------------------//

export const basicsetting = {
    id: 'basic',
    title: 'Basic Setting',
    type: 'group',
    children: [
        {
            id: 'basic-booktype',
            title: 'Book Type',
            type: 'item',
            url: '/basic/basic-booktype',
            icon: icons['IconSettings'],
            breadcrumbs: false
        },
    ]
};
