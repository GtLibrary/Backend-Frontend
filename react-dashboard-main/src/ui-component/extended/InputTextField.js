import React, { useState, useEffect } from 'react';

// material-ui
import { TextField } from '@material-ui/core';

//-----------------------|| InputTextField ||-----------------------//

const InputTextField = ({ id, className, style, error, placeholder, helperText, multiline, rows, type, val, setVal, errorMsg, isRequired, isDecimal }) => {
    if(error === undefined) {
        error = false
    }
    const [errorflag, setErrorflag] = useState(error);

    const onlythreedecimal = /^([0-9]{0,3}(\.[0-9]{0,3})?|\s*)$/;
    const onlyinteger = /^\d+(,\d{0,3})?$/;

    const validateData = (type, value) => {
        if(type === "text") {
            if(value === '') {
                return isRequired ? true : false;
            } else {
                return false;
            }
        } else if(type === "number") {
            if(value <= 0 || value === '') {
                return isRequired ? true : false
            } else {
                return false;
            }
        }
    }

    useEffect(() => {
        setErrorflag(error);
    }, [error])

    return (
        <>
            <TextField
                id={id}
                className={className}
                style={style}
                InputLabelProps={{
                    shrink: true
                }}
                variant="filled"
                rows={rows}
                multiline={multiline}
                error={errorflag}
                placeholder={placeholder}
                helperText={errorflag ? errorMsg : helperText}
                fullWidth
                type={type}
                value={val}
                onChange={(e) => {
                    if(type === "number") {
                        if (e.target.value == '') {
                            setVal('');
                            setErrorflag(validateData(type, e.target.value));
                        } else {
                            if(isDecimal) {
                                if (onlythreedecimal.test(e.target.value)) {
                                    setVal(e.target.value);
                                    setErrorflag(validateData(type, e.target.value));
                                }
                            } else {
                                if (onlyinteger.test(e.target.value)) {
                                    setVal(e.target.value);
                                    setErrorflag(validateData(type, e.target.value));
                                }
                            }
                        }
                    } else {
                        setVal(e.target.value);
                        setErrorflag(validateData(type, e.target.value));
                    }
                }}
            />
        </>
    );
};

export default InputTextField;
