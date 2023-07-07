import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { ethers } from "ethers";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

function ListModal(props) {
	const provider_url = process.env.REACT_APP_PROVIDERURL;
    const priceUnit = process.env.REACT_APP_NATIVECURRENCYNAME;
	const { account } = useWeb3React();
    const {show} = props;

	const web3 = new Web3(window.ethereum);
	
	const [NFTOwner, setNFTOwner] = useState('');
	const [dexrate, setDexrate] = useState(0);
	const [contractowner, setContractowner] = useState('');

	useEffect(() => {
		const loadcontractdata = async () => {
			const { ethereum } = window;

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
			}
		};
		loadcontractdata();
	}, [show]);

    const listcomplete = () => {

    }

	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					List for sale
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
                <div className="modal-content-body">
                    <Form.Label htmlFor="list-price">Set Price for listing</Form.Label>
                    <InputGroup className="mb-3" size="lg">
                        <Form.Control
                            id="list-price"
                            placeholder="Price"
                            aria-label="Price"
                            aria-describedby="list_price"
                        />
                        <InputGroup.Text id="list_price">{priceUnit}</InputGroup.Text>
                    </InputGroup>
                    <button className="confirm-button" onClick={()=>{listcomplete()}}>Complete listing</button>
                </div>
			</Modal.Body>
			{/* <Modal.Footer>
				<Button onClick={props.onHide}>Close</Button>
			</Modal.Footer> */}
		</Modal>
	);
}
export default ListModal;
