import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@material-ui/core';
// material-ui
import { Button, Box } from '@material-ui/core';
import { IconEdit, IconTrash } from '@tabler/icons';

// project imports
import MainCard from '../../ui-component/cards/MainCard';
import configData from '../../config';

//==============================|| Book Type ||==============================//

const columns = [
    { id: 'name', label: 'Book Type Name', minWidth: 170 },
    { id: 'action', label: 'Actions', minWidth: 100, align:'right' }
];

const BookType = () => {
    const history = useHistory();
    const [booktypes, setBooktypes] = useState([]);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const getBooktypes = async () => {
        const { data } = await axios.get(configData.API_SERVER + 'booktype/list');
        setBooktypes(data);
    };

    useEffect(() => {
        getBooktypes();
    }, []);

    const editBooktype = (id) => {
        history.push(`/basic/edit-booktype/${id}`);
    };

    const AddBooktype = () => {
        history.push(`/basic/new-booktype`);
    };

    const deleteBooktype = (booktype_id) => {
        axios
            .delete(configData.API_SERVER + 'booktype/delete/' + booktype_id)
            .then(function (response) {
                if (response.status === '204') {
                    getBooktypes();
                } else {
                    getBooktypes();
                }
            })
            .catch(function (error) {});
    };

    return (
        <MainCard title="Book Type">
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <Box display="flex" flexDirection="row-reverse" p={1} m={1} bgcolor="background.paper">
                    <Button variant="contained" onClick={() => {AddBooktype()}}>New Book Type</Button>
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
                            {booktypes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                        <TableCell>{row.booktype}</TableCell>
                                        <TableCell align={'right'}>
                                            <Button style={{ marginLeft: '10px' }} variant="contained" onClick={() => editBooktype(row.id)}>
                                                <IconEdit />
                                            </Button>
                                            <Button
                                                style={{ marginLeft: '10px' }}
                                                variant="contained"
                                                color="error"
                                                onClick={() => deleteBooktype(row.id)}
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
                    count={booktypes.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </MainCard>
    );
};

export default BookType;
