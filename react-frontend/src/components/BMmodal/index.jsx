import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function BMdetailModal(props) {
    const { product } = props
    const { id, title, image_url, introduction, datamine, book_price, bookmark_price, bt_contract_address, bm_contract_address, hb_contract_address } = product
    
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
                <button type="button" className="btn btn-primary btn-sm" onClick="">Buy Bookmark</button>
                <hr/>
                <h5>For owner <span id="ownerspan">unknown</span></h5>
                <button type="button" className="btn btn-primary btn-sm" id="btn-sell-bmrk" onClick="sellthisbookmark(event)">Sell bookmark</button>
                  for: <input type="text" id="sellerprice" name="fname" value="5" /><br/>
                <button type="button" className="btn btn-primary btn-sm" id="btn-send-bmrk" onClick="sendthisbookmark(event)">Send bookmark</button>
                  to: <input type="text" id="toaddress" name="fname" value="0x213E6E4167C0262d8115A8AF2716C6C88a6905FD" size="42" /><br/>
                <br/>
                <hr/>
                <h5>Use the Great Library's faucets directly...</h5>
                <button type="button" className="btn btn-primary btn-sm" id="btn-test-faucet" onClick="testlibraryfaucet(event)">Request a new Culture Coin Seedling</button>

                <button type="button" className="btn btn-primary btn-sm" id="btn-test-bmrk" onClick="testthisbookmark(event)">Test bookmark</button>
                <input type="text" id="testprice" name="fname" value="Hi BEN!" /><br/><br/>
                <pre id="testresult"></pre>

                <hr/>
                <h5>The Great Library's Bridge</h5>
                <button type="button" className="btn btn-primary btn-sm" id="btn-apply-rates" onClick="applydexrates(event)">Apply DEX rates</button>
                X Rate: <input type="text" id="dexXMTSPRateId" size="5" value="" /> CC Rate: <input type="text" id="dexCCRateId" size="5" value="" /><br/><br/>
                <button type="button" className="btn btn-primary btn-sm" id="btn-find-rates" onClick="finddexrates(event)">Find new DEX rates</button>
                <hr/>
                <button type="button" className="btn btn-primary btn-sm" id="btn-set-stake-rate" onClick="setstakerate(event)">Set Stake Rate</button>
                Stake Rate: <input type="text" id="stakerateid" size="5" value="" />
                <button type="button" className="btn btn-primary btn-sm" id="btn-get-stake-rate" onClick="getstakerate(event)">Get Stake Rate</button>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
        </Modal>
    );
}
export default BMdetailModal;