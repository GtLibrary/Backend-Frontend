import React, { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import axios from 'axios';
import { useSelector } from 'react-redux';

// material-ui
import { Grid, Button, Box, TextField } from '@material-ui/core';
// project imports
import MainCard from '../../ui-component/cards/MainCard';
import { gridSpacing } from '../../store/constant';
import configData from '../../config';

//==============================|| Origin Type ||==============================//

const NewOriginType = (props) => {
    const { id } = useParams();
    const accountinfo = useSelector((state) => state.account);
    const [ origintype, setOrigintype ] = useState('');
    const [ title, setTitle ] = useState('Origin Type Add');

    const getOrigintypesById = async () => {
        const { data } = await axios
            .get( configData.API_SERVER + 'origintype/edit/' + id,
            { headers: { Authorization: `${accountinfo.token}` } })
        setOrigintype(data.origintype)
    }

    const updateOrigintype = async () => {
        const { data } = await axios
            .put( configData.API_SERVER + 'origintype/edit/' + id, {
                origintype: origintype
            },
            { headers: { Authorization: `${accountinfo.token}` } })
    }

    useEffect(() => {
        if (id) {
            getOrigintypesById()
            setTitle("Origin Type Edit")
        }
    }, [])

    const saveOrigintype = () => {
        if(id) {
            updateOrigintype()
        } else {
            axios
                .post( configData.API_SERVER + 'origintype/save', {
                    origintype: origintype
                },
                { headers: { Authorization: `${accountinfo.token}` } })
                .then(function (response) {
                    if (response.success == 201) {
                        setOrigintype("")
                    } else {    
                        setOrigintype("")
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
                        <Link to="/basic/basic-origintype">
                            <Button variant="outlined">Back To List</Button>
                        </Link>
                    </Box>
                    <Box display="flex" p={1} m={1} bgcolor="background.paper">
                        <TextField
                            id="origintype-name"
                            // label="origin Type Name"
                            style={{ margin: 8 }}
                            placeholder="Please input the origin type name"
                            helperText="Origin Type Name"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            value={origintype}
                            onChange={(e)=> { setOrigintype(e.target.value) }}
                        />
                    </Box>
                    <Box display="flex" flexDirection="row-reverse" p={1} m={1} bgcolor="background.paper">
                        <Button variant="contained" onClick={() => saveOrigintype()}>Save</Button>
                    </Box>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default NewOriginType;
