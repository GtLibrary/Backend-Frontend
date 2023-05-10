import React from 'react';

// material-ui
import { useTheme } from '@material-ui/styles';
import logo from './../assets/images/books.png';
/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * 
 * import logo from './../../assets/images/logo.svg';
 *
 */

//-----------------------|| LOGO SVG ||-----------------------//

const Logo = () => {
    const theme = useTheme();

    return (
        /**
         * if you want to use image instead of svg uncomment following, and comment out <svg> element.
         *
         * <img src={logo} alt="Berry" width="100" />
         *
         */
        <>
            <img src={logo} alt="logo" width={80}/>
        </>
    );
};

export default Logo;
