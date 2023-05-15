import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

// material-ui
import { Grid, Button, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
// toast message
// project imports
import MainCard from '../../../ui-component/cards/MainCard';
import { gridSpacing } from '../../../store/constant';
import configData from '../../../config';
import './styles.css';

import { pdfjs } from 'react-pdf';
import { parseEpub } from '@gxl/epub-parser';
// import { pdfjs } from "pdfjs-dist";
// pdfjs.GlobalWorkerOptions.workerSrc ='pdf.worker.min.js';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// import PDFJSWorker from 'node_modules/pdfjs-dist/build/pdf.worker.js';
// pdfjs.GlobalWorkerOptions.workerSrc = PDFJSWorker;
//==============================|| book content ||==============================//

const useStyles = makeStyles((theme) => ({
    maincontent: {
        height: 'calc(100vh - 210px)',
        overflowY: 'scroll'
    }
}));

const BookContent = (props) => {
    const { id } = useParams();
    const [bookcontent, setBookcontent] = useState('<p>Hello from CKEditor 5!</p>');
    const [title, setTitle] = useState('Book Content Edit');
    const [epubfile, setEpubfile] = useState(null);
    const accountinfo = useSelector((state) => state.account);
    const contentEditable = useRef();
    const classes = useStyles();

    const getBookcontentById = async () => {
        const { data } = await axios.get(configData.API_SERVER + 'books/edit/' + id, {
            headers: { Authorization: `${accountinfo.token}` }
        });
        setBookcontent(data.content);
    };

    const updateBookcontent = async () => {
        await axios.put(
            configData.API_SERVER + 'books/edit/' + id,
            {
                content: bookcontent
            },
            { headers: { Authorization: `${accountinfo.token}` } }
        );
    };

    useEffect(() => {
        if (id) {
            getBookcontentById();
            setTitle('Book Content Edit');
        }
    }, []);

    const saveBookcontent = () => {
        if (id) {
            updateBookcontent();
        } else {
            
            let form_data = new FormData();
            form_data.append('epubfile', epubfile);

            axios
                .post(configData.API_SERVER + 'bookcontent/save', {
                    headers: { Authorization: `${accountinfo.token}` },
                    content: bookcontent
                })
                .then(function (response) {
                    if (response.success === 201) {
                        setBookcontent('');
                    } else {
                        setBookcontent('');
                    }
                })
                .catch(function (error) {});
        }
    };

    const uploadepub = (e) => {
        setEpubfile(e.target.files[0]);
    }

    const handlePaste = (event) => {
        const copytext = event.clipboardData.getData('text/html');
        event.preventDefault();
        console.log('Pasted text:', copytext);
        // document.execCommand('insertHTML', false, copytext);
        setBookcontent(copytext);
    }

    return (
        <MainCard title={title}>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} sm={12}>
                    <Box display="flex" flexDirection="row-reverse" p={1} m={1} bgcolor="background.paper">
                        <Link to="/dashboard/booklist">
                            <Button variant="outlined">Back To List</Button>
                        </Link>
                    </Box>
                    <Box display="flex" flexDirection="column" className="upload-content" p={1} m={1} bgcolor="background.paper">
                        <input
                            accept="application/pdf, application/epub+zip"
                            className="hidden"
                            id="button-file"
                            type="file"
                            onChange={(e) => {
                                uploadepub(e);
                            }}
                        />
                        <span>select the pdf file</span>
                    </Box>
                    <p style={{fontFamily: 'Crimson Text'}}>Paste your manuscript from Google Docs in the box below. Then click Save.</p>
                    <Box display="flex" p={1} m={1} bgcolor="background.paper">
                        <div className='contenteditable-area' onPaste={handlePaste} ref={contentEditable} contentEditable={true} dangerouslySetInnerHTML={{ __html: bookcontent }} ></div>
                    </Box>
                    <Box display="flex" flexDirection="row-reverse" p={1} m={1} bgcolor="background.paper">
                        <Button variant="contained" onClick={() => saveBookcontent()}>
                            Save
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default BookContent;
