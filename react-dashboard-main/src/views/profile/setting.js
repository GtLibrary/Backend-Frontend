import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from "react-toastify";
import configData from '../../config';
import "./styles.css"

// material-ui
import { Button, Box, TextField, Input, Fab } from '@material-ui/core';
// import { Button, Box } from '@material-ui/core';

// project imports
import MainCard from '../../ui-component/cards/MainCard';

const ProfileSetting = () => {
    const accountinfo = useSelector((state) => state.account);
    const [brandimage, setBrandimage] = useState('');
    const [previosImg, setPreviosImg] = useState('/images/no-image.png');
    const username = accountinfo.user.username;
    const email = accountinfo.user.email;
    const getcurBalance = async () => {
        await axios
            .get(
                configData.API_SERVER + 'wallet_info',
                { headers: { Authorization: `${accountinfo.token}` } }
            )
            .then((response) => {
                
            });
    };
    useEffect(() => {
        // getcurBalance();
    }, []);

    const handleFileUpload = (event) => {
        setBrandimage(event.target.files[0]);
        setPreviosImg(URL.createObjectURL(event.target.files[0]));
    };

    const Savedata = async () => {

    };

    return (
        <MainCard title="Profile">
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '50ch' }
                }}
                noValidate
                autoComplete="off"
            >
                <div className="bookimg-select">
                    <img src={previosImg} style={{ width: '160px', height:'160px', borderRadius: '50%', border: '1px solid grey' }} alt="" />
                    <label htmlFor="image">
                        <Input type="file" style={{ display: 'none' }} id="image" accept="image/png, image/jpeg" fullWidth onChange={handleFileUpload} required />
                        <Fab
                            color="secondary"
                            size="small"
                            component="span"
                            aria-label="add"
                            variant="extended"
                        >
                            Upload photo
                        </Fab>
                    </label>
                </div>
                <div>
                    <TextField
                        id="cur_cc_balance"
                        // label="Book  Name"
                        style={{ margin: 8 }}
                        placeholder="User Name"
                        helperText="User Name"
                        fullWidth
                        disabled
                        type="text"
                        // margin="normal"
                        InputLabelProps={{
                            shrink: true
                        }}
                        variant="filled"
                        value={username}
                    />

                    <TextField
                        id="deposit_val"
                        // label="Book  Name"
                        style={{ margin: 8 }}
                        placeholder="User Email"
                        helperText="User Email"
                        fullWidth
                        type="text"
                        disabled
                        // margin="normal"
                        InputLabelProps={{
                            shrink: true
                        }}
                        variant="filled"
                        value={email}
                    />
                </div>
            </Box>
            <Box
                component="form"
                noValidate
                autoComplete="off">
                    <div>
                        <TextField
                            placeholder="Type in here…"
                            multiline
                            fullWidth
                            helperText="User Bio Information"
                            rows={8}
                        />
                    </div>
                </Box>
            <Button variant="contained" onClick={() => Savedata()}>
                Save
            </Button>
        </MainCard>
    );
};

export default ProfileSetting;
