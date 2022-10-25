import React from 'react';
import withRouter from '../../withRouter';
import bigScore from '../../assets/img/template_1.jpg';
import { useNavigate } from "react-router-dom";
import './main-section.styles.scss';

const MainSection = () => {
  const navigate = useNavigate();
  return (
    <div className='main-section-container'>
      <div className='main-section-middle'>
        <div className='ms-m-image'>
          <img src={bigScore} alt='the big score'/>
        </div>
        <div className='ms-m-description'>
          <h2>The Lightshy Crow: Book One of the Scarab Cycle</h2>
          <p>Tomin Ocrin lives only to work glass, so he hides the fact that he is a Marked and wanted man. The scales growing on his chest grant him magic powers which he must never use.

	  Already reeling from a lack of money, things at the glass shop where he works spiral out of control the day his half-brother Rennly reappears in Menad secretly hoping to ruin Tomrin’s life and take his place as their father’s great son. Rennly's machinations quickly lead to the glass shop’s owner’s arrest—and ultimately to his death.

	  With the shop falling to him, Tomrin knows he needs to save it... And he is willing to do almost anything, anything but become the Lightshy Crow. Yet as push comes to shove, Tomrin is forced to choose breaking the god's holy edicts or letting the shop fall to ruin</p>
          <p><i>John R Raymond</i></p>
          <p><b>1 AVAX ($24)</b></p>
          <button className='button is-black' id='shop-now' onClick={()=> navigate('/product/11')}>
            PREORDER
          </button>
        </div>
      </div>
    </div>
  );
}

export default withRouter(MainSection);
