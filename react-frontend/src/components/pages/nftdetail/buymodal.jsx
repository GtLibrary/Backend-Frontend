import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { ethers } from "ethers";

function BuyModal(props) {
	const provider_url = process.env.REACT_APP_PROVIDERURL;
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

	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Buy NFT
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				
			</Modal.Body>
			{/* <Modal.Footer>
				<Button onClick={props.onHide}>Close</Button>
			</Modal.Footer> */}
		</Modal>
	);
}
export default BuyModal;
