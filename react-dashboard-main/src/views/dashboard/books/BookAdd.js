import React, { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import axios from 'axios';

// material-ui
import { Grid, Button, Box, TextField, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { IconEye, IconEdit, IconTrash } from '@tabler/icons';
// toast message
// project imports
import MainCard from '../../../ui-component/cards/MainCard';
import { gridSpacing } from '../../../store/constant';
import configData from '../../../config';
// import UploadFiles from '../../../ui-component/uploadfiles'

//==============================|| Book  ||==============================//
const Icons = {
    IconEye: IconEye, 
    IconEdit: IconEdit, 
    IconTrash: IconTrash
}

const BookAdd = (props) => {
    const { id } = useParams();
    const [ book, setBook ] = useState('');
    const [ title, setTitle ] = useState('Book Add');
    const [ brandimage, setBrandimage ] = useState(null);
    const [ authorwallet, setAuthorwallet ] = useState('');
    const [ curserialnumber, setCurserialnumber ] = useState('');
    const [ datamine, setDatamine ] = useState('');
    const [ booktype, setBooktype ] = useState('');
    const [ origintype, setOrigintype ] = useState('');
    const [ booktypes, setBooktypes ] = useState('');
    const [ origintypes, setOrigintypes ] = useState('');

    const getBooksById = async () => {
        const { data } = await axios
            .get( configData.API_SERVER + 'books/edit/' + id)
        setBook(data.book)
    }

    const updateBook = async () => {
        const { data } = await axios
            .put( configData.API_SERVER + 'books/edit/' + id, {
                book: book
            })
    }

    useEffect(() => {
        if (id) {
            getBooksById()
            setTitle("Book Edit")
        }
    }, [])

    const getBooktypes = async () => {
        const { data } = await axios.get(configData.API_SERVER + 'booktype/list');
        setBooktypes(data);
    };

    useEffect(() => {
        getBooktypes();
    }, []);

    const getOrigintypes = async () => {
        const { data } = await axios.get(configData.API_SERVER + 'origintype/list');
        setOrigintypes(data);
    };

    useEffect(() => {
        getOrigintypes();
    }, []);

    const saveBook = () => {
        if(id) {
            updateBook()
        } else {
            axios
                .post( configData.API_SERVER + 'books/save', {
                    book: book
                })
                .then(function (response) {
                    if (response.success == 201) {
                        setBook("")
                    } else {    
                        setBook("")
                    }
                })
                .catch(function (error) {
                    console.log("catch error === ")
                });
        }
    }

    return (
        <MainCard title={title}>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} sm={12}>
                    <Box display="flex" flexDirection="row-reverse" p={1} m={1} bgcolor="background.paper">
                        <Link to="/dashboard/booklist">
                            <Button variant="outlined">Back To List</Button>
                        </Link>
                    </Box>
                    <Box display="flex" p={1} m={1} bgcolor="background.paper">
                        <TextField
                            id="book-title"
                            // label="Book  Name"
                            style={{ margin: 8 }}
                            placeholder="Please input the book title"
                            helperText="Book Title"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            value={book}
                            onChange={(e)=> { setBook(e.target.value) }}
                        />
                    </Box>
                    <Box display="flex" p={1} m={1} bgcolor="background.paper">
                        {/* <img src={URL.createObjectURL(brandimage)} width="200" height="200" /> */}
                        <input type="file" id="image" accept="image/png, image/jpeg"  onChange={(e) => setBrandimage(e.target.files[0])} required/>
                    </Box>
                    <Box>
                        <TextField
                            id="authorwallet"
                            // label="Book  Name"
                            style={{ margin: 8 }}
                            placeholder="Please input the author wallet address"
                            helperText="Author Wallet"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            value={authorwallet}
                            onChange={(e)=> { setAuthorwallet(e.target.value) }}
                        />
                    </Box>
                    <Box>
                        <TextField
                            id="curserialnumber"
                            // label="Book  Name"
                            style={{ margin: 8 }}
                            placeholder="Please input the curserial number"
                            helperText="Curserial Number"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            value={curserialnumber}
                            onChange={(e)=> { setCurserialnumber(e.target.value) }}
                        />
                    </Box>
                    <Box>
                        <TextField
                            id="datamine"
                            // label="Book  Name"
                            style={{ margin: 8 }}
                            placeholder="Please input the author wallet address"
                            helperText="DataMine"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            value={datamine}
                            onChange={(e)=> { setDatamine(e.target.value) }}
                        />
                    </Box>
                    {/* <Box> */}
                        <FormControl fullWidth>
                            <InputLabel id="booktype">Book Type</InputLabel>
                            <Select
                                labelId="booktype"
                                id="booktype-select"
                                value={booktype}
                                label="Book Type"
                                onChange={(e) => setBooktype(e.target.value)}
                            >
                                { booktypes && booktypes.map((item) => {
                                    return (
                                        <MenuItem value={item.id}>{item.booktype}</MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                    {/* </Box> */}
                    {/* <Box> */}
                        <FormControl fullWidth>
                            <InputLabel id="origintype">Origin Type</InputLabel>
                            <Select
                                labelId="origintype"
                                id="origintype-select"
                                value={origintype}
                                label="Origin Type"
                                onChange={(e) => setOrigintype(e.target.value)}
                            >
                            { origintypes && origintypes.map((item) => {
                                return (
                                    <MenuItem value={item.id}>{item.origintype}</MenuItem>
                                )
                            })}
                            </Select>
                        </FormControl>
                    {/* </Box> */}
                    <Box display="flex" flexDirection="row-reverse" p={1} m={1} bgcolor="background.paper">
                        <Button variant="contained" onClick={() => saveBook()}>Save</Button>
                    </Box>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default BookAdd;
