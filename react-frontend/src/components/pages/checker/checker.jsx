import React, { useState } from 'react';
import { useWeb3React } from "@web3-react/core";
import withRouter from "../../../withRouter";
import Layout from "../../shared/layout";
import axios from "axios";
import Web3 from "web3";
import CC_abi from "../../../utils/contract/CultureCoin.json";
import './checker.styles.scss';

const ManuscriptCheckerPage = () => {
  const [manuscript, setManuscript] = useState(null);
  const [email, setEmail] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [signUpForNewsletter, setSignUpForNewsletter] = useState(false);
  const { account } = useWeb3React();

  const web3 = new Web3(Web3.givenProvider);
  const cc_address = process.env.REACT_APP_CULTURECOINADDRESS;
  const contract = new web3.eth.Contract(CC_abi, cc_address);

  const handleFileChange = event => {
    setManuscript(event.target.files[0]);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    if (!manuscript || !email || !agreeToTerms) {
      alert("Please fill all required fields and agree to the terms.");
      return;
    }
    
    // Assuming you have a backend endpoint to handle the submission
    const formData = new FormData();
    formData.append('manuscript', manuscript);
    formData.append('email', email);
    formData.append('newsletter', signUpForNewsletter);

    try {
      // Submit manuscript and email to your backend
      const checkurl = process.env.REACT_APP_API + `checker`;

      await axios.post(checkurl, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      
      // Payment with CultureCoin
      // Replace with your method for payment or token transfer
      // await contract.methods.transfer(/* Recipient Address */, /* Amount */).send({ from: account });
      
      alert('Submission successful!');
    } catch (error) {
      console.error('Submission failed:', error);
      alert('There was a problem with your submission. Please try again.');
    }
  };

  return (
<Layout>
<div style={{minHeight: "80vh"}}>
    <p></p>
<form onSubmit={handleSubmit} className="form-container">
  <h2 className="form-title">Beta Manuscript Checker</h2>
  <div className="input-group">
    <textarea 
  value={manuscript} 
  onChange={e => setManuscript(e.target.value)} 
  required 
  className="form-input" 
  placeholder="Paste your manuscript here."
  rows="10" // Adjust the number of rows as needed
></textarea>

  </div>
  <div className="input-group">
    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your Email" required className="form-input"/>
  </div>
  <div className="checkbox-group">
    <label className="form-checkbox">
      <input type="checkbox" checked={agreeToTerms} onChange={e => setAgreeToTerms(e.target.checked)} required />
      Agree to Terms
    </label>
  </div>
  <div className="checkbox-group">
    <label className="form-checkbox">
      <input type="checkbox" checked={signUpForNewsletter} onChange={e => setSignUpForNewsletter(e.target.checked)} />
      Sign Up for Newsletter
    </label>
  </div>
  <div className="submit-group">
    <button type="submit" className="submit-button">Submit <span style={{ textDecoration: "line-through" }}>& Pay</span></button>
  </div>
</form>
</div>
</Layout>
  );
};

export default withRouter(ManuscriptCheckerPage);
