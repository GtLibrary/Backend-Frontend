import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { toast } from 'react-toastify';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import draculaHero_abi from '../../../utils/contract/DraculaHero.json';
import draculaRelics_abi from '../../../utils/contract/Relics.json';

function SendModal(props) {
	const provider_url = process.env.REACT_APP_PROVIDERURL;
	const { account } = useWeb3React();
    const { show, onHide,  tokenaddress, tokenid } = props;

	const web3 = new Web3(window.ethereum);
	
	const [toaddress, setToaddress] = useState('');

    const sendnft = async () => {
		try {
			if(window.ethereum) {
				let contract_abi = '';
				if(tokenaddress == "0x02819086274690fb27b940bec1268deD9D4DCC10"){
				  contract_abi = draculaRelics_abi;
				} else if(tokenaddress == "0xD83EF3eDb656DB9502eB658dBc5831d2C345edAA") {
				  contract_abi = draculaHero_abi;
				}
				const nft_contract = new web3.eth.Contract(contract_abi, tokenaddress);
				await nft_contract.methods.transferFrom(account, toaddress, tokenid).send({from: account});
				toast.success('successfully sent.', {
					position: 'top-right',
					autoClose: 3000,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true
				});
				onHide()
			} else {
				console.log("please add install metamask wallet.")
			}
		} catch (error) {
			console.log(error)
			toast.error('failed send', {
				position: 'top-right',
				autoClose: 3000,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true
			});
		}
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
					Send NFT
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
                <div className="modal-content-body">
                    <Form.Label htmlFor="toaddress">To address</Form.Label>
                    <InputGroup className="mb-3" size="lg">
                        <Form.Control
                            id="toaddress"
                            placeholder="To address"
                            aria-label="To address"
                            aria-describedby="to_address"
							value={toaddress}
							onChange={(e) => setToaddress(e.target.value)}
                        />
                    </InputGroup>
                    <button className="confirm-button" onClick={()=>{sendnft()}}>Send NFT</button>
                </div>
			</Modal.Body>
			{/* <Modal.Footer>
				<Button onClick={props.onHide}>Close</Button>
			</Modal.Footer> */}
		</Modal>
	);
}
export default SendModal;
