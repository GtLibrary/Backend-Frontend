import React from "react";
import { IconTrash, IconPlus } from '@tabler/icons';
// material-ui
import { Button, TextField, Divider } from '@material-ui/core';
 
const generateRandomString = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function BookAddItem({ inputList, setInputList, avaxprice }) {
    const onlythreedecimal = /^([0-9]{0,3}(\.[0-9]{0,3})?|\s*)$/
    const onlyinteger = /^\d+(,\d{0,3})?$/
    // handle input change
    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...inputList];
        list[index][name] = value;
        setInputList(list);
    };
    
    // handle click event of the Remove button
    const handleRemoveClick = index => {
        const list = [...inputList];
        list.splice(index, 1);
        setInputList(list);
    };
    
    // handle click event of the Add button
    const handleAddClick = () => {
        setInputList([...inputList, { tokenname: generateRandomString(8), bookmarkprice: '60', maxbookmarksupply: '390', bookmarkstartpoint: '0', item_bmcontract_address: "" }]);
    };

    return (
        <div className="BookAddItem">
            <Divider>Bookmark List</Divider>
            {inputList.length > 0 ? (
                <div>
                    <div>
                        {inputList.map((item, i) => {
                            return (
                                <div className="box">
                                    <TextField
                                        id="Bookmarkprice"
                                        style={{ margin: 8 }}
                                        name="tokenname"
                                        placeholder="Please input the bookmark token name"
                                        helperText="Bookmark Token Name"
                                        fullWidth
                                        className='input-item'
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        variant="filled"
                                        value={item.tokenname}
                                        onChange={e => handleInputChange(e, i)}
                                    />
                                    <TextField
                                        id="Bookmarkprice"
                                        style={{ margin: 8 }}
                                        name="bookmarkprice"
                                        placeholder="Please input the bookmark price"
                                        helperText={`Bookmark Price (~ ${avaxprice * Number(item.bookmarkprice)}) USD`}
                                        fullWidth
                                        className='input-item'
                                        type="number"
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        variant="filled"
                                        value={item.bookmarkprice}
                                        onChange={e => {
                                            if(onlythreedecimal.test(e.target.value)) {
                                                if(e.target.value > 0) {
                                                    handleInputChange(e, i)
                                                } else {
                                                    return;
                                                }
                                            }
                                        }}
                                    />
                                    <TextField
                                        id="maxbookmarksupply"
                                        style={{ margin: 8 }}
                                        name="maxbookmarksupply"
                                        placeholder="Please input the max amount of bookmark"
                                        helperText="Max bookmarks supply"
                                        fullWidth
                                        className='input-item'
                                        type="number"
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        variant="filled"
                                        value={item.maxbookmarksupply}
                                        onChange={e => {
                                            if(onlyinteger.test(e.target.value)) {
                                                if(e.target.value > 0) {
                                                    handleInputChange(e, i)
                                                } else {
                                                    return;
                                                }
                                            }
                                        }}
                                    />
                                    <TextField
                                        id="bookmarkstartpoint"
                                        style={{ margin: 8 }}
                                        name="bookmarkstartpoint"
                                        placeholder="Please input the Bookmark start point"
                                        helperText="Bookmark Start Point"
                                        fullWidth
                                        className='input-item'
                                        type="number"
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        variant="filled"
                                        value={item.bookmarkstartpoint}
                                        onChange={e => {
                                            if(onlyinteger.test(e.target.value)) {
                                                if(e.target.value > 0) {
                                                    handleInputChange(e, i)
                                                } else {
                                                    return;
                                                }
                                            }
                                        }}
                                    />
                                    { inputList.length !== 1 && 
                                        <Button
                                            variant="contained"
                                            color="error"
                                            style={{ margin: 8 }}
                                            onClick={() => handleRemoveClick(i)}
                                        >
                                            <IconTrash />
                                        </Button>
                                    }
                                    { inputList.length - 1 === i && 
                                        <Button 
                                            variant="contained"
                                            style={{ margin: 8 }}
                                            onClick={handleAddClick}
                                        >
                                            <IconPlus />
                                        </Button>
                                    }
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div>
                    <p style={{textAlign: "center"}}>None exist data</p>
                </div>
            )}
        </div>
    );
}
 
export default BookAddItem;