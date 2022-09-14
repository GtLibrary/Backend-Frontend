import React, { useEffect, useState } from 'react';
import { HiOutlineExternalLink } from 'react-icons/hi'
import { Button, Flex } from "./CommonComponents";
import './walletconnect.styles.scss';
import { useMoralis } from "react-moralis";


const WalletConnect = () => {

    const {  authenticate, isAuthenticated, isAuthenticating, user, account, logout  } = useMoralis();
    const [walletAddress, setWalletAddress] = useState("");

    useEffect(() => {
        if(isAuthenticated) {
            setWalletAddress(user.get("ethAddress"))
        }
    }, [walletAddress, isAuthenticated]);

    const handleLogin = async () => {
        if (!isAuthenticated) {
  
          await authenticate()
            .then(function (user) {
                localStorage.setItem("accountStatus", "1");
            })
            .catch(function (error) {
              console.log(error);
            });
        }
    }

    const handleLogout = async () => {
        await logout();
        localStorage.removeItem("accountStatus")
    }

    function copyToClipBoard() {
        var x = document.getElementById("snackbar");
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }

    return (
        <div className='cart-container'>
        {!isAuthenticated ? (
            <Button className="animateButton" onClick={handleLogin}>Connect Wallet</Button>
        ) : (
            <Flex>
                <Button className="animateButton mr-10" onClick={() => {
                    navigator.clipboard.writeText(walletAddress)
                    copyToClipBoard()
                }}>{walletAddress.slice(0, 5)}...{walletAddress.slice(-5)}</Button>
                <Button className="animateButton" onClick={handleLogout}><HiOutlineExternalLink fontSize={21} /></Button>
                <span id="snackbar">Copied</span>
            </Flex>
        )}
        </div>
    );


}

export default WalletConnect;