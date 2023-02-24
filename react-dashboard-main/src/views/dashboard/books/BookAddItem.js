import React, { useState } from "react";
import { IconTrash, IconPlus } from '@tabler/icons';
// material-ui
import { Button, TextField, Divider } from '@material-ui/core';
 
function BookAddItem({ inputList, setInputList }) {
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
        setInputList([...inputList, { tokenname: "", bookmarkprice: 0, maxbookmarksupply: 0, bookmarkstartpoint: 0, item_bmcontract_address: "" }]);
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
                                        helperText="Bookmark Price"
                                        fullWidth
                                        type="number"
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        variant="filled"
                                        value={item.bookmarkprice}
                                        onChange={e => handleInputChange(e, i)}
                                    />
                                    <TextField
                                        id="maxbookmarksupply"
                                        style={{ margin: 8 }}
                                        name="maxbookmarksupply"
                                        placeholder="Please input the max amount of bookmark"
                                        helperText="Max bookmarks supply"
                                        fullWidth
                                        type="number"
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        variant="filled"
                                        value={item.maxbookmarksupply}
                                        onChange={e => handleInputChange(e, i)}
                                    />
                                    <TextField
                                        id="bookmarkstartpoint"
                                        style={{ margin: 8 }}
                                        name="bookmarkstartpoint"
                                        placeholder="Please input the Bookmark start point"
                                        helperText="Bookmark Start Point"
                                        fullWidth
                                        type="number"
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        variant="filled"
                                        value={item.bookmarkstartpoint}
                                        onChange={e => handleInputChange(e, i)}
                                    />
                                    {/* <div className="btn-box"> */}
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
                                    {/* </div> */}
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