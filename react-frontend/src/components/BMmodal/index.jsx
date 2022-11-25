import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useMoralis } from "react-moralis";
import Web3 from 'web3';
import printingpress_abi from "../../utils/contract/PrintingPress.json"
import NBT_abi from "../../utils/contract/BookTradable.json"
import Marketplace_abi from "../../utils/contract/MarketPlace.json"
import CC_abi from "../../utils/contract/CultureCoin.json"
import Hero_abi from "../../utils/contract/Hero.json"

function BMdetailModal(props) {
    const { user } = useMoralis();
  
    const web3 = new Web3(window.ethereum);
    const { product, curserial_num } = props
    const printpress_abi = printingpress_abi;
    const marketplace_abi = Marketplace_abi;
    const cc_abi = CC_abi;
    const hero_abi = Hero_abi;
    const printpress_address = process.env.REACT_APP_PRINTINGPRESSADDRESS;
    const marketPlaceAddress = process.env.REACT_APP_MARKETPLACEADDRESS;
    const cultureCoinAddress = process.env.REACT_APP_CULTURECOINADDRESS;
    const hero_address = process.env.REACT_APP_HEROADDRESS
    const cc_initial_balance = process.env.REACT_APP_CC_INITIAL_BALANCE;
    const ccTotalSupplyStart = process.env.REACT_APP_CCTOTALSUPPLYSTART;

    const { datamine, bookmark_price, bm_contract_address, hb_contract_address, hardbound_price } = product
    const tokenid = curserial_num;
    
    const [dexrate, setDexrate] = useState(0);
    const [stakerate, setStakerate] = useState(0);
    const [tosendaddress, setTosendaddress] = useState('');
    const [sellerprice, setSellerprice] = useState(0);
    const [xmsprate, setXmsprate] = useState(0);
    const [ccrate, setCcrate] = useState(0);
    const [bmContractowner, setBmContractowner] = useState('');

    useEffect(async () => {
        
        const NBTcontract = new web3.eth.Contract(NBT_abi,bm_contract_address);
        const contractOwner = await NBTcontract.methods.owner().call();
        setBmContractowner(contractOwner)
    }, [])

    let user_wallet;
    if(user) {
        user_wallet = user.get("ethAddress");
    } else {
        user_wallet = ""
    }

    const buyBookMark = async () => {
        const printpress_contract = new web3.eth.Contract(printpress_abi, printpress_address);

        await printpress_contract.methods.buyBook(bm_contract_address).send({
            from: user_wallet,
			value: web3.utils.toWei(String(bookmark_price)),
            gas: 800000
        });
    }

    const buyBookHardbound = async () => {
        const printpress_contract = new web3.eth.Contract(printpress_abi, printpress_address);

        await printpress_contract.methods.buyBook(hb_contract_address).send({
            from: user_wallet,
			value: web3.utils.toWei(String(hardbound_price)),
            gas: 800000
        });
    }

    const sellthisbookmark = async () => {

        const NBTcontract = new web3.eth.Contract(NBT_abi,bm_contract_address);
        const contractOwner = await NBTcontract.methods.owner().call();
        
        const approved = await NBTcontract.methods.getApproved(tokenid).call();
    
        if (approved != marketPlaceAddress){
            const tokenOnwner = await NBTcontract.methods.ownerOf(tokenid).call();
            console.log("tokenOnwner:", tokenOnwner);
            await approveMarketPlace(bm_contract_address, tokenid);
            for(var i = 0; i < 10; i++) {
                const approved = await NBTcontract.methods.getApproved(tokenid).call();
                console.log("approved:", approved);
                if (approved.toLowerCase() == marketPlaceAddress.toLowerCase()) {
                    break;
                }
                await sleep(3000);
            }
        }
    
        const offering = await placeOfferingOwner(user_wallet, bm_contract_address, tokenid, sellerprice);
    }

    const approveMarketPlace = async (contractaddress, tokenid) => {
        const NBTcontract = new web3.eth.Contract(NBT_abi,contractaddress);
    	await NBTcontract.methods.approve(marketPlaceAddress, tokenid).call();
    }

    const placeOfferingOwner = async (_address, _hostContract, _tokenId, _price) => {
        const contract = new web3.eth.Contract(marketplace_abi, marketPlaceAddress);
        const price = web3.utils.toWei(_price, "ether");
        return await contract.methods.placeOffering(_hostContract, _tokenId, price).send({ from: _address});	
    }

    const sendthisbookmark = async () => {
        
        const NBTcontract = new web3.eth.Contract(NBT_abi, bm_contract_address);
        var  tokenOwner = await NBTcontract.methods.ownerOf(tokenid).call();
        console.log("tokenOwner:", tokenOwner);
    
        if(user_wallet.toLowerCase() != tokenOwner.toLowerCase()) {
            // alert("You are not the owner of this token. You cannot give it away... Trying anyway. Failure likely...");
        }
    
        await NBTcontract.methods.transferFrom(user_wallet, tosendaddress, tokenid).send({from: user_wallet});
    }

    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const applydexrates = async () => {

    }

    const finddexrates = async () => {
        const cc = new web3.eth.Contract(cc_abi, cultureCoinAddress);
    
        const curBal = await cc.methods.balanceOf(cultureCoinAddress).call();
    
        const curBalDiff = cc_initial_balance - curBal;
    
        const curBurn = ccTotalSupplyStart - await cc.methods.totalSupply().call();
    
        const curCCOutstanding = curBalDiff - curBurn;
    
        const curXBal = await cc.methods.B().call();
    
        const ratioXMTSPPerCC = curXBal/curCCOutstanding;
    
        const newRatioXMTSPPerCC = ratioXMTSPPerCC * (1 - 0.01);
        setXmsprate(newRatioXMTSPPerCC)
        setCcrate(1/ratioXMTSPPerCC)
    
        const curRatio = await cc.methods.getDexCCRate().call();
    
        const changeInRatio = newRatioXMTSPPerCC - web3.utils.fromWei(curRatio);
    }

    const setCCstakerate = async () => {
        const cc = new web3.eth.Contract(CC_abi, cultureCoinAddress);
    
        const newRate = 1.0 / (stakerate / 100);
        cc.methods.setRewardPerHour(newRate).send({from: user_wallet});

    }

    const getstakerate = async () => {

        const rewardRate = await getRewardRate();
        const percentRate = 1.0 / rewardRate * 100;
        setStakerate(percentRate)
    }

    const getRewardRate = async () => {
        const cc = new web3.eth.Contract(cc_abi, cultureCoinAddress);
        return await cc.methods.getRewardPerHour().call()
    }

    const minthero = async (_token_id, _class, _price) => {
        const to_address = user.get("ethAddress")
        const from_address = user.get("ethAddress")
        const token_price = web3.utils.toWei(_price)

        const HEROS = new web3.eth.Contract(hero_abi, hero_address);
        const ret = await HEROS.methods.heroMint(_token_id, to_address, _class, token_price).send({from: from_address});
    
        console.log("mintHero: " + JSON.stringify(ret));
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
                Inspecting Bookmark
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div>
                <p>Price for bookmark: {curserial_num} {datamine}</p>
                <p>Contract Address: {bm_contract_address}</p>
                <p>Bookmark Price : {bookmark_price}</p>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => buyBookMark()}>Buy Bookmark</button>
                <hr/>
                <p>Price for Hardbound: HB{datamine}</p>
                <p>Contract Address: {hb_contract_address}</p>
                <p>Hardbound Price : {hardbound_price}</p>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => buyBookHardbound()}>Buy Hardbound</button>
                <hr/>
                <h5>For owner <span id="ownerspan">{bmContractowner}</span></h5>
                <button type="button" className="btn btn-primary btn-sm" id="btn-sell-bmrk" onClick={() => sellthisbookmark()}>Sell bookmark</button>
                  for: <input type="text" id="sellerprice" name="fname" value={sellerprice} onChange={(e)=> setSellerprice(e.target.value)} /><br/>
                <button type="button" className="btn btn-primary btn-sm" id="btn-send-bmrk" onClick={() => sendthisbookmark()}>Send bookmark</button>
                  to: <input type="text" id="toaddress" name="fname" size="42" value={tosendaddress} onChange={(e) => setTosendaddress(e.target.value)}/><br/>
                <br/>
                <hr/>
                <h5>The Great Library's Bridge</h5>
                <button type="button" className="btn btn-primary btn-sm" id="btn-apply-rates" onClick={() => applydexrates()}>Apply DEX rates</button>
                X Rate: <input type="text" id="dexXMTSPRateId" size="5" defaultValue="" /> CC Rate: <input type="text" id="dexCCRateId" size="5" value={dexrate} onChange={(e) => setDexrate(e.target.value)} /><br/><br/>
                <button type="button" className="btn btn-primary btn-sm" id="btn-find-rates" onClick={()=>finddexrates()}>Find new DEX rates</button>
                <hr/>
                <button type="button" className="btn btn-primary btn-sm" id="btn-set-stake-rate" onClick={()=>setCCstakerate()}>Set Stake Rate</button>
                Stake Rate: <input type="text" id="stakerateid" size="5" value={stakerate} onChange={(e) => setStakerate(e.target.value)} />
                <button type="button" className="btn btn-primary btn-sm" id="btn-get-stake-rate" onClick={()=>getstakerate()}>Get Stake Rate</button>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
        </Modal>
    );
}
export default BMdetailModal;