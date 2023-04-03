import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import { ethers } from 'ethers';
import { toast } from "react-toastify";
import configData from '../../../config';

// material-ui
import { Button, Box, TextField } from '@material-ui/core';
// import { Button, Box } from '@material-ui/core';

// project imports
import MainCard from '../../../ui-component/cards/MainCard';
import CC_abi from './../../../contract-json/CultureCoin.json';
import Printpress_abi from './../../../contract-json/PrintingPress.json';

const Balance = () => {
    const accountinfo = useSelector((state) => state.account);
    const { account } = useWeb3React();
    const [curccbal, setCurccbal] = useState(0.0);
    const [depositval, setDepositval] = useState(0);
    const [currppccbal, setCurrppccbal] = useState(0);
    const [depositppval, setDepositppval] = useState(0);

    const CC_address = process.env.REACT_APP_CULTURECOINADDRESS;
    const Printpress_address = process.env.REACT_APP_PRINTINGPRESSADDRESS;

    const getcurBalance = async () => {
        await axios
            .get(
                configData.API_SERVER + 'wallet_info',
                { headers: { Authorization: `${accountinfo.token}` } }
            )
            .then((response) => {
                setCurccbal(response.data.balance);
            });
    };
    const getPPbalance = async () => {
        
        const { ethereum } = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const Printpressportal = new ethers.Contract(Printpress_address, Printpress_abi, signer);
            
            try {
                let getdeposit = await Printpressportal.getBalance(account);
                setCurrppccbal(ethers.utils.formatEther(getdeposit))
            } catch (error) {
                console.log(error)
            }
        }
    }
    useEffect(() => {
        getcurBalance();
        getPPbalance();
    }, []);

    const depositCC = async () => {
        const { ethereum } = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const CCportal = new ethers.Contract(CC_address, CC_abi, signer);
            // console.log(approveflag.toNumber())
            try {
                await CCportal.approve(account, ethers.utils.parseEther(String(depositval)));
                // const approveflag = await CCportal.allowance(CC_address, account);
                // console.log(approveflag.toNumber())
                // if(approveflag.toNumber() > 0) {
                    let deposit = await CCportal.transfer(CC_address, ethers.utils.parseEther(String(depositval)));
                    await deposit.wait();
                    await axios
                        .post(configData.API_SERVER + 'deposit', {
                            amount: depositval
                        },
                        { headers: { Authorization: `${accountinfo.token}` } }
                        )
                        .then(function (response) {
                            toast.success("Deposited CC.", {
                                position: "top-right",
                                autoClose: 3000,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                            });
                            getcurBalance();
                            setDepositval(0)
                        })
                        .catch(function (error) {
                            console.log('error', error);
                        });
                // } else {
                //     alert("This token not approved, please check your wallet!")
                // }
            } catch (error) {
                console.log(error)
            }
        }
    };

    const depositppCC = async () => {
        const { ethereum } = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const Printpressportal = new ethers.Contract(Printpress_address, Printpress_abi, signer);
            
            try {
                // await Printpressportal.approve(account, ethers.utils.parseEther(String(depositppval)));
console.log(depositppval)
                let deposit = await Printpressportal.addBalance(account, {value: ethers.utils.parseEther(String(depositppval))});
                await deposit.wait();
                getPPbalance();
                setDepositppval(0)
                toast.success("Deposited CC.", {
                    position: "top-right",
                    autoClose: 3000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } catch (error) {
                console.log(error)
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
            <Button variant="contained" onClick={() => depositCC()}>
                Deposit CCoin
            </Button>
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
                        placeholder="Current CCoin Balance in printpress contract"
                        helperText="Current CCoin balance in printpress contract"
                        fullWidth
                        disabled
                        type="number"
                        // margin="normal"
                        InputLabelProps={{
                            shrink: true
                        }}
                        variant="filled"
                        value={currppccbal}
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
                        value={depositppval}
                        onChange={(e) => {
                            setDepositppval(e.target.value);
                        }}
                    />
                </div>
            </Box>
            <Button variant="contained" onClick={() => depositppCC()}>
                Deposit Gas UP
            </Button>
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
                        placeholder="Current CreditCard Balance"
                        helperText="Current CreditCard balance"
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
                        placeholder="Please input the deposit CreditCard amount"
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
