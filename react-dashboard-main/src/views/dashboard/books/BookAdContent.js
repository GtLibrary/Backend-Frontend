import React, { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";

// material-ui
import { Grid, Button, Box, Stack, FormControlLabel, Checkbox, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
// toast message
// project imports
import MainCard from '../../../ui-component/cards/MainCard';
import { gridSpacing } from '../../../store/constant';
import configData from '../../../config';
import "./styles.css";

//==============================|| book content ||==============================//

const useStyles = makeStyles((theme) => ({
    maincontent: {
        height: 'calc(100vh - 210px)',
        overflowY: 'scroll',
    }
}));

const BookAdContent = (props) => {
    const { id } = useParams();
    const [ bookcontent, setBookcontent ] = useState('');
    const [ title, setTitle ] = useState('Book Ad Content Edit');
    const [checked, setChecked] = useState(false);
    const accountinfo = useSelector((state) => state.account);
    const classes = useStyles();

    const getBookcontentById = async () => {
        const { data } = await axios
            .get( configData.API_SERVER + 'books/edit/' + id,
            {headers: { Authorization: `${accountinfo.token}` }})
        setBookcontent(data.adcontent)
        setChecked(data.is_ads)
    }

    const updateBookcontent = async () => {
        await axios
            .put( configData.API_SERVER + 'books/edit/' + id, {
                is_ads: checked,
                adcontent: bookcontent
            },
            {headers: { Authorization: `${accountinfo.token}` }})
            .then(res => {
                toast.success("successfully save data", {
                    position: "top-right",
                    autoClose: 3000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            })
            .catch(error =>{
                toast.error("failed save book data", {
                    position: "top-right",
                    autoClose: 3000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            })
        
    }

    useEffect(() => {
        if (id) {
            getBookcontentById()
            setTitle("Book Ad Content Edit")
        }
    }, [])

    const saveBookcontent = () => {
        updateBookcontent()
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
                        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={checked}
                                        onChange={(event) => setChecked(event.target.checked)}
                                        name="checked"
                                        color="primary"
                                    />
                                }
                                label="Free with Ads"
                            />
                        </Stack>
                    </Box>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <TextField
                                id="introduction"
                                style={{ margin: 8 }}
                                placeholder="Please input Ads manual script"
                                helperText="Ads content"
                                fullWidth  
                                multiline
                                rows={10}
                                maxRows={20}
                                InputLabelProps={{
                                    shrink: true
                                }}
                                variant="filled"
                                value={bookcontent}
                                onChange={(e) => {
                                    setBookcontent(e.target.value);
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Box display="flex" flexDirection="row-reverse" p={1} m={1} bgcolor="background.paper">
                        <Button variant="contained" onClick={() => saveBookcontent()}>Save</Button>
                    </Box>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default BookAdContent;
