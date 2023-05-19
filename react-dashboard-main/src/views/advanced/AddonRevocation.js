import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay';

// material-ui
import { Grid, Button, Box, TextField, Divider, InputLabel } from '@material-ui/core';
// project imports
import MainCard from '../../ui-component/cards/MainCard';
import { gridSpacing } from '../../store/constant';
import CC_abi from './../../contract-json/CultureCoin.json';
import Booktradable_abi from './../../contract-json/BookTradable.json';

LoadingOverlay.propTypes = undefined;

const AddonRevocation = (props) => {
    const CC_address = process.env.REACT_APP_CULTURECOINADDRESS;
    const Printpress_address = process.env.REACT_APP_PRINTINGPRESSADDRESS;
    const Minimart_address = process.env.REACT_APP_MINIMARTADDRESS;

    const [loading, setLoading] = useState(false);
    const [oldaddon, setOldaddon] = useState('');
    const [bookaddress, setBookaddress] = useState('');
    const [bookaddonaddress, setBookaddonaddress] = useState('');

    const revokeCC = async () => {
        const { ethereum } = window;
        if (oldaddon === '') {
            toast.error('Please input old address.', {
                position: 'top-right',
                autoClose: 3000,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        }
        setLoading(true);

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const CCportal = new ethers.Contract(CC_address, CC_abi, signer);
            try {
                await CCportal.setAddon(oldaddon, false);
                setLoading(false);
                toast.success('Successfuly revoked.', {
                    position: 'top-right',
                    autoClose: 3000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
            } catch (error) {
                setLoading(false);
                toast.error('revoke failed', {
                    position: 'top-right',
                    autoClose: 3000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
            }
        }
    }

    const revokeBookAddon = async () => {
        const { ethereum } = window;
        if (bookaddress === '' || bookaddonaddress === '') {
            toast.error('Please input Book address and Addon address.', {
                position: 'top-right',
                autoClose: 3000,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        }
        setLoading(true);

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const BookTradable = new ethers.Contract(bookaddress, Booktradable_abi, signer);
            try {
                await BookTradable.setAddon(bookaddonaddress, false);
                setLoading(false);
                toast.success('Successfuly revoked.', {
                    position: 'top-right',
                    autoClose: 3000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
            } catch (error) {
                setLoading(false);
                toast.error('revoke failed', {
                    position: 'top-right',
                    autoClose: 3000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
            }
        }

    }

    const revokeMinimartAddon = async () => {
        const { ethereum } = window;

        setLoading(true);
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const CCportal = new ethers.Contract(CC_address, CC_abi, signer);
            try {
                await CCportal.setAddon(Minimart_address, false);
                setLoading(false);
                toast.success('Successfuly revoked', {
                    position: 'top-right',
                    autoClose: 3000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
            } catch (error) {
                setLoading(false);
                toast.error('revoke failed', {
                    position: 'top-right',
                    autoClose: 3000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
            }
        }
        setLoading(false);

    }

    const revokePirntpressAddon = async () => {
        const { ethereum } = window;
        setLoading(true);

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const CCportal = new ethers.Contract(CC_address, CC_abi, signer);
            try {
                await CCportal.setAddon(Printpress_address, false);
                setLoading(false);
                toast.success('Successfuly revoked', {
                    position: 'top-right',
                    autoClose: 3000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
            } catch (error) {
                setLoading(false);
                toast.error('revoke failed', {
                    position: 'top-right',
                    autoClose: 3000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
            }
        }
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
            <MainCard title="Addon Revocation">
                <Divider>Revoke CC Addon Wizard</Divider>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={6} sm={6}>
                        <TextField
                            id="input-ccaddress"
                            className="input-ccaddress"
                            InputLabelProps={{
                                shrink: true
                            }}
                            style={{ margin: 8 }}
                            variant="filled"
                            placeholder="Input old addon address"
                            helperText="Input old addon address"
                            fullWidth
                            type="text"
                            value={oldaddon}
                            onChange={(e) => {
                                setOldaddon(e.target.value);
                            }}
                        />
                    </Grid>
                    <Grid item xs={6} sm={6}>
                        <Button variant="contained" style={{ margin: 8 }} onClick={() => revokeCC()}>
                            Revoke CC Addon
                        </Button>
                    </Grid>
                </Grid>
                <Divider>Revoke Book Addon Wizard</Divider>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={4} sm={4}>
                        <TextField
                            id="input-paddress"
                            className="input-paddress"
                            InputLabelProps={{
                                shrink: true
                            }}
                            style={{ margin: 8 }}
                            variant="filled"
                            placeholder="Input Book address"
                            helperText="Input Book address"
                            fullWidth
                            type="text"
                            value={bookaddress}
                            onChange={(e) => {
                                setBookaddress(e.target.value);
                            }}
                        />
                    </Grid>
                    <Grid item xs={4} sm={4}>
                        <TextField
                            id="input-caddress"
                            className="input-caddress"
                            InputLabelProps={{
                                shrink: true
                            }}
                            style={{ margin: 8 }}
                            variant="filled"
                            placeholder="Input Addon address"
                            helperText="Input Addon address"
                            fullWidth
                            type="text"
                            value={bookaddonaddress}
                            onChange={(e) => {
                                setBookaddonaddress(e.target.value);
                            }}
                        />
                    </Grid>
                    <Grid item xs={4} sm={4}>
                        <Button variant="contained" style={{ margin: 8 }} onClick={() => revokeBookAddon()}>
                            Revoke Book Addon
                        </Button>
                    </Grid>
                </Grid>
                <Divider>Revoke Minimart Addon Wizard</Divider>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={6} sm={6}>
                        <Button variant="contained" style={{ margin: 8 }} onClick={() => revokeMinimartAddon()}>
                            Set Addon Minimart
                        </Button>
                    </Grid>
                </Grid>
                <Divider>Revoke PrintPress Addon Wizard</Divider>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={6} sm={6}>
                        <Button variant="contained" style={{ margin: 8 }} onClick={() => revokePirntpressAddon()}>
                            Set Addon Printing Press
                        </Button>
                    </Grid>
                </Grid>
            </MainCard>
        </>
    );
};

export default AddonRevocation;
