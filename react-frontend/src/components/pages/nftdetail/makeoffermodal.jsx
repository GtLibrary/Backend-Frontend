import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { ethers } from "ethers";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

function MakeOfferModal(props) {
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

    const makeoffer = () => {

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
					Make an offer
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
                <div className="modal-content-body">
                    <Form.Label htmlFor="offer-price">Make an offer</Form.Label>
                    <InputGroup className="mb-3" size="lg">
                        <Form.Control
                            id="offer-price"
                            placeholder="Price"
                            aria-label="Price"
                            aria-describedby="offer_price"
                        />
                        <InputGroup.Text id="offer_price">{priceUnit}</InputGroup.Text>
                    </InputGroup>
                    <button className="confirm-button" onClick={()=>{makeoffer()}}>Make offer</button>
                </div>
			</Modal.Body>
			{/* <Modal.Footer>
				<Button onClick={props.onHide}>Close</Button>
			</Modal.Footer> */}
		</Modal>
	);
}
export default MakeOfferModal;
