import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

// material-ui
import { Button, Box, TextField, Stack, Autocomplete } from '@material-ui/core';
import MainCard from '../../../ui-component/cards/MainCard';
import configData from '../../../config';

const BookAdd = (props) => {
    const { id } = useParams();
    const [booktitle, setBooktitle] = useState('');
    const [title, setTitle] = useState('Book Add');
    const [brandimage, setBrandimage] = useState(null);
    const [authorwallet, setAuthorwallet] = useState('');
    const [curserialnumber, setCurserialnumber] = useState('');
    const [datamine, setDatamine] = useState('');
    const [booktype, setBooktype] = useState('');
    const [origintype, setOrigintype] = useState('');
    const [booktypes, setBooktypes] = useState('');
    const [origintypes, setOrigintypes] = useState('');
    const [previosImg, setPreviosImg] = useState('');

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
            await axios
                .post(configData.API_SERVER + 'books/save', form_data, {
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                })
                .then(function (response) {
                    if (response.success === 201) {
                        setBooktitle('');
                        setBooktype('');
                        setOrigintype('');
                        setDatamine('');
                        setCurserialnumber('');
                        setAuthorwallet('');
                        setBrandimage('');
                    } else {
                        setBooktitle('');
                        setBooktype('');
                        setOrigintype('');
                        setDatamine('');
                        setCurserialnumber('');
                        setAuthorwallet('');
                        setBrandimage('');
                    }
                })
                .catch(function (error) {});
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
                {/* <FormControl fullWidth>
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
                </FormControl> */}
                <Stack spacing={2} 
                // sx={{ width: 300 }}
                >
                    <Autocomplete
                        id="booktype-select"
                        freeSolo
                        onChange={(e) => setBooktype(e.target.value)}
                        options={booktypes.map((option) => option.booktype)}
                        renderInput={(params) => <TextField {...params} label="Book Type" />}
                    />
                    <Autocomplete
                        freeSolo
                        onChange={(e) => setOrigintype(e.target.value)}
                        id="origintype-select"
                        // disableClearable
                        options={origintypes.map((option) => option.origintype)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Origin Type"
                                InputProps={{
                                    ...params.InputProps,
                                    type: 'search'
                                }}
                            />
                        )}
                    />
                </Stack>
                <Button variant="contained" onClick={() => saveBook()}>
                    Save
                </Button>
            </Box>
        </MainCard>
    );
};

export default BookAdd;
