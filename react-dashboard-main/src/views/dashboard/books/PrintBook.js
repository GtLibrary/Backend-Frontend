import React, { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import axios from 'axios';
import { ethers } from "ethers";
import Web3 from 'web3';
import { useWeb3React } from "@web3-react/core";
import { useSelector } from 'react-redux';
// material-ui
import { Grid, Button, Box, TextField } from '@material-ui/core';
// toast message
import { toast } from "react-toastify";
// project imports
import MainCard from '../../../ui-component/cards/MainCard';
import { gridSpacing } from '../../../store/constant';
import configData from '../../../config';
import "./styles.css";

import printingpress_abi from './../../../contract-json/PrintingPress.json';

const printingpress_address = process.env.REACT_APP_PRINTINGPRESSADDRESS;

const PrintBook = (props) => {
    
    const { bookid } = useParams();
    const [ booktitle, setBooktitle] = useState('');
    const [ toaddress, setToaddress ] = useState('');
    const [ bookcontractaddress, setBookcontractaddress ] = useState('');
    const [ maxbooksupply, setMaxbooksupply ] = useState(0);
    const [ amount, setAmount ] = useState(0);
    const [ gasrewards, setGasrewards] = useState(0);

    const accountinfo = useSelector((state) => state.account);

    const getPrintBookById = async () => {
        const { data } = await axios.get(configData.API_SERVER + 'books/edit/' + bookid, { headers: { Authorization: `${accountinfo.token}` } });
        
        setBooktitle('"'+ data.title + '" Book Mint By Author');
        setBookcontractaddress(data.bt_contract_address);
        setMaxbooksupply(data.max_book_supply);
    }

    useEffect(() => {
        getPrintBookById()
    }, [])

    const MintBook = async () => {
        
        const { ethereum } = window;
        
        if(ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const contractPortal = new ethers.Contract(printingpress_address, printingpress_abi, signer);
            console.log(maxbooksupply, amount, gasrewards)
            try {
                let contract = await contractPortal.delegateMinter(toaddress, bookcontractaddress, maxbooksupply, amount, gasrewards);
                await contract.wait();
                toast.success("successfully Mint Book", {
                    position: "top-right",
                    autoClose: 3000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } catch (error) {
                console.log("error", error)
                toast.error("failed mint book", {
                    position: "top-right",
                    autoClose: 3000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        }
    }
    
    
    return (
        <MainCard title={booktitle}>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} sm={12}>
                    <Box display="flex" flexDirection="row" p={1} m={1} bgcolor="background.paper">
                        <Link to="/dashboard/booklist">
                            <Button variant="outlined">Back To List</Button>
                        </Link>
                    </Box>
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
                                id="to_address"
                                // label="Book  Name"
                                style={{ margin: 8 }}
                                placeholder="Please input the to address"
                                helperText="To address"
                                fullWidth
                                // margin="normal"
                                InputLabelProps={{
                                    shrink: true
                                }}
                                variant="filled"
                                value={toaddress}
                                onChange={(e) => {
                                    setToaddress(e.target.value);
                                }}
                            />
                        </div>
                        <div>
                            <TextField
                                id="amount"
                                // label="Book  Name"
                                style={{ margin: 8 }}
                                placeholder="Please input mint amount"
                                helperText="Mint amount"
                                fullWidth
                                type="number"
                                // margin="normal"
                                InputLabelProps={{
                                    shrink: true
                                }}
                                variant="filled"
                                value={amount}
                                onChange={(e) => {
                                    setAmount(e.target.value);
                                }}
                            />
                        </div>
                        <div>
                            <TextField
                                id="gasrewards"
                                style={{ margin: 8 }}
                                placeholder="Please input Gasreward"
                                helperText="GasRewards"
                                fullWidth
                                type="number"
                                InputLabelProps={{
                                    shrink: true
                                }}
                                variant="filled"
                                value={gasrewards}
                                onChange={(e) => {
                                    setGasrewards(e.target.value);
                                }}
                            />
                        </div>
                    </Box>
                    <Box display="flex" flexDirection="row" p={1} m={1} bgcolor="background.paper">
                        <Button variant="contained" onClick={() => MintBook()}>Mint</Button>
                    </Box>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default PrintBook;
