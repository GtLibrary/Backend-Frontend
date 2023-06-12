import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import { toast } from "react-toastify";

function SavebookModal(props) {
    
  const { account } = useWeb3React();
  const { pagecontent, title, id, show } = props;
  const [epubfile, setEpubfile] = useState('');

  useEffect(() => {
    getepubfile();
  }, [show])
  
  const getepubfile = async () => {
    const downloadurl = process.env.REACT_APP_API + `downloadepub/${id}`;

    const config = {
      method: "post",
      url: downloadurl,
      data: {
        account: account
      }
    };
    
    try {
      await axios(config).then((res) => {
        if (res.data.status === 404) {
          toast.error("You are not token owner!", {
            position: "top-right",
            autoClose: 3000,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } else {
          setEpubfile(res.data[0].epub_file)
        }
      });
    } catch (error) {
      console.log(error)
    }
  }


  const savebookbare = () => {
    const blob = new Blob([pagecontent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const tempEl = document.createElement("a");
    document.body.appendChild(tempEl);
    tempEl.href = url;
    tempEl.download = title + ".download.html";
    tempEl.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      tempEl.parentNode.removeChild(tempEl);
    }, 2000);
  }

  const downloadepub = () => {
    const link = document.createElement('a');
    link.href = epubfile;
    link.setAttribute('download', true);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
            Save Book
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Button onClick={() => {savebookbare()}}>Save as bare html</Button>
        <br/>
        <br/>
        <Button onClick={() => {downloadepub()}}>Save as .epub</Button>
        <br/>
        <br/>
        <Button disabled>Save as live Smart Book [Coming Soon!]</Button>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
export default SavebookModal;
