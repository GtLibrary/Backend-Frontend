import React, { useState } from 'react';

// material-ui
import { TextField } from '@material-ui/core';

//-----------------------|| InputTextField ||-----------------------//

const InputTextField = ({ id, className, style, placeholder, helperText, multiline, rows, type, val, setVal, errorMsg, isRequired, isDecimal }) => {
    const [error, setError] = useState(false);

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
                error={error}
                placeholder={placeholder}
                helperText={error ? errorMsg : helperText}
                fullWidth
                type={type}
                value={val}
                onChange={(e) => {
                    if(type === "number") {
                        if (e.target.value == '') {
                            setVal('');
                            setError(validateData(type, e.target.value));
                        } else {
                            if(isDecimal) {
                                if (onlythreedecimal.test(e.target.value)) {
                                    setVal(e.target.value);
                                    setError(validateData(type, e.target.value));
                                }
                            } else {
                                if (onlyinteger.test(e.target.value)) {
                                    setVal(e.target.value);
                                    setError(validateData(type, e.target.value));
                                }
                            }
                        }
                    } else {
                        setVal(e.target.value);
                        setError(validateData(type, e.target.value));
                    }
                }}
            />
        </>
    );
};

export default InputTextField;
