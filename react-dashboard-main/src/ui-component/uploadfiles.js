import React, { useState, useEffect } from "react";
import UploadService from "./file-upload.service";

const UploadFiles = () => {
  const [selectedFiles, setSelectedFiles] = useState(undefined);
  const [currentFile, setCurrentFile] = useState(undefined);
  const [message, setMessage] = useState("");
  const [fileInfos, setFileInfos] = useState([]);

  useEffect(() => {
    UploadService.getFiles().then((response) => {
      setFileInfos(response.data);
    });
  }, []);

  const selectFile = (event) => {
    setSelectedFiles(event.target.files);
  };
  const upload = () => {
    let currentFile = selectedFiles[0];
    setCurrentFile(currentFile);
    UploadService.upload(currentFile, (event) => {
    })
      .then((response) => {
        setMessage(response.data.message);
        return UploadService.getFiles();
      })
      .then((files) => {
        setFileInfos(files.data);
      })
      .catch(() => {
        setMessage("Could not upload the file!");
        setCurrentFile(undefined);
      });
    setSelectedFiles(undefined);
  };
  return (
    <div>
      <label className="btn btn-default">
        <input type="file" onChange={selectFile} />
      </label>
      <button
        className="btn btn-success"
        disabled={!selectedFiles}
        onClick={upload}
      >
        Upload
      </button>
      <div className="alert alert-light" role="alert">
        {message}
      </div>
    </div>
  );
};
export default UploadFiles;