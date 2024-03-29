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
	const provider_url = process.env.REACT_APP_PROVIDERURL;
	const { account } = useWeb3React();

	const web3 = new Web3(window.ethereum);
	const { bookmarkinfo, show } = props;

	console.log("bookmarkinfo: ", bookmarkinfo);
	
	const curpricesymbol = process.env.REACT_APP_NATIVECURRENCYSYMBOL;
	let _token_id, _class, _price
	let bm_id;
	let token_id;
	let tokenname;
	let tokenprice;
	let contract_address;
	if (bookmarkinfo) {
		bm_id = bookmarkinfo.bm_id;
		token_id = bookmarkinfo.token_id;
		tokenname = bookmarkinfo.tokenname;
		tokenprice = bookmarkinfo.tokenprice;
		contract_address = bookmarkinfo.contract_address;
	} else {
		bm_id = 0;
		token_id = "";
		tokenname = "";
		tokenprice = 0;
		contract_address = "";
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
	const minimart_address = process.env.REACT_APP_MINIMARTADDRESS;
	console.log("miniMart addr: ", minimart_address);
	// const cc_initial_balance = process.env.REACT_APP_CC_INITIAL_BALANCE;
	// const ccTotalSupplyStart = process.env.REACT_APP_CCTOTALSUPPLYSTART;

	const [stakerate, setStakerate] = useState(0);
	const [NFTOwner, setNFTOwner] = useState('');
	const [bookmarkprice, setBookmarkprice] = useState(String(tokenprice));
	const [dexrate, setDexrate] = useState(0);
	const [contractowner, setContractowner] = useState('');
	const [tosendaddress, setTosendaddress] = useState('');
	const [actualprice, setActualprice] = useState('');
	const [actualpricecc, setActualpricecc] = useState('');
	const [bookmarkstate, setBookmarkstate] = useState('Unknown');

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
					const globalweb3 = new Web3(provider_url);
					const ccoin_contract = new globalweb3.eth.Contract(CC_abi, cultureCoinAddress);
					const curdexrate = await ccoin_contract.methods.getDexCCRate().call();
					setDexrate(globalweb3.utils.fromWei(curdexrate));

					const bookTradable = new ethers.Contract(
						contract_address,
						bt_abi,
						signer
					);
					const contract_owner = await bookTradable.owner();
					setContractowner(contract_owner)
					try {
						console.log("Token_id: ", token_id);
						console.log("Bm_id: ", bm_id);
						console.log("bookmarkinfo.contract_address: ", bookmarkinfo.contract_address);
						console.log("minimart_address: ", minimart_address);
						console.log("dexrate: ", dexrate);
						const owner = await bookTradable.ownerOf(bm_id);					
						console.log("owner: ", owner);
						const miniMart = new ethers.Contract(minimart_address, minimart_abi, signer);
						const price = await miniMart.price(bookmarkinfo.contract_address,bm_id);
						console.log("Actual price: ", price);
						if(price > 0) {
							setActualprice(ethers.utils.formatEther("" + price));
							setActualpricecc(ethers.utils.formatEther("" + (price / dexrate)));
							setBookmarkstate("Listed");
						} else {
							setActualprice("Not listed");
							setActualpricecc("Not listed");
							setBookmarkstate("Not Listed");
						}

						setNFTOwner(owner);
					} catch (myerror) {
						console.log("error: ", myerror);
						setNFTOwner("");
						if(bm_id == token_id + 1) {
							console.log("batter up!");
							setActualprice(bookmarkinfo.tokenprice);
							setActualpricecc(bookmarkinfo.tokenprice / dexrate);
							setBookmarkstate("Current");
						} else {
							setActualprice("Token not yet available. (See #" + (token_id + 1) + ")");
							setActualpricecc("Token not yet available. (See #" + (token_id + 1) + ")");
							setBookmarkstate("Future");
						}
					}
					

				} catch (myerror) {
					console.log("Big error....");
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

        const buyBookMarkMM = async () => {
                try {
                        const minimart_contract = new web3.eth.Contract(
                                minimart_abi,
                                minimart_address
                        );
                        await minimart_contract.methods.buy(contract_address, bm_id).send({
                                from: user_wallet,
                                value: web3.utils.toWei(String(actualprice))
                        });
                } catch (error) {
                        console.log(error)
                }
        };
	const buyBookMarkMMCC = async () => {
		try {
                        const minimart_contract = new web3.eth.Contract(
                                minimart_abi,
                                minimart_address
                        );
			const ccoin_contract = new web3.eth.Contract(CC_abi, cultureCoinAddress);
                        const curdexrate = await ccoin_contract.methods.getDexCCRate().call();

			var price = actualprice / web3.utils.fromWei(curdexrate) + 0.00001;

                        await minimart_contract.methods.buyWithCC(contract_address, bm_id, web3.utils.toWei(String(actualprice))).send({
                                from: user_wallet,
                        });

		} catch (myerror) {
			console.log(myerror);
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
			const tx = await bookTradable.setDefaultPrice(web3.utils.toWei(bookmarkprice));
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
			const tx = await miniMart.sell(contract_address, token_id, web3.utils.toWei(bookmarkprice));
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
					<div style={{fontFamily: 'Crimson Text', fontSize: '18px'}}>
						<p><label style={{ fontWeight: '600'}}>Bookmark ID:</label>  {tokenname} #{bm_id}</p>
						<p><label style={{ fontWeight: '600'}}>Bookmark Token Contract Address:</label> {contract_address}</p>
						<p><label style={{ fontWeight: '600'}}>Current Token Owner:</label> { NFTOwner === '' ? 'Not Minted Yet' : NFTOwner }</p>
						<p><label style={{ fontWeight: '600'}}>Token Price ({curpricesymbol}):</label> {actualprice}</p>
						<p><label style={{ fontWeight: '600'}}>Token Price (CCoin):</label> {actualpricecc}</p>
						<p><label style={{ fontWeight: '600'}}>Your Account:</label> {account}</p>


{ (bookmarkstate === "Current" || bookmarkstate === "Future") && (
    <>
        <button
            type="button"
            className="btn btn-primary btn-md"
            onClick={() => buyBookMark()}
        >
            Buy #{token_id+1} Bookmark Now
        </button>
         
        <button
            type="button"
            className="btn btn-primary btn-md"
            onClick={() => buyBookMarkCC()}
        >
            Buy #{token_id+1} Bookmark with CC
        </button>
    </>
)}
{ (bookmarkstate === "Listed") && (
    <>
        <button
            type="button"
            className="btn btn-primary btn-md"
            onClick={() => buyBookMarkMM()}
        >
            Buy #{bm_id} Bookmark Now
        </button>
         
        <button
            type="button"
            className="btn btn-primary btn-md"
            onClick={() => buyBookMarkMMCC()}
        >
            Buy #{bm_id} Bookmark with CC
        </button>
    </>
)}



						{ account === NFTOwner ? (
							<>
								<hr/>
								<button
									type="button"
									className="btn btn-danger btn-md"
									onClick={() => sellBookMark()}
									>
									Sell #{bm_id} Bookmark Now
								</button>
								&nbsp;
								<input type="text" value={bookmarkprice} onChange={(e) => {setBookmarkprice(e.target.value)}}></input>
								<br></br>
								<div style={{marginTop: '20px'}}>
								</div>
							</>
						) : (
						<></>
						)}
						{contractowner === account ? (
						<div style={{display: 'flex', flexDirection: "row", justifyContent: 'flex-start', marginTop: '20px'}}>
							<hr/>
							<label style={{ fontWeight: '600', fontSize: '18px'}}>To:</label>&nbsp;<input type="text" id="toaddress" name="fname" size="42" value={tosendaddress} onChange={(e) => setTosendaddress(e.target.value)}/>&nbsp;&nbsp;
							<button type="button" className="btn btn-primary btn-md" id="btn-send-bmrk" onClick={() => sendthisbookmark()}>Send bookmark</button>
						</div>
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
