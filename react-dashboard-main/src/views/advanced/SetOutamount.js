import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { ethers } from 'ethers';

// material-ui
import { Grid, Button, Box, TextField } from '@material-ui/core';
// project imports
import MainCard from '../../ui-component/cards/MainCard';
import { gridSpacing } from '../../store/constant';
import CC_abi from './../../contract-json/CultureCoin.json';

const SetOutamount = (props) => {
    const [ dexXout, setDexXout ] = useState(0);
    // const [ dexCCout, setDexCCout ] = useState(0);

    const CC_address = process.env.REACT_APP_CULTURECOINADDRESS;
    const getoutamount = async () => {
        const { ethereum } = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const CCportal = new ethers.Contract(CC_address, CC_abi, signer);
            try {
                const maxxamount = await CCportal.maxXOut();
                setDexXout(ethers.utils.formatEther(maxxamount));
            } catch (error) {
                console.log(error)
            }
        }
    }
    
    useEffect(() => {
        getoutamount();
    }, [])

    const saveXoutamount = async () => {
        const { ethereum } = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const CCportal = new ethers.Contract(CC_address, CC_abi, signer);
            try {
                await CCportal.setMaxXOut(ethers.utils.parseEther(dexXout));
                toast.success("Changed Avax Max out amount.", {
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
    
    // const saveCCoutamount = async () => {
    //     const { ethereum } = window;

    //     if (ethereum) {
    //         const provider = new ethers.providers.Web3Provider(ethereum);
    //         const signer = provider.getSigner();
    //         const CCportal = new ethers.Contract(CC_address, CC_abi, signer);
    //         try {
    //             await CCportal.setDexCCRate(ethers.utils.parseEther(dexCCout));
    //             toast.success("Changed CC rate.", {
    //                 position: "top-right",
    //                 autoClose: 3000,
    //                 closeOnClick: true,
    //                 pauseOnHover: true,
    //                 draggable: true,
    //             });
    //         } catch (error) {
    //             console.log(error)
    //             toast.error('failed save data', {
    //                 position: 'top-right',
    //                 autoClose: 3000,
    //                 closeOnClick: true,
    //                 pauseOnHover: true,
    //                 draggable: true
    //             });
    //         }
    //     }
    // }

    return (
        <MainCard title="Set Max out amount">
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} sm={12}>
                    <Box display="flex" p={1} m={1} bgcolor="background.paper">
                        <TextField
                            id="dexxout"
                            // label="Book Type Name"
                            style={{ margin: 8 }}
                            placeholder="Please input the Max out Avax amount"
                            helperText="Max out Avax amount"
                            fullWidth
                            margin="normal"
                            type='number'
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            value={dexXout}
                            onChange={(e)=> { setDexXout(e.target.value) }}
                        />
                        {/* <TextField
                            id="dexccout"
                            // label="Book Type Name"
                            style={{ margin: 8 }}
                            placeholder="Please input the Max out CC amount"
                            helperText="Max out CC amount"
                            fullWidth
                            margin="normal"
                            type='number'
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            value={dexCCout}
                            onChange={(e)=> { setDexCCout(e.target.value) }}
                        /> */}
                    </Box>
                    <Box display="flex" flexDirection="row-reverse" p={1} m={1} bgcolor="background.paper">
                        <Button variant="contained" onClick={() => saveXoutamount()}>Set Avax out amount</Button>&nbsp;
                        {/* <Button variant="contained" onClick={() => saveCCoutamount()}>Set CCoin out amount</Button> */}
                    </Box>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default SetOutamount;
