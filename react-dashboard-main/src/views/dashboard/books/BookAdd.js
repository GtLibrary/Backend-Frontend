import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Web3 from 'web3';
import LoadingOverlay from 'react-loading-overlay';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { useSelector } from 'react-redux';
// material-ui
import { Button, Box, TextField, FormControl, InputLabel, Select, MenuItem, Fab, Divider, Grid } from '@material-ui/core';
// project imports
import MainCard from '../../../ui-component/cards/MainCard';
import BookAddItem from './BookAddItem';
import configData from '../../../config';
import './styles.css';

import printingpress_abi from './../../../contract-json/PrintingPress.json';
import booktradable_abi from './../../../contract-json/BookTradable.json';

LoadingOverlay.propTypes = undefined;

const BookAdd = (props) => {
    const onlythreedecimal = /^([0-9]{0,3}(\.[0-9]{0,3})?|\s*)$/
    const onlyinteger = /^\d+(,\d{0,3})?$/
    const printingpress_address = process.env.REACT_APP_PRINTINGPRESSADDRESS;
    const minimart_address = process.env.REACT_APP_MINIMARTADDRESS;
    const marketPlaceAddress = process.env.REACT_APP_MARKETPLACEADDRESS;
    const baseuri = process.env.REACT_APP_API + 'nft/';
    const burnable = true;

    const { bookid } = useParams();
    const { account } = useWeb3React();
    const printpress_abi = printingpress_abi;
    const accountinfo = useSelector((state) => state.account);

    const [booktitle, setBooktitle] = useState('');
    const [bookcontractaddress, setBookcontractaddress] = useState('');
    const [hardboundcontractaddress, setHardboundcontractaddress] = useState('');
    const [title, setTitle] = useState('Add New Book');
    const [brandimage, setBrandimage] = useState(null);
    const [authorwallet, setAuthorwallet] = useState(account);
    const [authorname, setAuthorname] = useState('');
    const [curserialnumber, setCurserialnumber] = useState('');
    const [datamine, setDatamine] = useState('');
    const [introduction, setIntroduction] = useState('');
    const [bookdescription, setBookdescription] = useState('');
    const [hardbounddescription, setHardbounddescription] = useState('');
    const [maxbooksupply, setMaxbooksupply] = useState(0);
    const [maxbookmarksupply, setMaxbookmarksupply] = useState(0);
    const [maxhardboundsupply, setMaxhardboundsupply] = useState(0);
    const [startpoint, setStartpoint] = useState(0);
    const [hardboundstartpoint, setHardboundStartpoint] = useState(0);
    const [bookprice, setBookprice] = useState(0);
    const [bookmarkprice, setBookmarkprice] = useState(0);
    const [hardboundprice, setHardboundprice] = useState(0);
    const [booktype, setBooktype] = useState(0);
    const [origintype, setOrigintype] = useState(0);
    const [booktypes, setBooktypes] = useState([]);
    const [origintypes, setOrigintypes] = useState([]);
    const [previosImg, setPreviosImg] = useState('');
    const [loading, setLoading] = useState(false);
    const [inputList, setInputList] = useState([
        { tokenname: '', bookmarkprice: 0, maxbookmarksupply: 0, bookmarkstartpoint: 0, item_bmcontract_address: '' }
    ]);

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
        setCurserialnumber(data.curserial_number);
        setAuthorwallet(data.author_wallet);
        setAuthorname(data.author_name);
        setIntroduction(data.introduction);
        setBookprice(data.book_price);
        setBookmarkprice(data.bookmark_price);
        setHardboundprice(data.hardbound_price);
        setMaxbooksupply(data.max_book_supply);
        setMaxbookmarksupply(data.max_bookmark_supply);
        setMaxhardboundsupply(data.max_hardbound_supply);
        setStartpoint(data.book_from);
        setHardboundStartpoint(data.hardbound_from);
        setPreviosImg(data.image_url);
        setBookcontractaddress(data.bt_contract_address);
        setHardboundcontractaddress(data.hb_contract_address);
        setInputList(data.bm_listdata);
    };

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
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
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
                    const BookTradable = new ethers.Contract(BMcontract, booktradable_abi, signer);
                    await BookTradable.setRewardContract(bookcontractaddress)
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
                    web3.utils.toWei(itembookmarkprice),
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
                    web3.utils.toWei(itembookmarkprice),
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
        
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            let form_data = new FormData();
            if (brandimage) {
                form_data.append('image_url', brandimage, brandimage.name);
            }

            form_data.append('title', booktitle);
            form_data.append('author_wallet', authorwallet);
            form_data.append('author_name', authorname);
            form_data.append('introduction', introduction);
            form_data.append('curserial_number', curserialnumber);
            form_data.append('datamine', datamine);
            form_data.append('origin_type_id', origintype);
            form_data.append('book_type_id', booktype);
            form_data.append('book_price', bookprice);
            form_data.append('book_description', bookdescription);
            form_data.append('hardbound_description', hardbounddescription);
            form_data.append('bookmark_price', bookmarkprice);
            form_data.append('hardbound_price', hardboundprice);
            form_data.append('max_book_supply', maxbooksupply);
            form_data.append('max_bookmark_supply', maxbookmarksupply);
            form_data.append('max_hardbound_supply', maxhardboundsupply);
            form_data.append('book_from', startpoint);
            form_data.append('hardbound_from', hardboundstartpoint);
            if (bookid) {
                if (
                    window.confirm(
                        'If you proceed you risk destroying your current book/bookmark. Consider updating your token instead. Proceed: (y)es/(n)o?'
                    )
                ) {
                    try {
                        const BTcontract = await getnewBookcontractdata(
                            'BT' + datamine,
                            'BT' + datamine,
                            marketPlaceAddress,
                            baseuri,
                            burnable,
                            ethers.utils.parseEther(String(maxbooksupply)),
                            web3.utils.toWei(bookprice),
                            ethers.utils.parseEther(String(startpoint)),
                            account
                        );
                        const BookTradable = new ethers.Contract(BTcontract, booktradable_abi, signer);
                        await BookTradable.setRewardContract(BTcontract)

                        const HBcontract = await getnewBookcontractdata(
                            'HB' + datamine,
                            'HB' + datamine,
                            marketPlaceAddress,
                            baseuri,
                            burnable,
                            ethers.utils.parseEther(String(maxhardboundsupply)),
                            web3.utils.toWei(hardboundprice),
                            ethers.utils.parseEther(String(hardboundstartpoint)),
                            account
                        );

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
                                web3.utils.toWei(itembookmarkprice),
                                ethers.utils.parseEther(String(itembookmarkstartpoint)),
                                account
                            );
                            // const BookTradable = new ethers.Contract(BMcontract, booktradable_abi, signer);
                            // await BookTradable.setRewardContract(bookcontractaddress)
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
                                    setCurserialnumber('');
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
                        web3.utils.toWei(bookprice),
                        ethers.utils.parseEther(String(startpoint)),
                        account
                    );
                    const BookTradable = new ethers.Contract(BTcontract, booktradable_abi, signer);

                    await BookTradable.setRewardContract(BTcontract);

                    const HBcontract = await getnewBookcontractdata(
                        'HB' + datamine,
                        'HB' + datamine,
                        marketPlaceAddress,
                        baseuri,
                        burnable,
                        ethers.utils.parseEther(String(maxhardboundsupply)),
                        web3.utils.toWei(hardboundprice),
                        ethers.utils.parseEther(String(hardboundstartpoint)),
                        account
                    );

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
                            web3.utils.toWei(itembookmarkprice),
                            ethers.utils.parseEther(String(itembookmarkstartpoint)),
                            account
                        );
                        // const BookTradable = new ethers.Contract(BMcontract, booktradable_abi, signer);
                        // await BookTradable.setRewardContract(bookcontractaddress)
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
                                setBooktitle('');
                                setBooktype('');
                                setPreviosImg('');
                                setOrigintype('');
                                setDatamine('');
                                setCurserialnumber('');
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
                    console.log(error);
                }
            }
        }
        setLoading(false);
    };

    const setaddon = async () => {
        setLoading(true);
        const { ethereum } = window;
        
        if (ethereum) {
            try {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const BookTradable = new ethers.Contract(bookcontractaddress, booktradable_abi, signer);
                const HardBound = new ethers.Contract(hardboundcontractaddress, booktradable_abi, signer);
    
                await BookTradable.setAddon(printingpress_address, true);
                await BookTradable.setAddon(minimart_address, true);
                await HardBound.setAddon(printingpress_address, true);
                await HardBound.setAddon(minimart_address, true);
    
                for (let index = 0; index < inputList.length; index++) {
                    let bmcontractaddress = inputList[index]['item_bmcontract_address']
                    const Bookmark = new ethers.Contract(bmcontractaddress, booktradable_abi, signer);
                    await Bookmark.setAddon(printingpress_address, true)
                    await Bookmark.setAddon(minimart_address, true);
                }
            } catch (error) {
                console.log(error);
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
                    <TextField
                        id="book-title"
                        style={{ margin: 8 }}
                        placeholder="Please input the book title"
                        helperText="Book Title"
                        fullWidth
                        className="input-item"
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
                        <Fab color="secondary" size="small" component="span" aria-label="add" variant="extended">
                            Upload photo
                        </Fab>
                    </label>
                </div>
                <div>
                    <TextField
                        id="authorwallet"
                        style={{ margin: 8 }}
                        placeholder="Please input the author wallet address"
                        helperText="Author Wallet"
                        fullWidth
                        className="input-item"
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
                        id="author_name"
                        style={{ margin: 8 }}
                        placeholder="Please input the author name"
                        helperText="Author Name"
                        fullWidth
                        className="input-item"
                        InputLabelProps={{
                            shrink: true
                        }}
                        variant="filled"
                        value={authorname}
                        onChange={(e) => {
                            setAuthorname(e.target.value);
                        }}
                    />
                </div>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <TextField
                            id="introduction"
                            style={{ margin: 8 }}
                            placeholder="Please input the introduction of book"
                            helperText="Introduction"
                            fullWidth
                            multiline
                            rows={10}
                            InputLabelProps={{
                                shrink: true
                            }}
                            variant="filled"
                            value={introduction}
                            onChange={(e) => {
                                setIntroduction(e.target.value);
                            }}
                        />
                    </Grid>
                </Grid>
                <div>
                    <TextField
                        id="datamine"
                        style={{ margin: 8 }}
                        placeholder="Please input the datamine"
                        helperText="DataMine"
                        fullWidth
                        className="input-item"
                        InputLabelProps={{
                            shrink: true
                        }}
                        variant="filled"
                        value={datamine}
                        onChange={(e) => {
                            setDatamine(e.target.value);
                        }}
                    />
                    <TextField
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
                        value={curserialnumber}
                        onChange={(e) => {
                            setCurserialnumber(e.target.value);
                        }}
                    />
                </div>
                <Divider>Book detail</Divider>
                <div>
                    <TextField
                        id="bookprice"
                        style={{ margin: 8 }}
                        placeholder="Please input the book price"
                        helperText="Book Price"
                        fullWidth
                        className="input-item"
                        type="number"
                        InputLabelProps={{
                            shrink: true
                        }}
                        variant="filled"
                        value={bookprice}
                        onChange={(e) => {
                            if(onlythreedecimal.test(e.target.value)) {
                                // if (e.target.value >= 0) {
                                    setBookprice(e.target.value);
                                // } else {
                                //     setBookprice(0);
                                // }
                            }
                        }}
                    />
                    <TextField
                        id="maxbooksupply"
                        style={{ margin: 8 }}
                        placeholder="Please input the max amount of book"
                        helperText="Max Books Supply"
                        fullWidth
                        className="input-item"
                        type="number"
                        InputLabelProps={{
                            shrink: true
                        }}
                        variant="filled"
                        value={maxbooksupply}
                        onChange={(e) => {
                            if(onlyinteger.test(e.target.value)){
                                if (e.target.value >= 0) {
                                    setMaxbooksupply(e.target.value);
                                } else {
                                    setMaxbooksupply(0);
                                }
                            }
                        }}
                    />
                    <TextField
                        id="startpoint"
                        style={{ margin: 8 }}
                        placeholder="Please input the start point"
                        helperText="Start Point"
                        fullWidth
                        className="input-item"
                        type="number"
                        InputLabelProps={{
                            shrink: true
                        }}
                        variant="filled"
                        value={startpoint}
                        onChange={(e) => {
                            if(onlyinteger.test(e.target.value)){
                                if (e.target.value >= 0) {
                                    setStartpoint(e.target.value);
                                } else {
                                    setStartpoint(0);
                                }
                            }
                        }}
                    />
                    <TextField
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
                        value={bookdescription}
                        onChange={(e) => {
                            setBookdescription(e.target.value);
                        }}
                    />
                </div>
                <Divider>Hardbound detail</Divider>
                <div>
                    <TextField
                        id="hardboundprice"
                        style={{ margin: 8 }}
                        placeholder="Please input the hardbound price"
                        helperText="Hardbound Price"
                        fullWidth
                        className="input-item"
                        type="number"
                        InputLabelProps={{
                            shrink: true
                        }}
                        variant="filled"
                        value={hardboundprice}
                        onChange={(e) => {
                            if(onlythreedecimal.test(e.target.value)){
                                if (e.target.value >= 0) {
                                    setHardboundprice(e.target.value);
                                } else {
                                    setHardboundprice(0);
                                }
                            }
                        }}
                    />
                    <TextField
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
                        variant="filled"
                        value={maxhardboundsupply}
                        onChange={(e) => {
                            if(onlyinteger.test(e.target.value)){
                                if (e.target.value >= 0) {
                                    setMaxhardboundsupply(e.target.value);
                                } else {
                                    setMaxhardboundsupply(0);
                                }
                            }
                        }}
                    />
                    <TextField
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
                        value={hardboundstartpoint}
                        onChange={(e) => {
                            if(onlyinteger.test(e.target.value)){
                                if (e.target.value >= 0) {
                                    setHardboundStartpoint(e.target.value);
                                } else {
                                    setHardboundStartpoint(0);
                                }
                            }
                        }}
                    />
                    <TextField
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
                        value={hardbounddescription}
                        onChange={(e) => {
                            setHardbounddescription(e.target.value);
                        }}
                    />
                </div>
                {<BookAddItem inputList={inputList} setInputList={setInputList} />}
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
                        <Button variant="contained" onClick={() => setaddon()}>
                            Set Addon
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
        </MainCard>
    );
};

export default BookAdd;
