import React, { useEffect, useState } from 'react';
import { Link, useHistory } from "react-router-dom";
import { useSelector } from 'react-redux';
import { useWeb3React } from "@web3-react/core";
import axios from 'axios';
import Web3 from 'web3';
import { ethers } from "ethers";
import configData from '../../../config';


// material-ui
import { Button, Box, TextField } from '@material-ui/core';
// import { Button, Box } from '@material-ui/core';

// project imports
import MainCard from '../../../ui-component/cards/MainCard';
import CC_abi from './../../../contract-json/CultureCoin.json';



const Balance = () => {
    const userinfo = useSelector((state) => state.account);
    const user_id = userinfo.user._id;
    const { account } = useWeb3React();
    const [curccbal, setCurccbal] = useState(0);
    const [depositval, setDepositval] = useState(0);
    
    const CC_address = process.env.REACT_APP_CULTURECOINADDRESS;

    const depositCC = async() => {
        const { ethereum } = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const CCportal = new ethers.Contract(CC_address, CC_abi, signer);
            const approveflag = CCportal.allowance(CC_address, account);
            if(approveflag > 0) {
                await CCportal.approve(account, ethers.utils.parseEther(String(depositval)))
                let deposit = await CCportal.transfer(CC_address, ethers.utils.parseEther(String(depositval)));
                await deposit.wait();
                await axios.post(configData.API_SERVER + 'deposit', {
                    user_id: user_id,
                    amount: depositval
                })
                .then(function (response) {
                    if (response.status === 201) {
                        console.log("response", response)
                    }
                })
                .catch(function (error) {
                    console.log("error", error)
                });
            } else {
                alert("This token not approved, please check your wallet!")
            }
        }
    }

    return (
        <MainCard title="Balance">
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
                        value={curccbal}
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
                        value={depositval}
                        onChange={(e) => {
                            setDepositval(e.target.value);
                        }}
                    />
                </div>
            </Box>
            <Button variant="contained" onClick={() => depositCC()}>Deposit CCoin</Button>
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
                        // value={}
                        // onChange={(e) => {
                        //     setDepositval(e.target.value);
                        // }}
                    />
                </div>
            </Box>
            <Button variant="contained">Deposit by Credit Card</Button>
        </MainCard>
    );
};

export default Balance;
