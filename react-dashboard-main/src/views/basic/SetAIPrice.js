import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

// material-ui
import { Grid, Button, Box, TextField } from '@material-ui/core';
// project imports
import MainCard from '../../ui-component/cards/MainCard';
import { gridSpacing } from '../../store/constant';
import configData from '../../config';

//==============================|| AI Price ||==============================//

const SetAIPrice = (props) => {
    const accountinfo = useSelector((state) => state.account);
    const [ aiprice, setAIPrice ] = useState('');

    const getAIPrices = async () => {
        const { data } = await axios
            .get( configData.API_SERVER + 'getaiprice',
            { headers: { Authorization: `${accountinfo.token}` } })
        setAIPrice(data)
    }

    useEffect(() => {
        getAIPrices()
    }, [])

    const saveAIPrice = () => {
        axios
            .post( configData.API_SERVER + 'setaiprice', {
                aiprice: aiprice
            },
            { headers: { Authorization: `${accountinfo.token}` } })
            .then(function (response) {
                if (response.success === 201) {
                    
                }
            })
            .catch(function (error) {
                console.log("catch error === ", error)
            });
    }

    return (
        <MainCard title="Set OpenAI Price">
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} sm={12}>
                    <Box display="flex" p={1} m={1} bgcolor="background.paper">
                        <TextField
                            id="aiprice"
                            // label="Book Type Name"
                            style={{ margin: 8 }}
                            placeholder="Please input the OpenAI price per call"
                            helperText="OpenAI Price"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            value={aiprice}
                            onChange={(e)=> { setAIPrice(e.target.value) }}
                        />
                    </Box>
                    <Box display="flex" flexDirection="row-reverse" p={1} m={1} bgcolor="background.paper">
                        <Button variant="contained" onClick={() => saveAIPrice()}>Save</Button>
                    </Box>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default SetAIPrice;
