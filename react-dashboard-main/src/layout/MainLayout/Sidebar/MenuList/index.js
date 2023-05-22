import React from 'react';
import { useSelector } from 'react-redux';
import { useWeb3React } from '@web3-react/core';

// material-ui
import { Typography } from '@material-ui/core';

// project imports
import NavGroup from './NavGroup';
import menuItem from './../../../../menu-items';
import nopermission from '../../../../menu-items/nopermission';
import authormenuItems from '../../../../menu-items/authorpermission';
import ccamenuItems from '../../../../menu-items/ccapermission';

//-----------------------|| SIDEBAR MENU LIST ||-----------------------//

const MenuList = () => {
    const userinfo = useSelector((state) => state.account);
    const { account } = useWeb3React();
    const cca_address = process.env.REACT_APP_CCA
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

    const ccanavItems = ccamenuItems.items.map((item) => {
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
        if (String(account) === String(cca_address)) {
            return [navItems, ccanavItems];
        } else {
            return navItems;
        }
    } else if((userinfo.is_staff === true) && (userinfo.is_superuser === false)) {
        if (String(account) === String(cca_address)) {
            return [authornavItems, ccanavItems];
        } else {
            return authornavItems;
        }
    } else {
        return nopermnavItems;
    }

};

export default MenuList;
