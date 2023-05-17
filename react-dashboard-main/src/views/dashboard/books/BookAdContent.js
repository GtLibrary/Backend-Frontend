import React, { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";

// material-ui
import { Grid, Button, Box, Stack, FormControlLabel, Checkbox, TextField } from '@material-ui/core';
// project imports
import MainCard from '../../../ui-component/cards/MainCard';
import { gridSpacing } from '../../../store/constant';
import configData from '../../../config';
import "./styles.css";

//==============================|| book content ||==============================//

const BookAdContent = (props) => {
    const { id } = useParams();
    const [ title, setTitle ] = useState('Book Ad Content Edit');
    const [checked, setChecked] = useState(false);
    const [adcontentdata, setAdcontentdata] = useState({})
    const [client, setClient] = useState("");
    const [slot, setSlot] = useState("");
    const [format, setFormat] = useState("");
    const [layout, setLayout] = useState("");
    const accountinfo = useSelector((state) => state.account);

    const getBookcontentById = async () => {
        const { data } = await axios
            .get( configData.API_SERVER + 'books/edit/' + id,
            {headers: { Authorization: `${accountinfo.token}` }})
        setAdcontentdata(data.adcontent)
        setChecked(data.is_ads)
    }

    const updateBookcontent = async () => {
        const adcontent = {
            client: client,
            slot: slot,
            format: format,
            layput: layout
        }
        await axios
            .put( configData.API_SERVER + 'books/edit/' + id, {
                is_ads: checked,
                adcontent: JSON.stringify(adcontent)
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

    const saveAdscontent = () => {
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
                                id="client"
                                style={{ margin: 8 }}
                                placeholder="Please input google ads client id"
                                helperText="Client"
                                fullWidth 
                                InputLabelProps={{
                                    shrink: true
                                }}
                                variant="filled"
                                value={adcontentdata.client ? adcontentdata.client: ""}
                                onChange={(e) => {
                                    setClient(e.target.value);
                                }}
                        />
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <TextField
                                id="slot"
                                style={{ margin: 8 }}
                                placeholder="Please input Ads slot"
                                helperText="Slot"
                                fullWidth 
                                InputLabelProps={{
                                    shrink: true
                                }}
                                variant="filled"
                                value={adcontentdata.slot ? adcontentdata.slot: ""}
                                onChange={(e) => {
                                    setSlot(e.target.value);
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <TextField
                                id="format"
                                style={{ margin: 8 }}
                                placeholder="Please input Ads format"
                                helperText="Format"
                                fullWidth 
                                InputLabelProps={{
                                    shrink: true
                                }}
                                variant="filled"
                                value={adcontentdata.format ? adcontentdata.format: ""}
                                onChange={(e) => {
                                    setFormat(e.target.value);
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <TextField
                                id="layout"
                                style={{ margin: 8 }}
                                placeholder="Please input Ads layout"
                                helperText="Layout"
                                fullWidth 
                                InputLabelProps={{
                                    shrink: true
                                }}
                                variant="filled"
                                value={adcontentdata.layout ? adcontentdata.layout: ""}
                                onChange={(e) => {
                                    setLayout(e.target.value);
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Box display="flex" flexDirection="row-reverse" p={1} m={1} bgcolor="background.paper">
                        <Button variant="contained" onClick={() => saveAdscontent()}>Save</Button>
                    </Box>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default BookAdContent;