import React from 'react';
import { useSelector } from 'react-redux';

// material-ui
import { Typography } from '@material-ui/core';

// project imports
import NavGroup from './NavGroup';
import menuItem from './../../../../menu-items';
import nopermission from '../../../../menu-items/nopermission';

//-----------------------|| SIDEBAR MENU LIST ||-----------------------//

const MenuList = () => {
    const userinfo = useSelector((state) => state.account);
    const navPermission = nopermission.items.map((item) => {
        switch (item.type) {
            case 'group':
                return <NavGroup key={item.id} item={item} />;
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                );
        }
    })
    const navItems = menuItem.items.map((item) => {
        switch (item.type) {
            case 'group':
                return <NavGroup key={item.id} item={item} />;
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                );
        }
    });

    if(userinfo.is_staff) {
        return navItems;
    } else {
        return navPermission;
    }

};

export default MenuList;
