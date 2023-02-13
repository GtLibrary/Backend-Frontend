import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from "react-toastify";
import configData from '../../config';

// material-ui
import { Button, Box, TextField } from '@material-ui/core';
// import { Button, Box } from '@material-ui/core';

// project imports
import MainCard from '../../ui-component/cards/MainCard';

const ChangePass = () => {
    const accountinfo = useSelector((state) => state.account);
    const [currentpw, setCurrentpw] = useState('');
    const [newpw, setNewpw] = useState('');
    const [confirmpw, setConfirmpw] = useState('');

    const setChangePW = async () => {
        if(newpw === confirmpw) {
            await axios
                .post(configData.API_SERVER + 'changepassword', {
                    old_password: currentpw,
                    password: newpw
                }, {
                    headers: {
                        Authorization: `${accountinfo.token}`
                    }
                }).then((response) => {
                    if(response.status === 200) {
                        toast.success("Changed Password Successfully", {
                            position: "top-right",
                            autoClose: 3000,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                        });
                        setCurrentpw("")
                        setNewpw("")
                        setConfirmpw("")
                    } else {
                        toast.error("Please confirm current password", {
                            position: "top-right",
                            autoClose: 3000,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                        });
                    }
                })
        } else {
            toast.error("Please confirm new password", {
                position: "top-right",
                autoClose: 3000,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    return (
        <MainCard title="Change Password">
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
                        id="cur_cc_balance"
                        // label="Book  Name"
                        style={{ margin: 2 }}
                        placeholder="Current Password"
                        helperText="Current Password"
                        fullWidth
                        // margin="normal"
                        InputLabelProps={{
                            shrink: true
                        }}
                        variant="filled"
                        type="password"
                        value={currentpw}
                        onChange={(e) => {
                            setCurrentpw(e.target.value)
                        }}
                    />
                </div>
                <div>
                    <TextField
                        id="deposit_val"
                        // label="Book  Name"
                        style={{ margin: 2 }}
                        placeholder="New Password"
                        helperText="New Password"
                        fullWidth
                        // margin="normal"
                        InputLabelProps={{
                            shrink: true
                        }}
                        variant="filled"
                        type="password"
                        value={newpw}
                        onChange={(e) => {
                            setNewpw(e.target.value);
                        }}
                    />
                </div>
                <div>
                    <TextField
                        id="deposit_val"
                        // label="Book  Name"
                        style={{ margin: 2 }}
                        placeholder="Confirm Password"
                        helperText="Confirm Password"
                        fullWidth
                        // margin="normal"
                        InputLabelProps={{
                            shrink: true
                        }}
                        variant="filled"
                        type="password"
                        value={confirmpw}
                        onChange={(e) => {
                            setConfirmpw(e.target.value);
                        }}
                    />
                </div>
            </Box>
            <Button variant="contained" onClick={() => setChangePW()}>
                Change Password
            </Button>
        </MainCard>
    );
};

export default ChangePass;
