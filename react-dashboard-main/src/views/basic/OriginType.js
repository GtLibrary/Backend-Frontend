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

//==============================|| Origin Type ||==============================//
const Icons = {
    IconEye: IconEye, 
    IconEdit: IconEdit, 
    IconTrash: IconTrash
}

const OriginType = () => {
    const history = useHistory();
    const [ origintypes, setOrigintypes ] = useState([]);

    const getOrigintypes = async () => {
        const { data } = await axios
            .get( configData.API_SERVER + 'origintype/list')
        setOrigintypes(data)
    }

    useEffect(() => {
        getOrigintypes()
    }, [])

    const editOrigintype = (id) => {
        history.push(`/basic/edit-origintype/${id}`)
    }

    const deleteOrigintype = (origintype_id) => {
        axios.delete( configData.API_SERVER + 'origintype/delete/' + origintype_id)
            .then(function (response) {
                if (response.status == '204') {
                    getOrigintypes()
                } else {
                    getOrigintypes()
                }
            })
            .catch(function (error) {
                
            });
    }

    return (
        <MainCard title="Origin Type">
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} sm={12}>
                    <Box display="flex" flexDirection="row-reverse" p={1} m={1} bgcolor="background.paper">
                        <Link to="/basic/new-origintype">
                            <Button variant="contained">New Origin Type</Button>
                        </Link>
                    </Box>
                    <Box display="flex" flexDirection="row-reverse" p={1} m={1} bgcolor="background.paper">
                        <table className = "table table-striped table-bordered table-responsive">

                            <thead>
                                <tr>
                                    <th> Origin Type Name </th>
                                    <th> Actions </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    origintypes && origintypes.map(
                                        item => 
                                        <tr key = {item.id}>
                                             <td> { item.origintype} </td>
                                             <td>
                                                 <Button style={{marginLeft: "10px"}} variant="contained" onClick={() => editOrigintype(item.id)}><IconEdit /></Button>
                                                 <Button style={{marginLeft: "10px"}} variant="contained" color="error" onClick={() => deleteOrigintype(item.id)}><IconTrash /></Button>
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

export default OriginType;
