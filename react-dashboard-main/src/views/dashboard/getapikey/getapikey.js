import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useWeb3React } from "@web3-react/core";
import axios from 'axios';
import { toast } from "react-toastify";
import generateApiKey from 'generate-api-key';

// material-ui
import { Button, Box, TextField } from '@material-ui/core';

// project imports
import MainCard from '../../../ui-component/cards/MainCard';



const Getapikey = () => {
    const userinfo = useSelector((state) => state.account);
    const user_name = userinfo.user.username;
    const user_id = userinfo.user._id;
    const { account } = useWeb3React();
    const [benjikey, setBenjikey] = useState("");

    const generateBenjikey = () => {
        const random_key =generateApiKey({ method: 'string', length: 16 });
        const temp_key = user_name + ":" + random_key;
        setBenjikey(temp_key)
    }

    const copyBenjikey = () => {
        if(benjikey === "") {
            toast.error("Please generate Benji API Key", {
                position: "top-right",
                autoClose: 3000,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } else {
            navigator.clipboard.writeText(benjikey)
            toast.success("Copied Benji API Key", {
                position: "top-right",
                autoClose: 3000,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }

    return (
        <MainCard title="Get Benji-Key">
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '80ch' }
                }}
                noValidate
                autoComplete="off"
            >
                <div>
                    <TextField
                        id="get_benjikey"
                        // label="Book  Name"
                        style={{ margin: 8 }}
                        placeholder="Benji API Key"
                        helperText="Benji API Key"
                        fullWidth
                        // disabled
                        type="string"
                        // margin="string"
                        InputLabelProps={{
                            shrink: true
                        }}
                        variant="filled"
                        value={benjikey}
                    />
                </div>
            </Box>
            <Button variant="contained" onClick={() => generateBenjikey()}>Generate Benji API Key</Button>&nbsp;
            <Button variant="contained" onClick={() => copyBenjikey()}>Copy Benji API Key</Button>
        </MainCard>
    );
};

export default Getapikey;
