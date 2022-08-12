import React, { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// material-ui
import { Grid, Button, Box, TextField } from '@material-ui/core';
import { IconEye, IconEdit, IconTrash } from '@tabler/icons';
// toast message
// project imports
import MainCard from '../../../ui-component/cards/MainCard';
import { gridSpacing } from '../../../store/constant';
import configData from '../../../config';

//==============================|| book content ||==============================//
const Icons = {
    IconEye: IconEye, 
    IconEdit: IconEdit, 
    IconTrash: IconTrash
}

const BookContent = (props) => {
    const { id } = useParams();
    const [ bookcontent, setBookcontent ] = useState('<p>Hello from CKEditor 5!</p>');
    const [ title, setTitle ] = useState('Book Content Edit');

    const getBookcontentById = async () => {
        const { data } = await axios
            .get( configData.API_SERVER + 'books/edit/' + id)
        setBookcontent(data.content)
    }

    const updateBookcontent = async () => {
        const { data } = await axios
            .put( configData.API_SERVER + 'books/edit/' + id, {
                content: bookcontent
            })
    }

    useEffect(() => {
        if (id) {
            getBookcontentById()
            setTitle("Book Content Edit")
        }
    }, [])

    const saveBookcontent = () => {
        if(id) {
            updateBookcontent()
        } else {
            axios
                .post( configData.API_SERVER + 'bookcontent/save', {
                    content: bookcontent
                })
                .then(function (response) {
                    if (response.success == 201) {
                        setBookcontent("")
                    } else {    
                        setBookcontent("")
                    }
                })
                .catch(function (error) {
                    console.log("catch error === ")
                });
        }
    }
    
    function uploadAdapter(loader) {
        return {
          upload: () => {
            return new Promise((resolve, reject) => {
              const body = new FormData();
              loader.file.then((file) => {
                body.append("uploadimage", file);
                // let headers = new Headers();
                // headers.append("Origin", "http://localhost:3000");
                fetch(`${configData.API_SERVER}uploadimage`, {
                  method: "post",
                  body: body
                  // mode: "no-cors"
                })
                  .then((res) => res.json())
                  .then((res) => {
                    resolve({
                      default: `${res.uploadimage}`
                    });
                  })
                  .catch((err) => {
                    reject(err);
                  });
              });
            });
          }
        };
      }
    function uploadPlugin(editor) {
        editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
            return uploadAdapter(loader);
        };
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
                    <Box display="flex" p={1} m={1} bgcolor="background.paper">
                        <CKEditor
                            config={{
                                extraPlugins: [uploadPlugin]
                            }}
                            editor={ ClassicEditor }
                            // data="<p>Hello from CKEditor 5!</p>"
                            data={bookcontent}
                            onReady={ editor => {
                                // You can store the "editor" and use when it is needed.
                                // console.log( 'Editor is ready to use!', editor );
                            } }
                            onChange={ ( event, editor ) => {
                                const data = editor.getData();
                                setBookcontent(data)
                            } }
                            onBlur={ ( event, editor ) => {
                                // console.log( 'Blur.', editor );
                            } }
                            onFocus={ ( event, editor ) => {
                                // console.log( 'Focus.', editor );
                            } }
                        />
                    </Box>
                    <Box display="flex" flexDirection="row-reverse" p={1} m={1} bgcolor="background.paper">
                        <Button variant="contained" onClick={() => saveBookcontent()}>Save</Button>
                    </Box>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default BookContent;
