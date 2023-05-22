import React, { useEffect, useState } from 'react';
import { Link, useHistory } from "react-router-dom";
import axios from 'axios';
import { useSelector } from 'react-redux';

// material-ui
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@material-ui/core';
import { Button, Box } from '@material-ui/core';
import { IconNotes, IconEdit, IconTrash, IconPrinter, IconAd } from '@tabler/icons';

// project imports
import MainCard from '../../../ui-component/cards/MainCard';
import configData from '../../../config';

//==============================|| Book Type ||==============================//

const columns = [
    { id: 'name', label: 'Book Name', minWidth: 170 },
    { id: 'action', label: 'Actions', minWidth: 100, align:'right' }
];

const Booklist = () => {
    const history = useHistory();
    const [ booklists, setBooklists ] = useState([]);
    
    const accountinfo = useSelector((state) => state.account);
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
            .get( configData.API_SERVER + 'books/list', { headers: { Authorization: `${accountinfo.token}` } })
        setBooklists(data)
    }

    useEffect(() => {
        getBooklists()
    }, [])

    const editBooklist = (id) => {
        history.push(`/dashboard/books/edit/${id}`)
    }

    const BookAdSet = (id) => {
        history.push(`/dashboard/books/adcontent/${id}`)
    }

    const newBookadd = () => {
        history.push(`/dashboard/books/addbook`)
    }

    const editBookcontent = (id) => {
        history.push(`/dashboard/books/contentedit/${id}`)
    }

    const printBook = (id) => {
        history.push(`/dashboard/books/printbook/${id}`)
    }

    const deleteBooklist = (Booklist_id) => {
        const confirmed = window.confirm("Are you sure you want to delete this Book?");
        if (confirmed) {
            axios.delete( configData.API_SERVER + 'books/delete/' + Booklist_id, { headers: { Authorization: `${accountinfo.token}` } })
                .then(function (response) {
                    if (response.status === 204) {
                        getBooklists()
                    } else {
                        getBooklists()
                    }
                })
                .catch(function (error) {
                    
                });
        }
    }

    return (
        <MainCard title="Book List">
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <Box display="flex" flexDirection="row-reverse" p={1} m={1} bgcolor="background.paper">
                    <Button variant="contained" onClick={() => {newBookadd()}}>Add New Book</Button>
                </Box>
                <TableContainer sx={{ maxHeight: 520 }}>
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
                                        <TableCell>{row.title}</TableCell>
                                        <TableCell align={'right'}>
                                            <Button
                                                style={{ marginLeft: '10px' }}
                                                variant="contained"
                                                onClick={() => printBook(row.id)}
                                            >
                                                <IconPrinter />
                                            </Button>
                                            <Button
                                                style={{ marginLeft: '10px' }}
                                                variant="contained"
                                                onClick={() => BookAdSet(row.id)}
                                            >
                                                <IconAd />
                                            </Button>
                                            <Button
                                                style={{ marginLeft: '10px' }}
                                                variant="contained"
                                                onClick={() => editBookcontent(row.id)}
                                            >
                                                <IconNotes />
                                            </Button>
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
