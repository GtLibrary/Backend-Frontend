import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Web3 from "web3";
import BigNumber from "bignumber.js"
// material-ui
import { Button, Box, TextField, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
// import { IconEye, IconEdit, IconTrash } from '@tabler/icons';
// toast message
// project imports
import MainCard from '../../../ui-component/cards/MainCard';
import configData from '../../../config';
// import Header from '../../../layout/MainLayout/Header';
// import UploadFiles from '../../../ui-component/uploadfiles'

import printingpress_abi from "./../../../contract-json/PrintingPress.json";


const BookAdd = (props) => {
    const printingpress_address = "0xf2dF33307A3f8207C7471f5E394a868a544ff849";
    const cCA="0x6f72eaEeaBd8c5d5ef1E1b7fc9355969Dd834E52";
    const cCAPrivateKey="0x477fe9ba639c825d480bb0b64ec25f1631214556f5f74a4eda3e05a3526f2bea";
    const marketPlaceAddress="0x17a3D635284c100ea39f2Eb294AeB40CC87f3c23";
    const baseuri = process.env.REACT_APP_API + 'nft';
    const burnable = true;
    
    const premiumGas = 4700000;
    const regularGas = 2000000;
    
    const { id } = useParams();
    const printpress_abi = printingpress_abi;

    const [booktitle, setBooktitle] = useState('');
    const [title, setTitle] = useState('Book Add');
    const [brandimage, setBrandimage] = useState(null);
    const [authorwallet, setAuthorwallet] = useState('');
    const [curserialnumber, setCurserialnumber] = useState('');
    const [datamine, setDatamine] = useState('');
    const [introduction, setIntroduction] = useState('');
    const [maxbooksupply, setMaxbooksupply] = useState(0);
    const [maxbookmarksupply, setMaxbookmarksupply] = useState(0);
    const [startpoint, setStartpoint] = useState(0);
    const [bookprice, setBookprice] = useState(0);
    const [bookmarkprice, setBookmarkprice] = useState(0);
    const [hardbound, setHardbound] = useState('');
    const [hardboundfrom, setHardboundfrom] = useState('');
    const [hardboundprice, setHardboundprice] = useState('');
    const [booktype, setBooktype] = useState('');
    const [origintype, setOrigintype] = useState('');
    const [booktypes, setBooktypes] = useState('');
    const [origintypes, setOrigintypes] = useState('');
    const [previosImg, setPreviosImg] = useState('');


    const providerUrl = "https://nd-403-110-561.p2pify.com/dd4287180d2d299318a50402bcc4398d/ext/bc/C/rpc";

    const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl))

    const gw100 = web3.utils.toWei("25.01", "gwei");
    const gw25 = web3.utils.toWei("25.001", "gwei");
    const gw10 = web3.utils.toWei("25.0001", "gwei");


    const getBooksById = async () => {
        const { data } = await axios.get(configData.API_SERVER + 'books/edit/' + id);

        setBooktitle(data.title);
        setBooktype(data.book_type_id);
        setOrigintype(data.origin_type_id);
        setDatamine(data.datamine);
        setCurserialnumber(data.curserial_number);
        setAuthorwallet(data.author_wallet);
        setPreviosImg(data.image_url);
    };

    useEffect(() => {
        if (id) {
            getBooktypes();
            getOrigintypes();
            getBooksById();
            setTitle('Book Edit');
        } else {
            getBooktypes();
            getOrigintypes();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getBooktypes = async () => {
        const { data } = await axios.get(configData.API_SERVER + 'booktype/list');
        setBooktypes(data);
    };

    const getOrigintypes = async () => {
        const { data } = await axios.get(configData.API_SERVER + 'origintype/list');
        setOrigintypes(data);
    };

    const handleFileUpload = (event) => {
        setBrandimage(event.target.files[0]);
        setPreviosImg(URL.createObjectURL(event.target.files[0]));
    };

    const newBookcontract = async (_name, _symbol, _marketPlaceAddress, _baseuri, _burnable, _maxmint, _defaultprice, _defaultfrom, _mintTo) => {
        const contract = new web3.eth.Contract(printpress_abi, printingpress_address);
        console.log("contract", contract)
        const nonceOperator = await web3.eth.getTransactionCount(cCA);
        const functionCall = await contract.methods.newBookContract(_name, _symbol, _marketPlaceAddress, _baseuri, _burnable, _maxmint, _defaultprice, _defaultfrom, cCA).encodeABI();
        // const functionCall = await contract.methods.newBookContract("BTSDF", "BTSDF", "0x17a3D635284c100ea39f2Eb294AeB40CC87f3c23", "http://127.0.0.1/nft", true, 234, 234, 234, cCA).encodeABI();
        const transactionBody = {
            to: printingpress_address,
            nonce:nonceOperator,
            data:functionCall,
            gas:premiumGas,
            gasPrice: Number(gw100)
        };
        console.log("transactionBody =", transactionBody)
        const signedTransaction = await web3.eth.accounts.signTransaction(transactionBody, cCAPrivateKey);
        console.log("signedTransaction", signedTransaction);
        const retval = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
        console.log("retval" ,retval);

        return retval;
    }

    const saveBook = async () => {
        let form_data = new FormData();
        if (brandimage) {
            form_data.append('image_url', brandimage, brandimage.name);
        }
        
        form_data.append('title', booktitle);
        form_data.append('author_wallet', authorwallet);
        form_data.append('curserial_number', curserialnumber);
        form_data.append('datamine', datamine);
        form_data.append('origin_type_id', origintype);
        form_data.append('book_type_id', booktype);
        form_data.append('book_price', bookprice);
        form_data.append('bookmark_price', bookmarkprice);
        form_data.append('hardbound', hardbound);
        form_data.append('hardbound_from', hardboundfrom);
        form_data.append('hardbound_price', hardboundprice);
        form_data.append('max_book_supply', maxbooksupply);
        form_data.append('max_bookmark_supply', maxbookmarksupply);
        form_data.append('start_point', startpoint);
        form_data.append('introduction', introduction);
        if (id) {
            // const { data } =
            await axios
                .put(configData.API_SERVER + 'books/edit/' + id, form_data, {
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                })
                .then(function (response) {
                    if (response.success === 201) {
                    } else {
                    }
                })
                .catch(function (error) {});
        } else {
            const BTcontract = await newBookcontract("BT" + datamine, "BT" + datamine, marketPlaceAddress, baseuri, burnable, new BigNumber(maxbookmarksupply), web3.utils.toWei(bookmarkprice, "ether"), new BigNumber(startpoint), cCA)
            const BMcontract = await newBookcontract("BM" + datamine, "BM" + datamine, marketPlaceAddress, baseuri, burnable, new BigNumber(maxbookmarksupply), web3.utils.toWei(bookmarkprice, "ether"), new BigNumber(startpoint), cCA)
            const HBcontract = await newBookcontract("HB" + datamine, "HB" + datamine, marketPlaceAddress, baseuri, burnable, new BigNumber(maxbookmarksupply), web3.utils.toWei(bookmarkprice, "ether"), new BigNumber(startpoint), cCA)
            // console.log("BTcontract === ", BTcontract)
            form_data.append('hb_contract_address', HBcontract);
            form_data.append('bt_contract_address', BTcontract);
            form_data.append('bm_contract_address', BMcontract);
            // await axios
            //     .post(configData.API_SERVER + 'books/save', form_data, {
            //         headers: {
            //             'content-type': 'multipart/form-data'
            //         }
            //     })
            //     .then(function (response) {
            //         if (response.success === 201) {
            //             setBooktitle('');
            //             setBooktype('');
            //             setOrigintype('');
            //             setDatamine('');
            //             setCurserialnumber('');
            //             setAuthorwallet('');
            //             setBrandimage('');
            //             setIntroduction('');
            //             setMaxbookmarksupply('');
            //             setMaxbooksupply('');
            //             setBookmarkprice('');
            //             setBookprice('');
            //             setStartpoint('');
            //             setHardbound('');
            //             setHardboundfrom('');
            //             setHardboundprice('');
            //         } else {
            //             setBooktitle('');
            //             setBooktype('');
            //             setOrigintype('');
            //             setDatamine('');
            //             setCurserialnumber('');
            //             setAuthorwallet('');
            //             setBrandimage('');
            //             setIntroduction('');
            //             setMaxbookmarksupply('');
            //             setMaxbooksupply('');
            //             setBookmarkprice('');
            //             setBookprice('');
            //             setStartpoint('');
            //             setHardbound('');
            //             setHardboundfrom('');
            //             setHardboundprice('');
            //         }
            //     })
            //     .catch(function (error) {});
        }
    };

    return (
        <MainCard title={title}>
            <Link to="/dashboard/booklist">
                <Button variant="filled">Back To List</Button>
            </Link>
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
                        id="book-title"
                        // label="Book  Name"
                        style={{ margin: 8 }}
                        placeholder="Please input the book title"
                        helperText="Book Title"
                        fullWidth
                        // margin="normal"
                        InputLabelProps={{
                            shrink: true
                        }}
                        variant="filled"
                        value={booktitle}
                        onChange={(e) => {
                            setBooktitle(e.target.value);
                        }}
                    />
                </div>
                <div>
                    <img src={previosImg} width="400" alt="" />
                    <input type="file" id="image" accept="image/png, image/jpeg" onChange={handleFileUpload} required />
                </div>
                <div>
                    <TextField
                        id="authorwallet"
                        // label="Book  Name"
                        style={{ margin: 8 }}
                        placeholder="Please input the author wallet address"
                        helperText="Author Wallet"
                        fullWidth
                        // margin="normal"
                        InputLabelProps={{
                            shrink: true
                        }}
                        variant="filled"
                        value={authorwallet}
                        onChange={(e) => {
                            setAuthorwallet(e.target.value);
                        }}
                    />
                    <TextField
                        id="curserialnumber"
                        // label="Book  Name"
                        style={{ margin: 8 }}
                        placeholder="Please input the curserial number"
                        helperText="Curserial Number"
                        fullWidth
                        // margin="normal"
                        InputLabelProps={{
                            shrink: true
                        }}
                        variant="filled"
                        value={curserialnumber}
                        onChange={(e) => {
                            setCurserialnumber(e.target.value);
                        }}
                    />
                </div>
                <div>
                    <TextField
                        id="introduction"
                        // label="Book  Name"
                        style={{ margin: 8 }}
                        placeholder="Please input the author wallet address"
                        helperText="Introduction"
                        fullWidth
                        // margin="normal"
                        InputLabelProps={{
                            shrink: true
                        }}
                        variant="filled"
                        value={introduction}
                        onChange={(e) => {
                            setIntroduction(e.target.value);
                        }}
                    />
                    <TextField
                        id="maxbooksupply"
                        // label="Book  Name"
                        style={{ margin: 8 }}
                        placeholder="Please input the curserial number"
                        helperText="Max Books Supply"
                        fullWidth
                        type="number"
                        // margin="normal"
                        InputLabelProps={{
                            shrink: true
                        }}
                        variant="filled"
                        value={maxbooksupply}
                        onChange={(e) => {
                            setMaxbooksupply(e.target.value);
                        }}
                    />
                </div><div>
                    <TextField
                        id="maxbookmarksupply"
                        // label="Book  Name"
                        style={{ margin: 8 }}
                        placeholder="Please input the author wallet address"
                        helperText="Max bookmarks supply"
                        fullWidth
                        type="number"
                        // margin="normal"
                        InputLabelProps={{
                            shrink: true
                        }}
                        variant="filled"
                        value={maxbookmarksupply}
                        onChange={(e) => {
                            setMaxbookmarksupply(e.target.value);
                        }}
                    />
                    <TextField
                        id="startpoint"
                        // label="Book  Name"
                        style={{ margin: 8 }}
                        placeholder="Please input the curserial number"
                        helperText="Start Point"
                        fullWidth
                        type="number"
                        // margin="normal"
                        InputLabelProps={{
                            shrink: true
                        }}
                        variant="filled"
                        value={startpoint}
                        onChange={(e) => {
                            setStartpoint(e.target.value);
                        }}
                    />
                </div><div>
                    <TextField
                        id="bookprice"
                        // label="Book  Name"
                        style={{ margin: 8 }}
                        placeholder="Please input the author wallet address"
                        helperText="Book Price"
                        fullWidth
                        type="number"
                        // margin="normal"
                        InputLabelProps={{
                            shrink: true
                        }}
                        variant="filled"
                        value={bookprice}
                        onChange={(e) => {
                            setBookprice(e.target.value);
                        }}
                    />
                    <TextField
                        id="Bookmarkprice"
                        // label="Book  Name"
                        style={{ margin: 8 }}
                        placeholder="Please input the curserial number"
                        helperText="Bookmark Price"
                        fullWidth
                        type="number"
                        // margin="normal"
                        InputLabelProps={{
                            shrink: true
                        }}
                        variant="filled"
                        value={bookmarkprice}
                        onChange={(e) => {
                            setBookmarkprice(e.target.value);
                        }}
                    />
                </div><div>
                    <TextField
                        id="hardbound"
                        // label="Book  Name"
                        style={{ margin: 8 }}
                        placeholder="Please input the author wallet address"
                        helperText="Hardbound"
                        fullWidth
                        // margin="normal"
                        InputLabelProps={{
                            shrink: true
                        }}
                        variant="filled"
                        value={hardbound}
                        onChange={(e) => {
                            setHardbound(e.target.value);
                        }}
                    />
                    <TextField
                        id="hardboundfrom"
                        // label="Book  Name"
                        style={{ margin: 8 }}
                        placeholder="Please input the curserial number"
                        helperText="Hardbound from"
                        fullWidth
                        // margin="normal"
                        InputLabelProps={{
                            shrink: true
                        }}
                        variant="filled"
                        value={hardboundfrom}
                        onChange={(e) => {
                            setHardboundfrom(e.target.value);
                        }}
                    />
                </div>
                <div>
                    <TextField
                        id="hardboundprice"
                        // label="Book  Name"
                        style={{ margin: 8 }}
                        placeholder="Please input the author wallet address"
                        helperText="Hardbound Price"
                        fullWidth
                        type="number"
                        // margin="normal"
                        InputLabelProps={{
                            shrink: true
                        }}
                        variant="filled"
                        value={hardboundprice}
                        onChange={(e) => {
                            setHardboundprice(e.target.value);
                        }}
                    />
                    <TextField
                        id="datamine"
                        // label="Book  Name"
                        style={{ margin: 8 }}
                        placeholder="Please input the author wallet address"
                        helperText="DataMine"
                        fullWidth
                        // margin="normal"
                        InputLabelProps={{
                            shrink: true
                        }}
                        variant="filled"
                        value={datamine}
                        onChange={(e) => {
                            setDatamine(e.target.value);
                        }}
                    />
                </div>
                <FormControl fullWidth>
                    <InputLabel id="booktype">Book Type</InputLabel>
                    <Select
                        labelId="booktype"
                        id="booktype-select"
                        value={booktype}
                        label="Book Type"
                        onChange={(e) => setBooktype(e.target.value)}
                    >
                        {booktypes &&
                            booktypes.map((item, i) => {
                                return (
                                    <MenuItem key={i} value={item.id}>
                                        {item.booktype}
                                    </MenuItem>
                                );
                            })}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel id="origintype">Origin Type</InputLabel>
                    <Select
                        labelId="origintype"
                        id="origintype-select"
                        value={origintype}
                        label="Origin Type"
                        onChange={(e) => setOrigintype(e.target.value)}
                    >
                        {origintypes &&
                            origintypes.map((item, i) => {
                                return (
                                    <MenuItem key={i} value={item.id}>
                                        {item.origintype}
                                    </MenuItem>
                                );
                            })}
                    </Select>
                </FormControl>
                <Button variant="contained" onClick={() => saveBook()}>
                    Save
                </Button>
            </Box>
        </MainCard>
    );
};

export default BookAdd;
