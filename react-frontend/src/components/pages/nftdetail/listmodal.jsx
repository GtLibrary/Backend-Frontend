import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { ethers } from "ethers";
import { toast } from 'react-toastify';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import AuctionHouse_abi from '../../../utils/contract/AuctionHouse.json';

function ListModal(props) {
	const provider_url = process.env.REACT_APP_PROVIDERURL;
    // const priceUnit = process.env.REACT_APP_NATIVECURRENCYNAME;
    const priceUnit = "CC";
	const auctionhouse_address = process.env.REACT_APP_AUCTIONHOUSEADDRESS;
	const { account } = useWeb3React();
    const { show, onHide,  tokenaddress, tokenid } = props;

	const web3 = new Web3(window.ethereum);
	
	const [sellprice, setSellprice] = useState(0);

	useEffect(() => {
		const loadcontractdata = async () => {
			const auctionhouse_contract = new web3.eth.Contract(AuctionHouse_abi, auctionhouse_address);
			const price = await auctionhouse_contract.methods.price(tokenaddress, tokenid).call();
			setSellprice(price);
		};
		loadcontractdata();
	}, [show]);

    const listcomplete = async () => {
		try {
			if(window.ethereum) {
				const auctionhouse_contract = new web3.eth.Contract(AuctionHouse_abi, auctionhouse_address);
				await auctionhouse_contract.methods.sell(tokenaddress, tokenid, sellprice).send({from: account});
				toast.success('successfully listed.', {
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
			toast.error('failed listed', {
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
							value={sellprice}
							onChange={(e) => setSellprice(e.target.value)}
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
