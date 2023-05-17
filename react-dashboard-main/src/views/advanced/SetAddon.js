import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { toast } from "react-toastify";
import LoadingOverlay from 'react-loading-overlay';

// material-ui
import { Grid, Button, Box } from '@material-ui/core';
// project imports
import MainCard from '../../ui-component/cards/MainCard';
import { gridSpacing } from '../../store/constant';
import CC_abi from './../../contract-json/CultureCoin.json';

LoadingOverlay.propTypes = undefined;

const SetAddon = (props) => {
    const CC_address = process.env.REACT_APP_CULTURECOINADDRESS;
    const Printpress_address = process.env.REACT_APP_PRINTINGPRESSADDRESS;
    const Minimart_address = process.env.REACT_APP_MINIMARTADDRESS;

    const [loading, setLoading] = useState(false);
    const [isaddonPrintpress, setIsaddonPrintpress] = useState(false);
    const [isaddonMinimart, setIsaddonMinimart] = useState(false);

    const getAddon = async () => {
        const { ethereum } = window;
        setLoading(true)

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const CCportal = new ethers.Contract(CC_address, CC_abi, signer);
            try {
                const print_isaddon = await CCportal.getAddon(Printpress_address);
                setIsaddonPrintpress(print_isaddon);
                const minimart_isaddon = await CCportal.getAddon(Minimart_address);
                setIsaddonMinimart(minimart_isaddon);
            } catch (error) {
                console.log(error)
            }
        }
        setLoading(false)
    }
    
    useEffect(() => {
        getAddon();
    }, [])

    const setAddonPrintpress = async () => {
        const { ethereum } = window;
        setLoading(true)

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const CCportal = new ethers.Contract(CC_address, CC_abi, signer);
            try {
                await CCportal.setAddon(Printpress_address, true);
                toast.success("Changed CC rate.", {
                    position: "top-right",
                    autoClose: 3000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } catch (error) {
                console.log(error)
                toast.error('failed save data', {
                    position: 'top-right',
                    autoClose: 3000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
            }
        }
        setLoading(false)
    }

    const setAddonMinimart = async () => {
        const { ethereum } = window;

        setLoading(true)
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const CCportal = new ethers.Contract(CC_address, CC_abi, signer);
            try {
                await CCportal.setAddon(Minimart_address, true);
            } catch (error) {
                console.log(error)
            }
        }
        setLoading(false)
    }

    return (
        <>
            {loading && (
                <div
                    style={{
                        background: '#00000055',
                        width: '100%',
                        height: '100%',
                        zIndex: '1000',
                        position: 'fixed',
                        top: 0,
                        left: 0
                    }}
                >
                    <LoadingOverlay
                        active={true}
                        spinner={true}
                        text="Loading ..."
                        styles={{
                            overlay: (base) => ({
                                ...base,
                                background: 'rgba(255, 255, 255)',
                                position: 'absolute',
                                marginTop: '300px',
                                zIndex: '1111'
                            })
                        }}
                        fadeSpeed={9000}
                    ></LoadingOverlay>
                </div>
            )}
            <MainCard title="Set Addon">
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} sm={12}>
                        <Box display="flex" p={1} m={1} bgcolor="background.paper">
                            <Button variant="contained" disabled={isaddonPrintpress} onClick={() => setAddonPrintpress()}>Set Addon Printing Press</Button>
                        </Box>
                        <Box display="flex" p={1} m={1} bgcolor="background.paper">
                            <Button variant="contained" disabled={isaddonMinimart} onClick={() => setAddonMinimart()}>Set Addon Minimart</Button>
                        </Box>
                    </Grid>
                </Grid>
            </MainCard>
        </>
    );
};

export default SetAddon;
