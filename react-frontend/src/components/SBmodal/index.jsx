import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function SavebookModal(props) {
    
  const { pagecontent, title } = props;

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
        <Button>Save as .epub [Not Yet Implemented]</Button>
        <br/>
        <br/>
        <Button>Save as Smart Book [Coming Soon!]</Button>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
export default SavebookModal;
