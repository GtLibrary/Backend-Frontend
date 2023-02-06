import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

// material-ui
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@material-ui/core';

import { Button, Box } from '@material-ui/core';
import { IconEdit, IconTrash } from '@tabler/icons';

// project imports
import MainCard from '../../ui-component/cards/MainCard';
import configData from '../../config';

//==============================|| Origin Type ||==============================//

const columns = [
    { id: 'name', label: 'Origin Type Name', minWidth: 170 },
    { id: 'action', label: 'Actions', minWidth: 100, align:'right' }
];

const OriginType = () => {
    const history = useHistory();
    const [origintypes, setOrigintypes] = useState([]);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const getOrigintypes = async () => {
        const { data } = await axios.get(configData.API_SERVER + 'origintype/list');
        setOrigintypes(data);
    };

    useEffect(() => {
        getOrigintypes();
    }, []);

    const editOrigintype = (id) => {
        history.push(`/basic/edit-origintype/${id}`);
    };

    const AddOrigintype = () => {
        history.push(`/basic/new-origintype`);
    };

    const deleteOrigintype = (origintype_id) => {
        axios
            .delete(configData.API_SERVER + 'origintype/delete/' + origintype_id)
            .then(function (response) {
                if (response.status === '204') {
                    getOrigintypes();
                } else {
                    getOrigintypes();
                }
            })
            .catch(function (error) {});
    };

    return (
        <MainCard title="Origin Type">
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <Box display="flex" flexDirection="row-reverse" p={1} m={1} bgcolor="background.paper">
                    <Button variant="contained" onClick={() => {AddOrigintype()}}>New Origin Type</Button>
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
                            {origintypes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                        <TableCell>{row.origintype}</TableCell>
                                        <TableCell align={'right'}>
                                            <Button
                                                style={{ marginLeft: '10px' }}
                                                variant="contained"
                                                onClick={() => editOrigintype(row.id)}
                                            >
                                                <IconEdit />
                                            </Button>
                                            <Button
                                                style={{ marginLeft: '10px' }}
                                                variant="contained"
                                                color="error"
                                                onClick={() => deleteOrigintype(row.id)}
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
                    count={origintypes.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </MainCard>
    );
};

export default OriginType;
