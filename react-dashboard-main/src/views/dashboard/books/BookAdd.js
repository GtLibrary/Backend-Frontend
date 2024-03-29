import React, { useEffect, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import Web3 from 'web3';
import LoadingOverlay from 'react-loading-overlay';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { useSelector } from 'react-redux';
// material-ui
import { Button, Box, FormControl, InputLabel, Select, MenuItem, Fab, Divider, Grid } from '@material-ui/core';
// project imports
import MainCard from '../../../ui-component/cards/MainCard';
import InputTextField from '../../../ui-component/extended/InputTextField';
import AddonRevocation from '../../advanced/AddonRevocation';
import BookAddItem from './BookAddItem';
import configData from '../../../config';
import './styles.css';

import printingpress_abi from './../../../contract-json/PrintingPress.json';
import booktradable_abi from './../../../contract-json/BookTradable.json';

LoadingOverlay.propTypes = undefined;

const generateRandomString = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const BookAdd = (props) => {
    const printingpress_address = process.env.REACT_APP_PRINTINGPRESSADDRESS;
    const minimart_address = process.env.REACT_APP_MINIMARTADDRESS;
    const marketPlaceAddress = process.env.REACT_APP_MARKETPLACEADDRESS;
    const cca_address = process.env.REACT_APP_CCA;
    const baseuri = process.env.REACT_APP_API + 'nft/';
    const burnable = true;

    const { bookid } = useParams();
    const history = useHistory();
    const { account } = useWeb3React();
    const printpress_abi = printingpress_abi;
    const accountinfo = useSelector((state) => state.account);
    const [curavaxprice, setCuravaxprice] = useState(0.0);

    const [booktitle, setBooktitle] = useState('');
    const [bookcontractaddress, setBookcontractaddress] = useState('');
    const [hardboundcontractaddress, setHardboundcontractaddress] = useState('');
    const [title, setTitle] = useState('Add New Book');
    const [brandimage, setBrandimage] = useState(null);
    const [authorwallet, setAuthorwallet] = useState(account);
    const [authorname, setAuthorname] = useState(accountinfo.user.username);
    // const [curserialnumber, setCurserialnumber] = useState('');
    const [datamine, setDatamine] = useState(generateRandomString(8));
    const [introduction, setIntroduction] = useState('');
    const [bookdescription, setBookdescription] = useState('');
    const [byteperbookmark, setByteperbookmark] = useState(2048);
    const [hardbounddescription, setHardbounddescription] = useState('');
    const [maxbooksupply, setMaxbooksupply] = useState(100000000);
    const [maxbookmarksupply, setMaxbookmarksupply] = useState(390);
    const [maxhardboundsupply, setMaxhardboundsupply] = useState(1000);
    const [startpoint, setStartpoint] = useState(0);
    const [hardboundstartpoint, setHardboundStartpoint] = useState(5);
    const [bookprice, setBookprice] = useState(1);
    const [bookmarkprice, setBookmarkprice] = useState(60);
    const [hardboundprice, setHardboundprice] = useState(5);
    const [booktype, setBooktype] = useState(0);
    const [origintype, setOrigintype] = useState(0);
    const [booktypes, setBooktypes] = useState([]);
    const [origintypes, setOrigintypes] = useState([]);
    const [previosImg, setPreviosImg] = useState('');
    const [curimg, setCurimg] = useState(false);
    const [loading, setLoading] = useState(false);
    const [inputList, setInputList] = useState([
        { tokenname: generateRandomString(8), bookmarkprice: '60', maxbookmarksupply: '390', bookmarkstartpoint: '10', item_bmcontract_address: '' }
    ]);
    const [errors, setErrors] = useState({
        booktitle: false,
        authorwallet: false,
        authorname: false,
        datamine: false,
        bookprice: false,
        maxbooksupply: false,
        hbprice: false,
        maxhbsupply: false
    });
    const [showrevocation, setShowrevocation] = useState(false);

    useEffect(() => {
        if (String(account) === String(cca_address)) {
            setShowrevocation(true);
        } else {
            setShowrevocation(false);
        }
    }, [account]);

    const providerUrl = process.env.REACT_APP_PROVIDERURL;

    const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));

    const getBooksById = async () => {
        const { data } = await axios.get(configData.API_SERVER + 'books/edit/' + bookid, {
            headers: { Authorization: `${accountinfo.token}` }
        });

        setBooktitle(data.title);
        setBooktype(data.book_type_id);
        setOrigintype(data.origin_type_id);
        setDatamine(data.datamine);
        // setCurserialnumber(data.curserial_number);
        setAuthorwallet(data.author_wallet);
        setAuthorname(data.author_name);
        setIntroduction(data.introduction);
        setBookprice(data.book_price);
        setBookmarkprice(data.bookmark_price);
        setHardboundprice(data.hardbound_price);
        setMaxbooksupply(data.max_book_supply);
        setMaxbookmarksupply(data.max_bookmark_supply);
        setMaxhardboundsupply(data.max_hardbound_supply);
        setBookdescription(data.book_description);
        setByteperbookmark(data.byteperbookmark);
        setHardbounddescription(data.hardbound_description);
        setStartpoint(data.book_from);
        setHardboundStartpoint(data.hardbound_from);
        setPreviosImg(data.image_url);
        setBookcontractaddress(data.bt_contract_address);
        setHardboundcontractaddress(data.hb_contract_address);
        setInputList(data.bm_listdata);
    };

    useEffect(() => {
        async function getAvaxprice() {
            const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2&vs_currencies=usd');
            const price = response.data['avalanche-2'].usd;
            setCuravaxprice(price)
        }
        getAvaxprice()
    }, [])

    useEffect(() => {
        getBooktypes();
        getOrigintypes();
        if (bookid) {
            getBooksById();
            setTitle('Edit Book');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getBooktypes = async () => {
        await axios
            .get(configData.API_SERVER + 'booktype/list', { headers: { Authorization: `${accountinfo.token}` } })
            .then((response) => {
                setBooktypes(response.data);
            });
    };

    const getOrigintypes = async () => {
        await axios
            .get(configData.API_SERVER + 'origintype/list', { headers: { Authorization: `${accountinfo.token}` } })
            .then((response) => {
                setOrigintypes(response.data);
            });
    };

    const handleFileUpload = (event) => {
        setBrandimage(event.target.files[0]);
        setPreviosImg(URL.createObjectURL(event.target.files[0]));
        setCurimg(false)
    };

    const getnewBookcontractdata = async (
        _name,
        _symbol,
        _marketPlaceAddress,
        _baseuri,
        _burnable,
        _maxmint,
        _defaultprice,
        _defaultfrom,
        _mintTo
    ) => {
        const { ethereum } = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const printpress = new ethers.Contract(printingpress_address, printpress_abi, signer);
            try {
                let contract = await printpress.newBookContract(
                    _name,
                    _symbol,
                    _marketPlaceAddress,
                    _baseuri,
                    _burnable,
                    _maxmint,
                    _defaultprice,
                    _defaultfrom,
                    account
                );

                const contractdata = await contract.wait();
                const contract_address = contractdata.logs[0].address;

                return contract_address;
            } catch (error) {
                console.log('error', error);
            }
        }
    };

    const updatedefaultprice = async (contract_address, _defaultprice) => {
        const { ethereum } = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const contractPortal = new ethers.Contract(contract_address, booktradable_abi, signer);
            try {
                let contract = await contractPortal.setDefaultPrice(_defaultprice);
                await contract.wait();
            } catch (error) {
                console.log('error', error);
            }
        }
    };

    const updatedefaultsupply = async (contract_address, _defaultfrom) => {
        const { ethereum } = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const contractPortal = new ethers.Contract(contract_address, booktradable_abi, signer);
            try {
                let contract = await contractPortal.setDefaultFrom(_defaultfrom);
                await contract.wait();
            } catch (error) {
                console.log('error', error);
            }
        }
    };

    const updatedefaultmaxsupply = async (contract_address, maxsupply) => {
        const { ethereum } = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const contractPortal = new ethers.Contract(contract_address, booktradable_abi, signer);
            try {
                let contract = await contractPortal.setMaxMint(maxsupply);
                await contract.wait();
            } catch (error) {
                console.log('error', error);
            }
        }
    };

    const savePrice = async () => {
        setLoading(true);
        const { ethereum } = window;

        if (ethereum) {
            try {
                await updatedefaultprice(bookcontractaddress, ethers.utils.parseEther(String(bookprice)));
                await updatedefaultprice(hardboundcontractaddress, ethers.utils.parseEther(String(hardboundprice)));

                for (let index = 0; index < inputList.length; index++) {
                    let item = inputList[index];
                    let tokenname = item['tokenname'];
                    let itembookmarkprice = item['bookmarkprice'];
                    let itemmaxbookmarksupply = item['maxbookmarksupply'];
                    let itembookmarkstartpoint = item['bookmarkstartpoint'];
                    let BMcontract = await getnewBookcontractdata(
                        'BM' + tokenname,
                        'BM' + tokenname,
                        marketPlaceAddress,
                        baseuri,
                        burnable,
                        ethers.utils.parseEther(String(itemmaxbookmarksupply)),
                        ethers.utils.parseEther(String(itembookmarkprice)),
                        ethers.utils.parseEther(String(itembookmarkstartpoint)),
                        account
                    );
                    // const BookTradable = new ethers.Contract(BMcontract, booktradable_abi, signer);
                    // await BookTradable.setRewardContract(bookcontractaddress);
                    inputList[index]['item_bmcontract_address'] = BMcontract;
                }

                let form_data = new FormData();
                form_data.append('book_price', bookprice);
                form_data.append('bm_listdata', JSON.stringify(inputList));
                form_data.append('hardbound_price', hardboundprice);

                await axios
                    .put(configData.API_SERVER + 'books/edit/' + bookid, form_data, {
                        headers: {
                            'content-type': 'multipart/form-data',
                            Authorization: `${accountinfo.token}`
                        }
                    })
                    .then(function (response) {
                        toast.success('successfully save data', {
                            position: 'top-right',
                            autoClose: 3000,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true
                        });
                    })
                    .catch(function (error) {
                        toast.error('failed save book data', {
                            position: 'top-right',
                            autoClose: 3000,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true
                        });
                    });
            } catch (error) {
                console.log(error);
            }
        }
        setLoading(false);
    };

    const saveDefaultWizard = async () => {
        setLoading(true);
        try {
            await updatedefaultsupply(bookcontractaddress, startpoint);
            await updatedefaultsupply(hardboundcontractaddress, hardboundstartpoint);
            let form_data = new FormData();
            form_data.append('book_from', startpoint);

            for (let index = 0; index < inputList.length; index++) {
                let item = inputList[index];
                let tokenname = item['tokenname'];
                let itembookmarkprice = item['bookmarkprice'];
                let itemmaxbookmarksupply = item['maxbookmarksupply'];
                let itembookmarkstartpoint = item['bookmarkstartpoint'];
                let BMcontract = await getnewBookcontractdata(
                    'BM' + tokenname,
                    'BM' + tokenname,
                    marketPlaceAddress,
                    baseuri,
                    burnable,
                    ethers.utils.parseEther(String(itemmaxbookmarksupply)),
                    web3.utils.toWei(String(itembookmarkprice)),
                    itembookmarkstartpoint,
                    account
                );
                inputList[index]['item_bmcontract_address'] = BMcontract;
            }
            form_data.append('bm_listdata', JSON.stringify(inputList));
            form_data.append('hardbound_from', hardboundstartpoint);

            await axios
                .put(configData.API_SERVER + 'books/edit/' + bookid, form_data, {
                    headers: {
                        'content-type': 'multipart/form-data',
                        Authorization: `${accountinfo.token}`
                    }
                })
                .then(function (response) {
                    toast.success('successfully save data', {
                        position: 'top-right',
                        autoClose: 3000,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    });
                })
                .catch(function (error) {
                    toast.error('failed save book data', {
                        position: 'top-right',
                        autoClose: 3000,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    });
                });
        } catch (error) {}
        setLoading(false);
    };

    const saveMaxmintWizard = async () => {
        setLoading(true);
        try {
            await updatedefaultmaxsupply(bookcontractaddress, ethers.utils.parseEther(String(maxbooksupply)));
            await updatedefaultmaxsupply(hardboundcontractaddress, ethers.utils.parseEther(String(maxbooksupply)));
            let form_data = new FormData();
            form_data.append('max_book_supply', maxbooksupply);

            for (let index = 0; index < inputList.length; index++) {
                let item = inputList[index];
                let tokenname = item['tokenname'];
                let itembookmarkprice = item['bookmarkprice'];
                let itemmaxbookmarksupply = item['maxbookmarksupply'];
                let itembookmarkstartpoint = item['bookmarkstartpoint'];
                let BMcontract = await getnewBookcontractdata(
                    'BM' + tokenname,
                    'BM' + tokenname,
                    marketPlaceAddress,
                    baseuri,
                    burnable,
                    ethers.utils.parseEther(String(itemmaxbookmarksupply)),
                    web3.utils.toWei(String(itembookmarkprice)),
                    ethers.utils.parseEther(String(itembookmarkstartpoint)),
                    account
                );
                // const BookTradable = new ethers.Contract(BMcontract, booktradable_abi, signer);
                // await BookTradable.setRewardContract(bookcontractaddress)
                inputList[index]['item_bmcontract_address'] = BMcontract;
            }
            form_data.append('bm_listdata', JSON.stringify(inputList));
            form_data.append('max_hardbound_supply', maxhardboundsupply);

            await axios
                .put(configData.API_SERVER + 'books/edit/' + bookid, form_data, {
                    headers: {
                        'content-type': 'multipart/form-data',
                        Authorization: `${accountinfo.token}`
                    }
                })
                .then(function (response) {
                    toast.success('successfully save data', {
                        position: 'top-right',
                        autoClose: 3000,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    });
                })
                .catch(function (error) {
                    toast.error('failed save book data', {
                        position: 'top-right',
                        autoClose: 3000,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    });
                });
        } catch (error) {}
        setLoading(false);
    };

    const saveBookInfo = async () => {
        setLoading(true);
        let form_data = new FormData();
        if (brandimage) {
            form_data.append('image_url', brandimage, brandimage.name);
        }
        form_data.append('title', booktitle);
        form_data.append('author_wallet', authorwallet);
        form_data.append('author_name', authorname);
        form_data.append('introduction', introduction);
        form_data.append('origin_type_id', origintype);
        form_data.append('book_type_id', booktype);
        form_data.append('book_description', bookdescription);
        form_data.append('byteperbookmark', byteperbookmark);
        form_data.append('hardbound_description', hardbounddescription);
        await axios
            .put(configData.API_SERVER + 'books/edit/' + bookid, form_data, {
                headers: {
                    'content-type': 'multipart/form-data',
                    Authorization: `${accountinfo.token}`
                }
            })
            .then(function (response) {
                if (response.status === 201) {
                    setBooktitle('');
                    setBooktype('');
                    setPreviosImg('');
                    setOrigintype('');
                    setDatamine('');
                    setAuthorwallet('');
                    setAuthorname('');
                    setBrandimage('');
                    setIntroduction('');
                }
                toast.success('successfully saved', {
                    position: 'top-right',
                    autoClose: 3000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
            })
            .catch(function (error) {
                toast.error('failed save data', {
                    position: 'top-right',
                    autoClose: 3000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
            });

        setLoading(false);
    };

    const saveBook = async () => {
        setLoading(true);
        const { ethereum } = window;
        let checked = false;

        if (booktitle === '') {
            setErrors((errors) => ({ ...errors, booktitle: true }));
            console.log('booktitle: ', booktitle);
            checked = true;
        }
        if (previosImg === '') {
            setCurimg(true);
            checked = true;
        }
        if (authorwallet === '') {
            setErrors((errors) => ({ ...errors, authorwallet: true }));
            console.log('authorwallet: ', authorwallet);
            checked = true;
        }
        if (authorname === '') {
            setErrors((errors) => ({ ...errors, authorname: true }));
            console.log('authorname: ', authorname);
            checked = true;
        }
        if (datamine === '') {
            setErrors((errors) => ({ ...errors, datamine: true }));
            console.log('datamine: ', datamine);
            checked = true;
        }
        if (bookprice <= 0) {
            setErrors((errors) => ({ ...errors, bookprice: true }));
            console.log('bookprice: ', bookprice);
            checked = true;
        }
        try {
            if (inputList[0]['maxbookmarksupply'] <= 0) {
                //setErrors((errors) => ({ ...errors, maxbookmarksupply: true }));
		alert("Bookmark exists but max bookmark supply was left empty, or it was set equal to or less than zero.");
                console.log('maxbookmarksupply: ', maxbookmarksupply);
                checked = true;
            }
        } catch (e) {
            console.log('User has no bookmark!', e);
        }
        if (hardboundprice <= 0) {
            setErrors((errors) => ({ ...errors, hbprice: true }));
            console.log('hardboundprice: ', hardboundprice);
            checked = true;
        }

        if (maxhardboundsupply <= 0) {
            setErrors((errors) => ({ ...errors, maxhbsupply: true }));
            console.log('maxhardboundsupply: ', maxhardboundsupply);
            checked = true;
        }

        if (checked) {
            toast.error('failed save data. please check all input field', {
                position: 'top-right',
                autoClose: 3000,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
            setLoading(false);
            return false;
        }

        
        const checkavax = window.confirm(
            "If you don't have enough AVAX, book mint may fail. Please check your wallet before minting book. No more than 0.5 AVAX will be needed and the price could be far less depending on congestion. Remember, we are taking no cut of the cost to mint your books."
        );
        if(!checkavax) {
            setLoading(false);
            return;
        }


        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            
            // const printpress = new ethers.Contract(printingpress_address, printpress_abi, signer);

            let form_data = new FormData();
            if (brandimage) {
                form_data.append('image_url', brandimage, brandimage.name);
            }

            form_data.append('title', booktitle);
            form_data.append('author_wallet', authorwallet);
            form_data.append('author_name', authorname);
            form_data.append('introduction', introduction);
            // form_data.append('curserial_number', curserialnumber);
            form_data.append('datamine', datamine);
            form_data.append('origin_type_id', origintype);
            form_data.append('book_type_id', booktype);
            form_data.append('book_price', bookprice);
            form_data.append('book_description', bookdescription);
            form_data.append('byteperbookmark', byteperbookmark);
            form_data.append('hardbound_description', hardbounddescription);
            form_data.append('bookmark_price', bookmarkprice);
            form_data.append('hardbound_price', hardboundprice);
            form_data.append('max_book_supply', maxbooksupply);
            form_data.append('max_bookmark_supply', maxbookmarksupply);
            form_data.append('max_hardbound_supply', maxhardboundsupply);
            form_data.append('book_from', startpoint);
            form_data.append('hardbound_from', hardboundstartpoint);
            if (bookid) {
                const confirmed = window.confirm(
                    'If you proceed you risk destroying your current book/bookmark. Consider updating your token instead. Proceed?'
                );
                if (confirmed) {
                    try {
                        const BTcontract = await getnewBookcontractdata(
                            'BT' + datamine,
                            'BT' + datamine,
                            marketPlaceAddress,
                            baseuri,
                            burnable,
                            ethers.utils.parseEther(String(maxbooksupply)),
                            web3.utils.toWei(String(bookprice)),
                            ethers.utils.parseEther(String(startpoint)),
                            account
                        );
                        const BookTradableBT = new ethers.Contract(BTcontract, booktradable_abi, signer);
                        //await BookTradable.setRewardContract(BTcontract);
                        
                        await BookTradableBT.setAddon(printingpress_address, true);
                        await BookTradableBT.setAddon(minimart_address, true);

                        const HBcontract = await getnewBookcontractdata(
                            'HB' + datamine,
                            'HB' + datamine,
                            marketPlaceAddress,
                            baseuri,
                            burnable,
                            ethers.utils.parseEther(String(maxhardboundsupply)),
                            web3.utils.toWei(String(hardboundprice)),
                            ethers.utils.parseEther(String(hardboundstartpoint)),
                            account
                        );
                        
                        const BookTradableHB = new ethers.Contract(HBcontract, booktradable_abi, signer);
                        await BookTradableHB.setRewardContract(BTcontract);
                        await BookTradableHB.setAddon(printingpress_address, true);
                        await BookTradableHB.setAddon(minimart_address, true);

                        await BookTradableBT.setAddon(HBcontract, true);

                        for (let index = 0; index < inputList.length; index++) {
                            let item = inputList[index];
                            let tokenname = item['tokenname'];
                            let itembookmarkprice = item['bookmarkprice'];
                            let itemmaxbookmarksupply = item['maxbookmarksupply'];
                            let itembookmarkstartpoint = item['bookmarkstartpoint'];
                            let BMcontract = await getnewBookcontractdata(
                                'BM' + tokenname,
                                'BM' + tokenname,
                                marketPlaceAddress,
                                baseuri,
                                burnable,
                                ethers.utils.parseEther(String(itemmaxbookmarksupply)),
                                web3.utils.toWei(String(itembookmarkprice)),
                                ethers.utils.parseEther(String(itembookmarkstartpoint)),
                                account
                            );
                            
                            const BookTradableBM = new ethers.Contract(BMcontract, booktradable_abi, signer);
                            await BookTradableBM.setRewardContract(BTcontract);
                            await BookTradableBM.setAddon(printingpress_address, true);
                            await BookTradableBM.setAddon(minimart_address, true);

                            await BookTradableBT.setAddon(BMcontract, true);

                            inputList[index]['item_bmcontract_address'] = BMcontract;
                        }
                        form_data.append('bm_listdata', JSON.stringify(inputList));

                        form_data.append('bt_contract_address', BTcontract);
                        form_data.append('hb_contract_address', HBcontract);
                        await axios
                            .put(configData.API_SERVER + 'books/edit/' + bookid, form_data, {
                                headers: {
                                    'content-type': 'multipart/form-data',
                                    Authorization: `${accountinfo.token}`
                                }
                            })
                            .then(function (response) {
                                if (response.status === 201) {
                                    setBooktitle('');
                                    setBooktype('');
                                    setPreviosImg('');
                                    setOrigintype('');
                                    setDatamine('');
                                    // setCurserialnumber('');
                                    setAuthorwallet('');
                                    setAuthorname('');
                                    setBrandimage('');
                                    setIntroduction('');
                                    setBookdescription('');
                                    setHardbounddescription('');
                                    setBookmarkprice('');
                                    setBookprice('');
                                    setHardboundprice('');
                                    setMaxbooksupply('');
                                    setMaxbookmarksupply('');
                                    setMaxhardboundsupply('');
                                    setStartpoint('');
                                    setHardboundStartpoint('');
                                }
                                toast.success('successfully saved', {
                                    position: 'top-right',
                                    autoClose: 3000,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true
                                });
                            })
                            .catch(function (error) {
                                toast.error('failed save data', {
                                    position: 'top-right',
                                    autoClose: 3000,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true
                                });
                            });
                    } catch (error) {
                        setLoading(false);
                        console.log(error);
                    }
                } else {
                    setLoading(false);
                    return false;
                }
            } else {
                try {
                    const BTcontract = await getnewBookcontractdata(
                        'BT' + datamine,
                        'BT' + datamine,
                        marketPlaceAddress,
                        baseuri,
                        burnable,
                        ethers.utils.parseEther(String(maxbooksupply)),
                        web3.utils.toWei(String(bookprice)),
                        ethers.utils.parseEther(String(startpoint)),
                        account
                    );

                    const BookTradableBT = new ethers.Contract(BTcontract, booktradable_abi, signer);
                    //await BookTradable.setRewardContract(BTcontract);

                    await BookTradableBT.setAddon(printingpress_address, true);
                    await BookTradableBT.setAddon(minimart_address, true);

                    const HBcontract = await getnewBookcontractdata(
                        'HB' + datamine,
                        'HB' + datamine,
                        marketPlaceAddress,
                        baseuri,
                        burnable,
                        ethers.utils.parseEther(String(maxhardboundsupply)),
                        web3.utils.toWei(String(hardboundprice)),
                        ethers.utils.parseEther(String(hardboundstartpoint)),
                        account
                    );
                    
                    const BookTradableHB = new ethers.Contract(HBcontract, booktradable_abi, signer);
                    await BookTradableHB.setRewardContract(BTcontract);
                    await BookTradableHB.setAddon(printingpress_address, true);
                    await BookTradableHB.setAddon(minimart_address, true);

                    await BookTradableBT.setAddon(HBcontract, true);

                    for (let index = 0; index < inputList.length; index++) {
                        let item = inputList[index];
                        let tokenname = item['tokenname'];
                        let itembookmarkprice = item['bookmarkprice'];
                        let itemmaxbookmarksupply = item['maxbookmarksupply'];
                        let itembookmarkstartpoint = item['bookmarkstartpoint'];
                        let BMcontract = await getnewBookcontractdata(
                            'BM' + tokenname,
                            'BM' + tokenname,
                            marketPlaceAddress,
                            baseuri,
                            burnable,
                            ethers.utils.parseEther(String(itemmaxbookmarksupply)),
                            web3.utils.toWei(String(itembookmarkprice)),
                            ethers.utils.parseEther(String(itembookmarkstartpoint)),
                            account
                        );

                        const BookTradableBM = new ethers.Contract(BMcontract, booktradable_abi, signer);
                        await BookTradableBM.setRewardContract(BTcontract);
                        await BookTradableBM.setAddon(printingpress_address, true);
                        await BookTradableBM.setAddon(minimart_address, true);

                        await BookTradableBT.setAddon(BMcontract, true);
                        inputList[index]['item_bmcontract_address'] = BMcontract;
                    }
                    form_data.append('bm_listdata', JSON.stringify(inputList));

                    form_data.append('bt_contract_address', BTcontract);
                    form_data.append('hb_contract_address', HBcontract);
                    await axios
                        .post(configData.API_SERVER + 'books/save', form_data, {
                            headers: {
                                'content-type': 'multipart/form-data',
                                Authorization: `${accountinfo.token}`
                            }
                        })
                        .then(function (response) {
                            if (response.status === 201) {
                                history.push('/dashboard/books/edit/' + response.data.id);
                            }
                            toast.success('successfully saved', {
                                position: 'top-right',
                                autoClose: 3000,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true
                            });
                        })
                        .catch(function (error) {
                            toast.error('failed save data', {
                                position: 'top-right',
                                autoClose: 3000,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true
                            });
                        });
                } catch (error) {
                    console.log(error);
                }
            }
        }
        setLoading(false);
    };

    const setAddonBook = async () => {

        setLoading(true);
        const { ethereum } = window;

        const checkavax = window.confirm(
            "If you don't have enough AVAX, book mint may fail. Please check your wallet before minting book. No more than 0.5 AVAX will be needed and the price could be far less depending on congestion. Remember, we are taking no cut of the cost to mint your books."
        );
        if(!checkavax) {
            setLoading(false);
            return;
        }

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();

            try {
                const BookTradableBT = new ethers.Contract(bookcontractaddress, booktradable_abi, signer);
                const BookTradableHB = new ethers.Contract(hardboundcontractaddress, booktradable_abi, signer);
                
                await BookTradableBT.setAddon(printingpress_address, true);
                await BookTradableBT.setAddon(minimart_address, true);

                await BookTradableHB.setAddon(printingpress_address, true);
                await BookTradableHB.setAddon(minimart_address, true);

                await BookTradableBT.setAddon(hardboundcontractaddress, true);
                
                for (let index = 0; index < inputList.length; index++) {
                    let bookmarkcontract_address = inputList[index]['item_bmcontract_address'];
                    if(bookmarkcontract_address === '' || bookmarkcontract_address === null) {
                        toast.error('Please save data at first.', {
                            position: 'top-right',
                            autoClose: 3000,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true
                        });
                    }
                    const BookTradableBM = new ethers.Contract(bookmarkcontract_address, booktradable_abi, signer);
                    await BookTradableBM.setAddon(printingpress_address, true);
                    await BookTradableBM.setAddon(minimart_address, true);

                    await BookTradableBT.setAddon(bookmarkcontract_address, true);
                }
                toast.success('successfully set addon', {
                    position: 'top-right',
                    autoClose: 3000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
            } catch (error) {
                console.log(error);
                toast.error('failed set addon', {
                    position: 'top-right',
                    autoClose: 3000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
                setLoading(false);
            }
        }
        setLoading(false);
    }

    return (
        <MainCard title={title}>
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
            <Link to="/dashboard/booklist">
                <Button variant="outlined">Back To List</Button>
            </Link>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root.input-item': { m: 1, width: '35ch' }
                }}
                noValidate
                autoComplete="off"
            >
                <div>
                    <InputTextField
                        id="book-title"
                        style={{ margin: 8 }}
                        placeholder="Please input the book title"
                        helperText="Book Title"
                        fullWidth
                        className="input-item"
                        InputLabelProps={{
                            shrink: true
                        }}
                        error={errors.booktitle}
                        variant="filled"
                        type="text"
                        val={booktitle}
                        setVal={setBooktitle}
                        errorMsg={'Book title is required.'}
                        isRequired={true}
                    />
                </div>
                <div className="bookimg-select">
                    <img src={previosImg} width="400" alt="" />
                    <label htmlFor="image">
                        <input
                            type="file"
                            style={{ display: 'none' }}
                            id="image"
                            accept="image/png, image/jpeg"
                            onChange={handleFileUpload}
                            required
                        />
                        { curimg ? (<>
                                <p style={{color: 'red'}}>Book cover image is required.</p>
                            </>): (<></>)}
                        <Fab color="secondary" size="small" component="span" aria-label="add" variant="extended">
                            Upload cover image
                        </Fab>
                    </label>
                </div>
                <div>
                    <InputTextField
                        id="authorwallet"
                        style={{ margin: 8 }}
                        placeholder="Please input the author wallet address"
                        helperText="Author Wallet"
                        fullWidth
                        className="input-item"
                        InputLabelProps={{
                            shrink: true
                        }}
                        error={errors.authorwallet}
                        variant="filled"
                        type="text"
                        val={authorwallet}
                        setVal={setAuthorwallet}
                        isRequired={true}
                    />
                    <InputTextField
                        id="author_name"
                        style={{ margin: 8 }}
                        placeholder="Please input the author name"
                        helperText="Author Name"
                        fullWidth
                        className="input-item"
                        InputLabelProps={{
                            shrink: true
                        }}
                        error={errors.authorname}
                        variant="filled"
                        type="text"
                        val={authorname}
                        setVal={setAuthorname}
                        isRequired={true}
                        errorMsg={'Author name is required'}
                    />
                </div>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <InputTextField
                            id="introduction"
                            style={{ margin: 8 }}
                            placeholder="Please input the introduction of book"
                            helperText="Introduction"
                            fullWidth
                            multiline={true}
                            rows={10}
                            InputLabelProps={{
                                shrink: true
                            }}
                            variant="filled"
                            type="text"
                            val={introduction}
                            setVal={setIntroduction}
                        />
                    </Grid>
                </Grid>
                <div>
                    <InputTextField
                        id="datamine"
                        style={{ margin: 8 }}
                        placeholder="Please input the datamine"
                        helperText="DataMine"
                        fullWidth
                        className="input-item"
                        InputLabelProps={{
                            shrink: true
                        }}
                        error={errors.datamine}
                        variant="filled"
                        type="text"
                        val={datamine}
                        setVal={setDatamine}
                        isRequired={true}
                        errorMsg={'Datamine is required.'}
                    />
                    {/* <InputTextField
                        id="curserialnumber"
                        style={{ margin: 8 }}
                        placeholder="Please input the curserial number"
                        helperText="Curserial Number"
                        fullWidth
                        className="input-item"
                        InputLabelProps={{
                            shrink: true
                        }}
                        variant="filled"
                        type="text"
                        val={curserialnumber}
                        setVal={setCurserialnumber}
                    /> */}
                </div>
                <Divider>Book detail</Divider>
                <div>
                    <InputTextField
                        id="bookprice"
                        style={{ margin: 8 }}
                        placeholder="Please input the book price"
                        helperText={`Book Price (~ ${(curavaxprice * bookprice).toFixed(3)} USD)`}
                        fullWidth
                        className="input-item"
                        InputLabelProps={{
                            shrink: true
                        }}
                        error={errors.bookprice}
                        variant="filled"
                        type="number"
                        isDecimal={true}
                        val={bookprice}
                        setVal={setBookprice}
                        isRequired={true}
                        errorMsg={'Book price is required.'}
                    />
                    <InputTextField
                        id="maxbooksupply"
                        style={{ margin: 8 }}
                        placeholder="Please input the max amount of book"
                        helperText="Max Books Supply"
                        fullWidth
                        className="input-item"
                        InputLabelProps={{
                            shrink: true
                        }}
                        error={errors.maxbooksupply}
                        variant="filled"
                        type="number"
                        isDecimal={false}
                        val={maxbooksupply}
                        setVal={setMaxbooksupply}
                        isRequired={true}
                        errorMsg={'Max Books Supply is required.'}
                    />
                    <InputTextField
                        id="startpoint"
                        style={{ margin: 8 }}
                        placeholder="Please input the start point"
                        helperText="Start Point"
                        fullWidth
                        className="input-item"
                        InputLabelProps={{
                            shrink: true
                        }}
                        variant="filled"
                        type="number"
                        val={startpoint}
                        isDecimal={false}
                        setVal={setStartpoint}
                    />
                    <InputTextField
                        id="description"
                        style={{ margin: 8 }}
                        placeholder="Please input book description"
                        helperText="Book Description"
                        fullWidth
                        className="input-item"
                        type="text"
                        InputLabelProps={{
                            shrink: true
                        }}
                        variant="filled"
                        val={bookdescription}
                        setVal={setBookdescription}
                    />
                    <InputTextField
                        id="byteperbookmark"
                        style={{ margin: 8 }}
                        placeholder="Please input byteperbookmark"
                        helperText="Byte per Bookmark"
                        fullWidth
                        className="input-item"
                        type="number"
                        InputLabelProps={{
                            shrink: true
                        }}
                        variant="filled"
                        val={byteperbookmark}
                        setVal={setByteperbookmark}
                    />
                </div>
                <Divider>Hardbound detail</Divider>
                <div>
                    <InputTextField
                        id="hardboundprice"
                        style={{ margin: 8 }}
                        placeholder="Please input the hardbound price"
                        helperText={`Hardbound Price (~ ${(curavaxprice * hardboundprice).toFixed(3)} USD)`}
                        fullWidth
                        className="input-item"
                        type="number"
                        InputLabelProps={{
                            shrink: true
                        }}
                        error={errors.maxhbsupply}
                        variant="filled"
                        val={hardboundprice}
                        setVal={setHardboundprice}
                        isRequired={true}
                        isDecimal={true}
                        errorMsg={'Hardbound price is required.'}
                    />
                    <InputTextField
                        id="hardbound"
                        type="number"
                        style={{ margin: 8 }}
                        placeholder="Please input the hardbound amount"
                        helperText="Max Hardbound supply"
                        fullWidth
                        className="input-item"
                        InputLabelProps={{
                            shrink: true
                        }}
                        error={errors.hbmaxsupply}
                        variant="filled"
                        val={maxhardboundsupply}
                        setVal={setMaxhardboundsupply}
                        isRequired={true}
                        isDecimal={false}
                        errorMsg={'Hardbound max supply is required.'}
                    />
                    <InputTextField
                        id="hardboundstartpoint"
                        // label="Book  Name"
                        style={{ margin: 8 }}
                        placeholder="Please input the Hardbound start point"
                        helperText="Hardbound Start Point"
                        fullWidth
                        className="input-item"
                        type="number"
                        InputLabelProps={{
                            shrink: true
                        }}
                        variant="filled"
                        val={hardboundstartpoint}
                        setVal={setHardboundStartpoint}
                        isDecimal={false}
                    />
                    <InputTextField
                        id="description"
                        style={{ margin: 8 }}
                        placeholder="Please input hardbound description"
                        helperText="Hardbound Description"
                        fullWidth
                        className="input-item"
                        type="text"
                        InputLabelProps={{
                            shrink: true
                        }}
                        variant="filled"
                        val={hardbounddescription}
                        setVal={setHardbounddescription}
                    />
                </div>
                {<BookAddItem inputList={inputList} setInputList={setInputList} avaxprice={curavaxprice} />}
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <FormControl className="mui-formcontrol" fullWidth>
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
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl className="mui-formcontrol" fullWidth>
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
                    </Grid>
                </Grid>
                {bookid > 0 ? (
                    <div>
                        <Button variant="contained" onClick={() => saveBook()}>
                            Mint Book
                        </Button>
                        &nbsp;
                        <Button variant="contained" onClick={() => saveBookInfo()}>
                            Save Book detail Information
                        </Button>
                        &nbsp;
                        <Button variant="contained" onClick={() => savePrice()}>
                            Update Price Wizard
                        </Button>
                        &nbsp;
                        <Button variant="contained" onClick={() => saveDefaultWizard()}>
                            Update Defaults Wizard
                        </Button>
                        &nbsp;
                        <Button variant="contained" onClick={() => saveMaxmintWizard()}>
                            Update Maxmint Wizard
                        </Button>
                        &nbsp;
                        <Button variant="contained" onClick={() => setAddonBook()}>
                            Set Addon Wizard
                        </Button>
                        &nbsp;
                    </div>
                ) : (
                    <div>
                        <Button variant="contained" onClick={() => saveBook()}>
                            Mint Book
                        </Button>
                        &nbsp;
                    </div>
                )}
            </Box>
            {showrevocation ? 
                (
                    <>
                        <br />
                        <AddonRevocation />
                    </>
                ): 
                (<></>)
            }
            
        </MainCard>
    );
};

export default BookAdd;