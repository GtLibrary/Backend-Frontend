import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from "react-toastify";
import configData from '../../config';

// material-ui
import { Button, Box, TextField } from '@material-ui/core';
// import { Button, Box } from '@material-ui/core';

// project imports
import MainCard from '../../ui-component/cards/MainCard';

const ProfileSetting = () => {
    const accountinfo = useSelector((state) => state.account);

    const getcurBalance = async () => {
        await axios
            .get(
                configData.API_SERVER + 'wallet_info',
                { headers: { Authorization: `${accountinfo.token}` } }
            )
            .then((response) => {
                
            });
    };
    useEffect(() => {
        // getcurBalance();
    }, []);

    const depositCC = async () => {

    };

    return (
        <MainCard title="Profile">
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '50ch' }
                }}
                noValidate
                autoComplete="off"
            >
                <div>
                    <TextField
                        id="cur_cc_balance"
                        // label="Book  Name"
                        style={{ margin: 8 }}
                        placeholder="Current CCoin Balance"
                        helperText="Current CCoin balance"
                        fullWidth
                        disabled
                        type="number"
                        // margin="normal"
                        InputLabelProps={{
                            shrink: true
                        }}
                        variant="filled"
                        // value={curccbal}
                    />

                    <TextField
                        id="deposit_val"
                        // label="Book  Name"
                        style={{ margin: 8 }}
                        placeholder="Please input the deposit CCoin amount"
                        helperText="Deposit amount"
                        fullWidth
                        type="number"
                        // margin="normal"
                        InputLabelProps={{
                            shrink: true
                        }}
                        variant="filled"
                        // value={depositval}
                        onChange={(e) => {
                            
                        }}
                    />
                </div>
            </Box>
            <Button variant="contained" onClick={() => depositCC()}>
                Deposit CCoin
            </Button>
        </MainCard>
    );
};

export default ProfileSetting;
