import React from 'react';
import withRouter from '../../withRouter';
import bigScore from '../../assets/img/template_1_dracula.png';
import './main-section.styles.scss';

const MainSection = () => {
  const current_symbol = process.env.REACT_APP_NATIVECURRENCYSYMBOL;
  const current_promo_url = "https://books-test.greatlibrary.io/product/9"; // FIXME: put in .env file
  
  return (
    <div className='main-section-container container'>

      <div className="row additional-area">
        <div className="left-decorader img-responsive">
          <img src="/assets/img/left-decorader.png" alt="left decorader"></img>
        </div>
        <div className="additional-title">
          NEW
        </div>
        <div className="right-decorader img-responsive">
          <img src="/assets/img/right-decorader.png" alt="right decorader"></img>
        </div>
      </div>
      <div className='main-section-middle row'>
        <div className='ms-m-image col-md-12 col-lg-4'>
          <img src={bigScore} alt='the big score'/>
        </div>
        <div className='ms-m-description col-md-12 col-lg-8'>
          <h2>Dracula</h2>
          <p>
	Welcome to a world of darkness, fear, and desire. Bram Stoker's Dracula is the quintessential tale of horror, and The Great Library is bringing it to life like never before. Immerse yourself in the terrifying world of the undead as you follow the path of Jonathan Harker, Mina Harker, and Abraham Van Helsing, in their quest to stop the dreaded Count Dracula. The Great Library has brought the story to a new level by creating a game that puts you in the middle of the action. Will you be brave enough to take on the challenge and defeat the dark lord? Get ready for a heart-pounding adventure that will leave you breathless, and a story that will stay with you long after the last page has been turned. Don't miss your chance to be a part of history and experience Bram Stoker's Dracula like never before, only with The Great Library.
	  </p>
          <p><i>Bram Stoker</i></p>

          <div className="buybook-area">
            <span className="bookprice-tag">1 {current_symbol} (Approximately 15-20 USDC)</span>
            <button type="button" className="btn btn-buybook" onClick={() => window.location.href = current_promo_url} >On Sale Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(MainSection);
