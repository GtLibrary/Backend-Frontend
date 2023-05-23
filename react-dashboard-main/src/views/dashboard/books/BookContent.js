import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

// material-ui
import { Grid, Button, Box } from '@material-ui/core';
// toast message
// project imports
import MainCard from '../../../ui-component/cards/MainCard';
import { gridSpacing } from '../../../store/constant';
import configData from '../../../config';
import './styles.css';

//==============================|| book content ||==============================//

const BookContent = (props) => {
    const { id } = useParams();
    const [bookcontent, setBookcontent] = useState('<p>Hello from CKEditor 5!</p>');
    const [title, setTitle] = useState('Book Content Edit');
    const [epubfile, setEpubfile] = useState(null);
    const [audiofile, setAudiofile] = useState(null);
    const [bookfile, setBookfile] = useState(null);
    const accountinfo = useSelector((state) => state.account);
    const contentEditable = useRef();

    const getBookcontentById = async () => {
        const { data } = await axios.get(configData.API_SERVER + 'books/edit/' + id, {
            headers: { Authorization: `${accountinfo.token}` }
        });
        setBookcontent(data.content);
        setBookfile(data.epub_file);
    };

    const updateBookcontent = async () => {
        
        let form_data = new FormData();
        if (epubfile) {
            form_data.append('epub_file', epubfile);
        }
        if (audiofile) {
            form_data.append('audio_file', audiofile);
        }
        form_data.append('content', bookcontent);

        await axios.put(
            configData.API_SERVER + 'books/edit/' + id, 
            form_data,
            { headers: { Authorization: `${accountinfo.token}` } }
        );
        
        toast.success('successfully save data', {
            position: 'top-right',
            autoClose: 3000,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
        });
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
        }
    };

    const uploadepub = (e) => {
        setEpubfile(e.target.files[0]);
    }

    const uploadAudio = (e) => {
        setAudiofile(e.target.files[0]);
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
                    <p style={{fontFamily: 'Crimson Text'}}>Save epub file for user download.</p>
                    <Box display="flex" flexDirection="column" className="upload-content" p={1} m={1} bgcolor="background.paper">
                        <input
                            accept="application/epub+zip"
                            className="hidden"
                            id="button-file"
                            type="file"
                            onChange={(e) => {
                                uploadepub(e);
                            }}
                        />
                        <span>select the epub file</span>
                        {bookfile !== null? (<a href={bookfile}>current epub file</a>):(<></>)}
                    </Box>
                    <p style={{fontFamily: 'Crimson Text'}}>Save Book Audio file for user download.</p>
                    <Box display="flex" flexDirection="column" className="upload-content" p={1} m={1} bgcolor="background.paper">
                        <input
                            accept=".mp3,.wav"
                            className="hidden"
                            type="file"
                            onChange={(e) => {
                                uploadAudio(e);
                            }}
                        />
                        <span>select the Book Audio file</span>
                        {bookfile !== null? (<a href={bookfile}>current Book Audio file</a>):(<></>)}
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