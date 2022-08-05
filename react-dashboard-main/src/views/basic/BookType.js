import React, { useEffect, useState } from 'react';
import { Link, useHistory } from "react-router-dom";
import axios from 'axios';

// material-ui
import { Grid, Button, Box } from '@material-ui/core';
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

const BookType = () => {
    const history = useHistory();
    const [ booktypes, setBooktypes ] = useState([]);

    const getBooktypes = async () => {
        const { data } = await axios
            .get( configData.API_SERVER + 'booktype/list')
        setBooktypes(data)
    }

    useEffect(() => {
        getBooktypes()
    }, [])

    const editBooktype = (id) => {
        history.push(`/basic/edit/${id}`)
    }

    const deleteBooktype = (booktype_id) => {
        axios.delete( configData.API_SERVER + 'booktype/delete/' + booktype_id)
            .then(function (response) {
                if (response.status == '204') {
                    getBooktypes()
                } else {
                    getBooktypes()
                }
            })
            .catch(function (error) {
                
            });
    }

    return (
        <MainCard title="Book Type">
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} sm={12}>
                    <Box display="flex" flexDirection="row-reverse" p={1} m={1} bgcolor="background.paper">
                        <Link to="/basic/new-booktype">
                            <Button variant="contained">New Book Type</Button>
                        </Link>
                    </Box>
                    <Box display="flex" flexDirection="row-reverse" p={1} m={1} bgcolor="background.paper">
                        <table className = "table table-striped table-bordered table-responsive">

                            <thead>
                                <tr>
                                    <th> Book Type Name </th>
                                    <th> Actions </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    booktypes && booktypes.map(
                                        item => 
                                        <tr key = {item.id}>
                                             <td> { item.booktype} </td>
                                             <td>
                                                 <Button style={{marginLeft: "10px"}} variant="contained" onClick={() => editBooktype(item.id)}><IconEdit /></Button>
                                                 <Button style={{marginLeft: "10px"}} variant="contained" color="error" onClick={() => deleteBooktype(item.id)}><IconTrash /></Button>
                                             </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>

                    </Box>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default BookType;
