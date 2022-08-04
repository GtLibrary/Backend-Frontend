import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
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
    const [ employees, setEmployees ] = useState([]);

    useEffect(() => {
        axios
            .get( configData.API_SERVER + 'booktype/list' )
            .then(function (response) {
                if (response.data.success) {
                    setEmployees(response.data.booktypelist)
                } else {
                    setEmployees([])
                }
            })
            .catch(function (error) {
                
            });
    }, [])

    return (
        <MainCard title="Book Type">
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} sm={12}>
                    <Box display="flex" flexDirection="row-reverse" p={1} m={1} bgcolor="background.paper">
                        <Link to="/basic/new-booktype">
                            <Button variant="contained">New Book Type</Button>
                        </Link>
                    </Box>
                    <div className = "row">
                        <table className = "table table-striped table-bordered table-responsive">

                            <thead>
                                <tr>
                                    <th> Book Type Name </th>
                                    <th> Actions </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    employees && employees.map(
                                        employee => 
                                        <tr key = {employee.id}>
                                             <td> { employee.firstName} </td>
                                             <td>
                                                 <Button variant="contained"><IconEye /></Button>
                                                 <Button style={{marginLeft: "10px"}} variant="contained"><IconEdit /></Button>
                                                 <Button style={{marginLeft: "10px"}} variant="contained" color="error"><IconTrash /></Button>
                                             </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>

                 </div>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default BookType;
