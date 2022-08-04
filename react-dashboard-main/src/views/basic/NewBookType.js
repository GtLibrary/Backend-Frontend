import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

// material-ui
import { Grid, Button, Box, TextField } from '@material-ui/core';
import { IconEye, IconEdit, IconTrash } from '@tabler/icons';

// project imports
import MainCard from '../../ui-component/cards/MainCard';
import { gridSpacing } from '../../store/constant';
import configData from '../../config';

//==============================|| Book Type ||==============================//
const Icons = {
    IconEye: IconEye, 
    IconEdit: IconEdit, 
    IconTrash: IconTrash
}

const NewBookType = () => {
    const [ booktype, setBooktype ] = useState('');

    const saveBooktype = () => {
        axios
            .post( configData.API_SERVER + 'booktype/save', {
                booktype: booktype
            })
            .then(function (response) {
                if (response.data.success) {
                    console.log(response.data.success)
                } else {
                    console.log("error page")
                }
            })
            .catch(function (error) {
                console.log("catch error === ")
            });
    }

    return (
        <MainCard title="Book Type">
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} sm={12}>
                    <Box display="flex" flexDirection="row-reverse" p={1} m={1} bgcolor="background.paper">
                        <Link to="/basic/basic-booktype">
                            <Button variant="outlined">Back To List</Button>
                        </Link>
                    </Box>
                    <Box display="flex" p={1} m={1} bgcolor="background.paper">
                        <TextField
                            id="booktype-name"
                            // label="Book Type Name"
                            style={{ margin: 8 }}
                            placeholder="Please input the book type name"
                            helperText="Book Type Name"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            onChange={(e)=> { setBooktype(e.target.value) }}
                        />
                    </Box>
                    <Box display="flex" flexDirection="row-reverse" p={1} m={1} bgcolor="background.paper">
                        <Button variant="contained" onClick={saveBooktype()}>Save</Button>
                    </Box>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default NewBookType;
