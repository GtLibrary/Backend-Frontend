import axios from "axios";

const upload = (file) => {
  let formData = new FormData();
  formData.append("file", file);
  return axios.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const getFiles = () => {
  return axios.get("/files");
};

export default {
  upload,
  getFiles,
};