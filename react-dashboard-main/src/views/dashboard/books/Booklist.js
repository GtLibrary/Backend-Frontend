import React, { useEffect, useState } from 'react';
import { Link, useHistory } from "react-router-dom";
import axios from 'axios';

// material-ui
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@material-ui/core';
import { Grid, Button, Box } from '@material-ui/core';
import { IconEye, IconEdit, IconTrash } from '@tabler/icons';

// project imports
import MainCard from '../../../ui-component/cards/MainCard';
import { gridSpacing } from '../../../store/constant';
import configData from '../../../config';

//==============================|| Book Type ||==============================//
const Icons = {
    IconEye: IconEye, 
    IconEdit: IconEdit, 
    IconTrash: IconTrash
};
const columns = [
    { id: 'name', label: 'Book Name', minWidth: 170 },
    { id: 'action', label: 'Actions', minWidth: 100, align:'right' }
];

const Booklist = () => {
    const history = useHistory();
    const [ booklists, setBooklists ] = useState([]);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const getBooklists = async () => {
        const { data } = await axios
            .get( configData.API_SERVER + 'books/list')
        setBooklists(data)
    }

    useEffect(() => {
        getBooklists()
    }, [])

    const editBooklist = (id) => {
        history.push(`/books/edit/${id}`)
    }

    const deleteBooklist = (Booklist_id) => {
        axios.delete( configData.API_SERVER + 'books/delete/' + Booklist_id)
            .then(function (response) {
                if (response.status == '204') {
                    getBooklists()
                } else {
                    getBooklists()
                }
            })
            .catch(function (error) {
                
            });
    }

    return (
        <MainCard title="Book List">
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <Box display="flex" flexDirection="row-reverse" p={1} m={1} bgcolor="background.paper">
                    <Link to="/dashboard/books/addbook">
                        <Button variant="contained">New Book</Button>
                    </Link>
                </Box>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {booklists.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                        <TableCell>{row.origintype}</TableCell>
                                        <TableCell align={'right'}>
                                            <Button
                                                style={{ marginLeft: '10px' }}
                                                variant="contained"
                                                onClick={() => editBooklist(row.id)}
                                            >
                                                <IconEdit />
                                            </Button>
                                            <Button
                                                style={{ marginLeft: '10px' }}
                                                variant="contained"
                                                color="error"
                                                onClick={() => deleteBooklist(row.id)}
                                            >
                                                <IconTrash />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={booklists.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </MainCard>
    );
};

export default Booklist;
