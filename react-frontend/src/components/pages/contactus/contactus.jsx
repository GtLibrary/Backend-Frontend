import React from 'react';
import Layout from '../../shared/layout';
import './terms.styles.scss';

const Terms = () => {
  
  return (
    <Layout>
      <div className='terms-container container'>
        <h2 className='terms-title'>Terms and Services</h2>
        <div className='terms row'>
          <p>By accessing and using this website, you agree to comply with all the rules and regulations set forth by the site. The Great Library reserves the right to remove any content that violates these rules or is deemed inappropriate by The Great Library. The Great Library also reserves the right to modify or discontinue the website at any time without notice.</p>

          <p>You acknowledge and agree that The Great Library has no liability for any content or materials posted on the website by users or third parties. The Great Library does not endorse or guarantee the accuracy, completeness, or usefulness of any content or materials posted on the website.</p>

          <p>You understand and agree that the use of NFTs and ERC20s on the website involves risks, including but not limited to market volatility, loss of value, and regulatory uncertainty. You acknowledge that you are solely responsible for your use of NFTs and ERC20s on the website and that The Great Library is not responsible for any losses or damages that may result from such use.</p>

          <p>You agree that any dispute arising from or related to your use of the website will be governed by the laws of South Carolina, without regard to its conflict of law provisions. You further agree that any legal action or proceeding arising from or related to your use of the website will be brought exclusively in the state or federal courts located in South Carolina.</p>

          <p>By using this website, you acknowledge that you have read and understood this disclaimer and agree to be bound by its terms and conditions.</p>
        </div>
      </div>
    </Layout>
  );
}

export default Terms;