import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { ethers } from "ethers";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import printingpress_abi from "../../utils/contract/PrintingPress.json";
import NBT_abi from "../../utils/contract/BookTradable.json";
import Marketplace_abi from "../../utils/contract/MarketPlace.json";
import CC_abi from "../../utils/contract/CultureCoin.json";
import Hero_abi from "../../utils/contract/Hero.json";
import Minimart_abi from "../../utils/contract/MiniMart.json";

function BMdetailModal(props) {
	const { account } = useWeb3React();

	const web3 = new Web3(window.ethereum);
	const { bookmarkinfo, show } = props;
	
	const curpricesymbol = process.env.REACT_APP_NATIVECURRENCYSYMBOL;
	let _token_id, _class, _price
	let bm_id;
	let token_id;
	let tokenname;
	let tokenprice;
	let contract_address;
	let curdexrate;
	if (bookmarkinfo) {
		bm_id = bookmarkinfo.bm_id;
		token_id = bookmarkinfo.token_id;
		tokenname = bookmarkinfo.tokenname;
		tokenprice = bookmarkinfo.tokenprice;
		contract_address = bookmarkinfo.contract_address;
		curdexrate = bookmarkinfo.curdexrate;
	} else {
		bm_id = 0;
		token_id = "";
		tokenname = "";
		tokenprice = 0;
		contract_address = "";
		curdexrate = 0;
	}
	const printpress_abi = printingpress_abi;
	const marketplace_abi = Marketplace_abi;
	const minimart_abi = Minimart_abi;
	const cc_abi = CC_abi;
	const bt_abi = NBT_abi;
	const hero_abi = Hero_abi;
	const printpress_address = process.env.REACT_APP_PRINTINGPRESSADDRESS;
	const marketPlaceAddress = process.env.REACT_APP_MARKETPLACEADDRESS;
	const cultureCoinAddress = process.env.REACT_APP_CULTURECOINADDRESS;
	const hero_address = process.env.REACT_APP_HEROADDRESS;
	const minimart_address = process.env.REACT_APP_MINIMARTADDRESS
	// const cc_initial_balance = process.env.REACT_APP_CC_INITIAL_BALANCE;
	// const ccTotalSupplyStart = process.env.REACT_APP_CCTOTALSUPPLYSTART;
	console.log("tokenprice", tokenprice)

	const [stakerate, setStakerate] = useState(0);
	const [NFTOwner, setNFTOwner] = useState('');
	const [bookmarkprice, setBookmarkprice] = useState(String(tokenprice));
	const [contractowner, setContractowner] = useState('');
	const [tosendaddress, setTosendaddress] = useState('');
	// const [tosendaddress, setTosendaddress] = useState('');
	// const [sellerprice, setSellerprice] = useState(0);
	// const [bookmarks, setBookmarks] = useState([]);
	// const [datamine, setDatamine] = useState('')
	// const [bmContractowner, setBmContractowner] = useState("");


	useEffect(() => {
		const loadcontractdata = async () => {
			const { ethereum } = window;

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				try {
					const bookTradable = new ethers.Contract(
						contract_address,
						bt_abi,
						signer
					);
					const contract_owner = await bookTradable.owner();
					setContractowner(contract_owner)
					try {
						const owner = await bookTradable.ownerOf(token_id + 1);					
						setNFTOwner(owner);
					} catch (myerror) {
						setNFTOwner("");
					}
				} catch (myerror) {
					setNFTOwner("");
				}
				
				//const marketPlace = new ethers.Contract(market_addr, MarketPlaceContract, signer);
				// const miniMart = new ethers.Contract(minimart_address, minimart_abi, signer);

				
				// const accounts = await ethereum.request({ method: 'eth_accounts' });
				// if (accounts.length > 0) {
				//     setAccount(accounts[0]);
				// } else {
				//     setAccount("Your account is unknown.");
				// }

				// const price = "Many Culture Coin"; // await marketPlace.methods.getPrice(tokenId).call();
				// setNFTPrice(price);
			}
		};
		loadcontractdata();
	}, [show]);

	let user_wallet;
	if (account) {
		user_wallet = account;
	} else {
		user_wallet = "";
	}

	const buyBookMark = async () => {
		try {
			const printpress_contract = new web3.eth.Contract(
				printpress_abi,
				printpress_address
			);
			
			// const ccoin_contract = new web3.eth.Contract(CC_abi, cultureCoinAddress);
			// await ccoin_contract.methods.approve(printpress_address, web3.utils.toWei(String(tokenprice))).send({ from: account });
	
			await printpress_contract.methods.buyBook(contract_address).send({
				from: user_wallet,
				value: web3.utils.toWei(String(tokenprice))
			});
		} catch (error) {
			console.log(error)
		}
	};

	const buyBookMarkCC = async () => {
		try {
			const printpress_contract = new web3.eth.Contract(
			printpress_abi,
			printpress_address
			);
			const ccoin_contract = new web3.eth.Contract(CC_abi, cultureCoinAddress);
			const curdexrate = await ccoin_contract.methods.getDexCCRate().call();

			var price = tokenprice / web3.utils.fromWei(curdexrate) + 0.00001;
			
			await ccoin_contract.methods.approve(printpress_address, web3.utils.toWei(String(price))).send({ from: account });
	
			await printpress_contract.methods.buyBookCC(contract_address, web3.utils.toWei(String(price))).send({
				from: user_wallet
			});
		} catch (error) {
			console.log(error)
		}
	};

	const setSellprice = async () => {
		const { ethereum } = window;
		if (!ethereum) {
			console.log("Ethereum not found");
			return;
		}

		const provider = new ethers.providers.Web3Provider(ethereum);
		const signer = provider.getSigner();

		try {
			const bookTradable = new ethers.Contract(
				contract_address,
				bt_abi,
				signer
			);
			const tx = await bookTradable.setDefaultPrice(bookmarkprice);
			await tx.wait();
			console.log("NFT successfully listed for sale");
		} catch (error) {
			console.log("Error listing NFT for sale: ", error);
		}
	}

	const sellBookMark = async () => {
		const { ethereum } = window;
		if (!ethereum) {
			console.log("Ethereum not found");
			return;
		}

		const provider = new ethers.providers.Web3Provider(ethereum);
		const signer = provider.getSigner();

		try {
			const miniMart = new ethers.Contract(minimart_address, minimart_abi, signer);
			const price = await miniMart.getPrice(token_id);
			const tx = await miniMart.sell(contract_address, token_id, price);
			await tx.wait();
			console.log("NFT successfully listed for sale");
		} catch (error) {
			console.log("Error listing NFT for sale: ", error);
		}
	};

	const approveMarketPlace = async (contractaddress, tokenid) => {
		const NBTcontract = new web3.eth.Contract(NBT_abi, contractaddress);
		await NBTcontract.methods.approve(marketPlaceAddress, tokenid).call();
	};

	const placeOfferingOwner = async (
		_address,
		_hostContract,
		_tokenId,
		_price
	) => {
		const contract = new web3.eth.Contract(marketplace_abi, marketPlaceAddress);
		const price = web3.utils.toWei(_price, "ether");
		return await contract.methods
		.placeOffering(_hostContract, _tokenId, price)
		.send({ from: _address });
	};

	const sendthisbookmark = async () => {
		const NBTcontract = new web3.eth.Contract(NBT_abi, contract_address);
		const tokenOwner = await NBTcontract.methods.ownerOf(token_id).call();
		console.log("tokenOwner:", tokenOwner);
		if(user_wallet.toLowerCase() !== tokenOwner.toLowerCase()) {
			alert("You are not the owner of this token. You cannot give it away... Trying anyway. Failure likely...");
		}
		await NBTcontract.methods.transferFrom(user_wallet, tosendaddress, token_id).send({from: user_wallet});
	};

	const sleep = (ms) => {
		return new Promise((resolve) => setTimeout(resolve, ms));
	};

	const applydexrates = async () => {};

	const setCCstakerate = async () => {
		const cc = new web3.eth.Contract(CC_abi, cultureCoinAddress);

		const newRate = 1.0 / (stakerate / 100);
		cc.methods.setRewardPerHour(newRate).send({ from: user_wallet });
	};

	const getstakerate = async () => {
		const rewardRate = await getRewardRate();
		const percentRate = (1.0 / rewardRate) * 100;
		setStakerate(percentRate);
	};

	const getRewardRate = async () => {
		const cc = new web3.eth.Contract(cc_abi, cultureCoinAddress);
		return await cc.methods.getRewardPerHour().call();
	};

	const minthero = async (_token_id, _class, _price) => {
		const to_address = account;
		const from_address = account;
		const token_price = web3.utils.toWei(_price);

		const HEROS = new web3.eth.Contract(hero_abi, hero_address);
		const ret = await HEROS.methods
		.heroMint(_token_id, to_address, _class, token_price)
		.send({ from: from_address });

		console.log("mintHero: " + JSON.stringify(ret));
	};

	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Buy and Sell This NFT
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				
				<Tabs
				defaultActiveKey="bookmark"
				id="uncontrolled-tab-example"
				className="mb-3"
				>
				<Tab eventKey="bookmark" title="Bookmark">
					<div>
						<p>Bookmark ID: {tokenname} #{bm_id}</p>
						<p>Bookmark Token Contract Address: {contract_address}</p>
						<p>Current Token Owner: { NFTOwner === '' ? 'Unknown User' : NFTOwner }</p>
						<p>Current Token Price: {tokenprice} {curpricesymbol}</p>
						<p>Current Token Price By CCoin: {(tokenprice / curdexrate).toFixed(3)} CC</p>
						<p>Your Account: {account}</p>
						<button
							type="button"
							className="btn btn-primary btn-sm"
							onClick={() => buyBookMark()}
						>
							Buy "{tokenname}" Bookmark Now
						</button>
						&nbsp;
						<button
							type="button"
							className="btn btn-primary btn-sm"
							onClick={() => buyBookMarkCC()}
						>
							Buy "{tokenname}" Bookmark with CC
						</button>
						{ account === NFTOwner ? (
							<>
								<hr/>
								<button
									type="button"
									className="btn btn-danger btn-sm"
									onClick={() => sellBookMark()}
									>
									Sell "{tokenname}" Bookmark Now
								</button>
								<br></br>
								<button
									type="button"
									className="btn btn-danger btn-sm"
									onClick={() => setSellprice()}
									>
									Set Bookmark Price
								</button>&nbsp;&nbsp;&nbsp;
								<input type="text" value={bookmarkprice} onChange={(e) => {setBookmarkprice(e.target.value)}}></input>
							</>
						) : (
						<></>
						)}
						{contractowner === account ? (
						<>
							<hr/>
							to: <input type="text" id="toaddress" name="fname" size="42" value={tosendaddress} onChange={(e) => setTosendaddress(e.target.value)}/><br/>
							<button type="button" className="btn btn-primary btn-sm" id="btn-send-bmrk" onClick={() => sendthisbookmark()}>Send bookmark</button>
						</>
						) : (
						<></>
						)}
						{/* <button type="button" className="btn btn-primary btn-sm" id="btn-sell-bmrk" onClick={() => sellthisbookmark()}>Sell bookmark</button>
						for: <input type="text" id="sellerprice" name="fname" value={sellerprice} onChange={(e)=> setSellerprice(e.target.value)} /><br/>
						<button type="button" className="btn btn-primary btn-sm" id="btn-send-bmrk" onClick={() => sendthisbookmark()}>Send bookmark</button>
						to: <input type="text" id="toaddress" name="fname" size="42" value={tosendaddress} onChange={(e) => setTosendaddress(e.target.value)}/><br/> */}
					</div>
				</Tab>
				<Tab eventKey="heroes" title="Heroes">
					<>
					<button type="button" className="btn btn-primary btn-sm" onClick={() => (minthero(_token_id, _class, _price))}>Mint Hero</button>
					</>
				</Tab>
				<Tab eventKey="items" title="Items">
					<></>
				</Tab>
				</Tabs>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={props.onHide}>Close</Button>
			</Modal.Footer>
		</Modal>
	);
}
export default BMdetailModal;
