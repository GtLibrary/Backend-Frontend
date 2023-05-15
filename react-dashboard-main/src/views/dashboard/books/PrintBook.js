import React, { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import axios from 'axios';
import Web3 from 'web3';
import { ethers } from "ethers";
import { useSelector } from 'react-redux';
import { useWeb3React } from "@web3-react/core";
// material-ui
// import { Grid, Button, Box, , Divider } from '@material-ui/core';
import { Button, TextField, Box, FormControl, InputLabel, Select, MenuItem, Fab, Divider, Grid } from '@material-ui/core';

// toast message
import { toast } from "react-toastify";
// project imports
import MainCard from '../../../ui-component/cards/MainCard';
import { gridSpacing } from '../../../store/constant';
import configData from '../../../config';
import "./styles.css";

import printingpress_abi from './../../../contract-json/PrintingPress.json';
import booktradable_abi from './../../../contract-json/BookTradable.json';

const printingpress_address = process.env.REACT_APP_PRINTINGPRESSADDRESS;
const onlyinteger = /^\d+(,\d{0,3})?$/

const PrintBook = (props) => {
    
    const { bookid } = useParams();
    const { account } = useWeb3React();
    const [ booktitle, setBooktitle] = useState('');
    const [ toaddress, setToaddress ] = useState('');
    const [ toaddressone, setToaddressone ] = useState('');
    const [ bookcontractaddress, setBookcontractaddress ] = useState('');
    const [ maxbooksupply, setMaxbooksupply ] = useState(0);
    const [ bookprice, setBookprice ] = useState(0);
    const [ mintamount, setMintamount ] = useState(0);
    const [ gasrewards, setGasrewards] = useState(0);
    const [ tokentype, setTokentype ] = useState(1);
    const [ curmintedamount, setCurmintedamount ] = useState(0);
    const [ startpoint, setStartpoint ] = useState(0);
    const [tokentypes, setTokentypes] = useState([])

    const accountinfo = useSelector((state) => state.account);
    const providerUrl = process.env.REACT_APP_PROVIDERURL;

    const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));

    const getPrintBookById = async () => {
        const { data } = await axios.get(configData.API_SERVER + 'books/edit/' + bookid, { headers: { Authorization: `${accountinfo.token}` } });
        
        const bmlist = data.bm_listdata;
        let tokenlist = [
            {
                "id": 1,
                "tokenname": "Book Token",
                "contractaddress": data.bt_contract_address,
                "maxtokensupply": data.max_book_supply,
                "startpoint": data.book_from,
                "tokenprice": data.book_price
            }, 
            {
                "id": 2,
                "tokenname": "Hardbound Token",
                "contractaddress": data.hb_contract_address,
                "maxtokensupply": data.max_hardbound_supply,
                "startpoint": data.hardbound_from,
                "tokenprice": data.hardbound_price
            }
        ];
        for (let i = 0; i < bmlist.length; i++) {
            const id = 3 + i;
            const element = {
                "id": id,
                "tokenname": "Bookmark " + bmlist[i].tokenname,
                "contractaddress": bmlist[i].item_bmcontract_address,
                "maxtokensupply": bmlist[i].maxbookmarksupply,
                "startpoint": bmlist[i].bookmarkstartpoint,
                "tokenprice": bmlist[i].bookmarkprice
            };
            tokenlist.push(element)
        }

        setTokentypes(tokenlist)
        setBooktitle('"'+ data.title + '" Book Mint By Author');
        setBookcontractaddress(data.bt_contract_address);
        gettotalsupply(data.bt_contract_address);
        setStartpoint(data.book_from);
        setBookprice(data.book_price);
        setMaxbooksupply(data.max_book_supply);
    }

    useEffect(() => {
        getPrintBookById();
    }, [])

    const changeToken = (e) => {
        setTokentype(e.target.value)
        let id = e.target.value;
        let index = id - 1;
        
        setBookcontractaddress(tokentypes[index]["contractaddress"]);
        gettotalsupply(tokentypes[index]["contractaddress"]);
        setStartpoint(tokentypes[index]["startpoint"]);
        setBookprice(tokentypes[index]["tokenprice"]);
        setMaxbooksupply(tokentypes[index]["maxtokensupply"]);
    }

    const gettotalsupply = async (curtokenaddress) => {
        const {ethereum} = window;
        if(ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const btcontractPortal = new ethers.Contract(curtokenaddress, booktradable_abi, signer);
            let cursupply = await btcontractPortal.totalSupply();
            setCurmintedamount(Number(cursupply));
        }
    }

    const MintBook = async () => {
        
        const { ethereum } = window;

        if(toaddress === '') {
            toast.error("please input to address", {
                position: "top-right",
                autoClose: 3000,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return false;
        }
        
        if(ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const contractPortal = new ethers.Contract(printingpress_address, printingpress_abi, signer);
            console.log(bookcontractaddress, toaddress, mintamount, bookprice, gasrewards, web3.utils.toWei(String(bookprice)))
            try {
                let contract = await contractPortal.delegateMinter(toaddress, bookcontractaddress, Number(mintamount), web3.utils.toWei(String(bookprice)), ethers.utils.parseEther(String(gasrewards)));
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

    
    const MintOneBook = async () => {
        const { ethereum } = window;
        
        if(toaddressone === '') {
            toast.error("please input to address", {
                position: "top-right",
                autoClose: 3000,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return false;
        }
        
        if(ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const btcontractPortal = new ethers.Contract(bookcontractaddress, booktradable_abi, signer);
            if (toaddressone === '') {
                toast.error("Please input address", {
                    position: "top-right",
                    autoClose: 3000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                return;
            }
            try {
                let contract = await btcontractPortal.mintTo(toaddressone);
                await contract.wait();
                getPrintBookById();
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
                    <Divider>Multiple Book Mint</Divider>
                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '50ch' }
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        
                        <FormControl className="mui-formcontrol">
                            <InputLabel id="tokentype">Token Type</InputLabel>
                            <Select
                                labelId="tokentype"
                                id="token-select"
                                value={tokentype}
                                label="Token Type"
                                onChange={(e) => {changeToken(e)}}
                            >
                                {tokentypes &&
                                    tokentypes.map((item, i) => {
                                        return (
                                            <MenuItem key={i} value={item.id}>
                                                {item.tokenname}
                                            </MenuItem>
                                        );
                                    })}
                            </Select>
                        </FormControl>
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
                                id="max_amount"
                                // label="Book  Name"
                                style={{ margin: 8 }}
                                placeholder="max supply amount"
                                helperText="token max amount"
                                fullWidth
                                disabled={true}
                                // margin="normal"
                                InputLabelProps={{
                                    shrink: true
                                }}
                                variant="filled"
                                value={curmintedamount}
                            />
                        </div>
                        <div>
                            <TextField
                                id="minted_amount"
                                // label="Book  Name"
                                style={{ margin: 8 }}
                                placeholder="Current minted token amount"
                                helperText="Current minted token amount"
                                fullWidth
                                disabled={true}
                                // margin="normal"
                                InputLabelProps={{
                                    shrink: true
                                }}
                                variant="filled"
                                value={curmintedamount}
                            />
                        </div>
                        <div>
                            <TextField
                                id="startpoint"
                                // label="Book  Name"
                                style={{ margin: 8 }}
                                placeholder="startpoint"
                                helperText="startpoint"
                                fullWidth
                                disabled={true}
                                // margin="normal"
                                InputLabelProps={{
                                    shrink: true
                                }}
                                variant="filled"
                                value={startpoint}
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
                                value={mintamount}
                                onChange={(e) => {
                                    if(onlyinteger.test(e.target.value)) {
                                        if(e.target.value > 0) {
                                            console.log(e.target.value)
                                            setMintamount(e.target.value);
                                        } else {
                                            return;
                                        }
                                    }
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
                        <Button variant="contained" onClick={() => MintBook()}>Mint</Button>
                    </Box>
                    <Divider>One Book Mint</Divider>
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
                                value={toaddressone}
                                onChange={(e) => {
                                    setToaddressone(e.target.value);
                                }}
                            />
                        </div>
                        <Button variant="contained" onClick={() => MintOneBook()}>Mint</Button>
                    </Box>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default PrintBook;
