import React from 'react';
import { useSelector } from 'react-redux';

// material-ui
import { Typography } from '@material-ui/core';

// project imports
import NavGroup from './NavGroup';
import menuItem from './../../../../menu-items';
import nopermission from '../../../../menu-items/nopermission';
import authormenuItems from '../../../../menu-items/authorpermission';

//-----------------------|| SIDEBAR MENU LIST ||-----------------------//

const MenuList = () => {
    const userinfo = useSelector((state) => state.account);
    const nopermnavItems = nopermission.items.map((item) => {
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

    
    const authornavItems = authormenuItems.items.map((item) => {
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

    if(userinfo.is_superuser) {
        return authornavItems;
    } else if(userinfo.is_staff) {
        return navItems;
    } else {
        return nopermnavItems;
    }

};

export default MenuList;
