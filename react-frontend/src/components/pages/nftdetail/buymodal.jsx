import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { ethers } from "ethers";
import { toast } from 'react-toastify';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import AuctionHouse_abi from '../../../utils/contract/AuctionHouse.json';
import CC_abi from "../../../utils/contract/CultureCoin.json";

function BuyModal(props) {
	const provider_url = process.env.REACT_APP_PROVIDERURL;

    	// const priceUnit = process.env.REACT_APP_NATIVECURRENCYNAME;
    	const priceUnit = "AVAX";
    	const priceUnitCC = "CC";
	const { account } = useWeb3React();
	const auctionhouse_address = process.env.REACT_APP_AUCTIONHOUSEADDRESS;
	const cultureCoinAddress = process.env.REACT_APP_CULTURECOINADDRESS;
    	const {show, onHide, tokenaddress, tokenid} = props;

	const web3 = new Web3(provider_url);
	
	const [nftprice, setNftprice] = useState(0);
	const [nftpriceCC, setNftpriceCC] = useState(0);

	useEffect(() => {
		const loadcontractdata = async () => {
			const auctionhouse_contract = new web3.eth.Contract(AuctionHouse_abi, auctionhouse_address);
			const price = await auctionhouse_contract.methods.price(tokenaddress, tokenid).call();
			setNftprice(price);

			const ccoin_contract = new web3.eth.Contract(CC_abi, cultureCoinAddress);
			const curdexrate = await ccoin_contract.methods.getDexCCRate().call();
			console.log("curdexrate: " , curdexrate);
			console.log("price: " , price);

			const priceCC = price / curdexrate + 0.00001;
			console.log("priceCC: ", priceCC);

			setNftpriceCC(web3.utils.toWei("" + priceCC));
		};
		loadcontractdata();
	}, [show]);

	const buyNFTWithCC = async () => {
		try {
                        const localweb3 = new Web3(window.ethereum);
                        const auctionhouse_contract = new localweb3.eth.Contract(AuctionHouse_abi, auctionhouse_address);
                        await auctionhouse_contract.methods.buyWithCC(tokenaddress, tokenid, nftpriceCC).send({from: account});
                        toast.success('successfully Buy this NFT.', {
                                position: 'top-right',
                                autoClose: 3000,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true
                        });
                        onHide();
                } catch (error) {
                        console.log(error)
                        toast.error('failed Buy this NFT', {
                                position: 'top-right',
                                autoClose: 3000,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true
                        });
                }
	}

	const buyNFT = async () => {
		try {
			const localweb3 = new Web3(window.ethereum);
			const auctionhouse_contract = new localweb3.eth.Contract(AuctionHouse_abi, auctionhouse_address);
			await auctionhouse_contract.methods.buy(tokenaddress, tokenid).send({from: account, value: nftprice});
			toast.success('successfully Buy this NFT.', {
				position: 'top-right',
				autoClose: 3000,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true
			});
			onHide();
		} catch (error) {
			console.log(error)
			toast.error('failed Buy this NFT', {
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
                Buy NFT
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>

        <div className="modal-content-body">
            <Form.Label htmlFor="list-price">Current Token Price</Form.Label>
            <InputGroup className="mb-3" size="lg">

                <Form.Control
                    id="list-price"
                    placeholder="Price"
                    aria-label="Price"
                    aria-describedby="list_price"
                    value={ethers.utils.formatEther(nftprice)}
                    disabled={true}
                />

                <InputGroup.Text id="list_price">{priceUnit}</InputGroup.Text>
            </InputGroup>
            <button className="confirm-button" onClick={()=>{buyNFT()}}>Buy now</button>

            {/* Add Culture Coin price and buy button */}
            <Form.Label htmlFor="list-price-cc">Current Token Price in Culture Coin</Form.Label>
            <InputGroup className="mb-3" size="lg">

                <Form.Control
                    id="list-price-cc"
                    placeholder="Price"
                    aria-label="Price"
                    aria-describedby="list_price_cc"
                    value={ethers.utils.formatEther(nftpriceCC)} // Assuming nftpriceCC is the price in Culture Coin
                    disabled={true}
                />

                <InputGroup.Text id="list_price_cc">{priceUnitCC}</InputGroup.Text>
            </InputGroup>
            <button className="confirm-button" onClick={()=>{buyNFTWithCC()}}>Buy with CC</button>
        </div>
        </Modal.Body>
        {/* <Modal.Footer>
            <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer> */}
    </Modal>
);
/*
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
				
			<div className="modal-content-body">
				<Form.Label htmlFor="list-price">Current Token Price</Form.Label>
				<InputGroup className="mb-3" size="lg">

					<Form.Control
						id="list-price"
						placeholder="Price"
						aria-label="Price"
						aria-describedby="list_price"
						value={ethers.utils.formatEther(nftprice)}
						disabled={true}
					/>

					<InputGroup.Text id="list_price">{priceUnit}</InputGroup.Text>
				</InputGroup>
				<button className="confirm-button" onClick={()=>{buyNFT()}}>Buy now</button>
			</div>
			</Modal.Body>
			{/* <Modal.Footer>
				<Button onClick={props.onHide}>Close</Button>
			</Modal.Footer> *} // FIXME add / back  --JTT
		</Modal>
	);
*/
}
export default BuyModal;
