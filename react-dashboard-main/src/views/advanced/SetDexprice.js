import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { ethers } from 'ethers';

// material-ui
import { Grid, Button, Box, TextField } from '@material-ui/core';
// project imports
import MainCard from '../../ui-component/cards/MainCard';
import { gridSpacing } from '../../store/constant';
import configData from '../../config';
import CC_abi from './../../contract-json/CultureCoin.json';

//==============================|| AI Price ||==============================//

const SetDexprice = (props) => {
    const [ dexPrice, setDexPrice ] = useState('');

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
            } catch (error) {
                console.log(error)
            }
        }
    }
    
    useEffect(() => {
        getCCprice();
    }, [])

    const saveDexPrice = async () => {
        const { ethereum } = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const CCportal = new ethers.Contract(CC_address, CC_abi, signer);
            try {
                await CCportal.setDexCCRate(ethers.utils.parseEther(dexPrice));
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
    }

    return (
        <MainCard title="Set OpenAI Price">
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
                            value={dexPrice}
                            onChange={(e)=> { setDexPrice(e.target.value) }}
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
