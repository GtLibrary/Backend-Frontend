import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { ethers } from 'ethers';

// material-ui
import { Grid, Button, Box, TextField } from '@material-ui/core';
// project imports
import MainCard from '../../ui-component/cards/MainCard';
import { gridSpacing } from '../../store/constant';
import CC_abi from './../../contract-json/CultureCoin.json';

const SetDexprice = (props) => {
    const [ dexPrice, setDexPrice ] = useState(0);
    const [ dexAvaxPrice, setDexAvaxPrice ] = useState(0);
    const [ ccrate, setCcrate ] = useState(0);
    const [ axrate, setAxrate ] = useState(0);

    const CC_address = process.env.REACT_APP_CULTURECOINADDRESS;
    const getCCprice = async () => {
        const { ethereum } = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const CCportal = new ethers.Contract(CC_address, CC_abi, signer);
            try {
                const cc_price = await CCportal.getDexCCRate();
                setDexPrice(ethers.utils.formatEther(cc_price));
                const x_price = await CCportal.getDexXMTSPRate();
                setDexAvaxPrice(ethers.utils.formatEther(x_price));
            } catch (error) {
                console.log(error)
            }
        }
    }
    
    useEffect(() => {
        getCCprice();
    }, [])

    const calculateCCRate = (_ccrate) => {
        setCcrate(_ccrate)
        setAxrate(0)
        let ccprice = (Number(_ccrate * 0.99))
        setDexPrice(ccprice)
        let xprice = (Number(1 / _ccrate).toFixed(4))
        setDexAvaxPrice(xprice)
    }

    const calculateXRate = (xrate) => {
        setAxrate(xrate)
        setCcrate(0)
        let xprice = String(Number(xrate * 0.99))
        setDexAvaxPrice(xprice)
        let ccprice = (Number(1/xrate).toFixed(4))
        setDexPrice(ccprice)
    }

    const saveDexPrice = async () => {
        const { ethereum } = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const CCportal = new ethers.Contract(CC_address, CC_abi, signer);
            try {
                await CCportal.setDexCCRate(ethers.utils.parseEther(dexPrice));
                await CCportal.setDexXMTSPRate(ethers.utils.parseEther(dexAvaxPrice));
                toast.success("Changed Dex rate.", {
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
    }

    return (
        <MainCard title="Set Dex Price">
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} sm={12}>
                    <Box display="flex" p={1} m={1} bgcolor="background.paper">
                        <TextField
                            id="dexprice"
                            // label="Book Type Name"
                            style={{ margin: 8 }}
                            placeholder="Please input the Dex Price"
                            helperText="Dex Price"
                            fullWidth
                            margin="normal"
                            type='number'
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            value={ccrate}
                            onChange={(e)=> { calculateCCRate(e.target.value) }}
                        />
                        <TextField
                            id="dexavaxprice"
                            // label="Book Type Name"
                            style={{ margin: 8 }}
                            placeholder="Please input the Dex Avax Rate"
                            helperText="Dex Avax Price"
                            fullWidth
                            margin="normal"
                            type='number'
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            value={axrate}
                            onChange={(e)=> { calculateXRate(e.target.value) }}
                        />
                    </Box>
                    <Box display="flex" p={1} m={1} bgcolor="background.paper">
                        <TextField
                            id="dexprice"
                            // label="Book Type Name"
                            style={{ margin: 8 }}
                            placeholder="Please input the Dex Price"
                            helperText="Estimated Dex Price"
                            fullWidth
                            margin="normal"
                            type='number'
                            disabled={true}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            value={dexPrice}
                            // onChange={(e)=> { calculateCCRate(e.target.value) }}
                        />
                        <TextField
                            id="dexavaxprice"
                            // label="Book Type Name"
                            style={{ margin: 8 }}
                            placeholder="Please input the Dex Avax Rate"
                            helperText="Estimated Dex Avax Price"
                            fullWidth
                            margin="normal"
                            type='number'
                            disabled={true}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            value={dexAvaxPrice}
                            // onChange={(e)=> { calculateXRate(e.target.value) }}
                        />
                    </Box>
                    <Box display="flex" flexDirection="row-reverse" p={1} m={1} bgcolor="background.paper">
                        <Button variant="contained" onClick={() => saveDexPrice()}>Save</Button>
                    </Box>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default SetDexprice;
