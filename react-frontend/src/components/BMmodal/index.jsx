import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function BMdetailModal(props) {
    const { product } = props
    const { id, title, image_url, introduction, datamine, book_price, bookmark_price, bt_contract_address, bm_contract_address, hb_contract_address } = product
    const [dexrate, setDexrate] = useState(0)
    const [stakerate, setStakerate] = useState(0)

    const buyBookMark = async () => {

    }

    const sellthisbookmark = async () => {

    }

    const sendthisbookmark = async () => {

    }

    const applydexrates = async () => {

    }

    const finddexrates = async () => {

    }

    const setstakerate = async () => {

    }

    const getstakerate = async () => {

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
                <p>Price for bookmark: {bookmark_price} {datamine}</p>
                <p>Contract Address: {bm_contract_address}</p>
                <p>Price : {book_price}</p>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => buyBookMark()}>Buy Bookmark</button>
                <hr/>
                <h5>For owner <span id="ownerspan">unknown</span></h5>
                <button type="button" className="btn btn-primary btn-sm" id="btn-sell-bmrk" onClick={() => sellthisbookmark()}>Sell bookmark</button>
                  for: <input type="text" id="sellerprice" name="fname" defaultValue="5" /><br/>
                <button type="button" className="btn btn-primary btn-sm" id="btn-send-bmrk" onClick={() => sendthisbookmark()}>Send bookmark</button>
                  to: <input type="text" id="toaddress" name="fname" size="42" /><br/>
                <br/>
                <hr/>
                <h5>The Great Library's Bridge</h5>
                <button type="button" className="btn btn-primary btn-sm" id="btn-apply-rates" onClick={() => applydexrates()}>Apply DEX rates</button>
                X Rate: <input type="text" id="dexXMTSPRateId" size="5" defaultValue="" /> CC Rate: <input type="text" id="dexCCRateId" size="5" value={dexrate} onChange={(e) => setDexrate(e.target.value)} /><br/><br/>
                <button type="button" className="btn btn-primary btn-sm" id="btn-find-rates" onClick={()=>finddexrates()}>Find new DEX rates</button>
                <hr/>
                <button type="button" className="btn btn-primary btn-sm" id="btn-set-stake-rate" onClick={()=>setstakerate()}>Set Stake Rate</button>
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