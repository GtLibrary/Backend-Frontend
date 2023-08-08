import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import XSpaces_abi from '../../../utils/contract/XSpaces.json';

const AuthorProfile = () => {
  const { account } = useWeb3React();

  console.log("AuthorProfile Account: ", account);

  const provider_url = process.env.REACT_APP_PROVIDERURL;
  const web3 = new Web3(provider_url);
  const xspaces_address = process.env.REACT_APP_XSPACESADDRESS;
  console.log("xspaces_address: ", xspaces_address);
  const contract = new web3.eth.Contract(XSpaces_abi, xspaces_address);

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [message, setMessage] = useState('');
  const [hashtags, setHashtags] = useState('');

  const fetchProfile = async () => {
    try {
      console.log("Fetching account: " , account);
      const profileData = await contract.methods.profiles(account).call();
      if(profileData.name === '') {
        profileData.name = "You have no profile yet."
      }
      setProfile(profileData);
      setName(profileData.name);
      setBio(profileData.bio);
    } catch (exception) {
      setProfile({
        name: 'Error',
        bio: `There was an error fetching the profile data. Please check your connection and try again. Error: ${exception.message}`
      });
    }
  };

  const fetchPosts = async () => {
    try {
      console.log("Fetching posts for: ", account);
      const postIndex = await contract.methods.getLatestXSpaceIndexByAuthor(account).call();
      //const postsData = await contract.methods.xspacesByAuthor(account, postIndex).call();
      //setPosts(postsData);
      const postsData = [];

      for (let i = postIndex; i > postIndex - 50 && i >= 0; i--) {
        const postDataIndex = await contract.methods.xspacesByAuthor(account, i).call();
        console.log("Fetched post data index: ", postDataIndex);
        const postData = await contract.methods.getXSpace(postDataIndex).call();
        postData[3] = i;
        console.log("Fetched post data: ", postData);
        postsData.push(postData);
      }

      setPosts(postsData);

    } catch (exception) {
      console.log("failed to get post data: ", exception);
      setPosts([{
        message: 'No Posts found',
        hashtags: [``]
      }]);
    }
  };

useEffect(() => {
  fetchProfile();
  fetchPosts();
}, [account]);

  const createProfile = async () => {
    const localweb3 = new Web3(window.ethereum);
    const contract = new localweb3.eth.Contract(XSpaces_abi, xspaces_address);
    try {
      console.log("account: ", account);
      await contract.methods.createProfile(name, bio).send({ from: account });
      fetchProfile();
    } catch (exception) {
      console.error(`Error creating profile: ${exception}`);
    }
  };

  const createPost = async () => {
    const localweb3 = new Web3(window.ethereum);
    const contract = new localweb3.eth.Contract(XSpaces_abi, xspaces_address);
    try {
      const hashtagsArray = hashtags.split(' ').map(tag => tag.trim());
      if (hashtagsArray.length > 5) {
        hashtagsArray.length = 5;
      } else {
        while (hashtagsArray.length < 5) {
          hashtagsArray.push('');
        }
      }
      await contract.methods.createXSpace(message, hashtagsArray).send({ from: account });
      fetchPosts();
    } catch (exception) {
      console.error(`Error creating post: ${exception}`);
    }
  };

  const myJoin = (mymap)  => {
    try {
      return mymap.join(' ');
    } catch (exception) {
      return "";
    }
  };

  return (
<div style={{ backgroundColor: '#FFEDD9', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
  {profile && (
    <div style={{ backgroundColor: '#F5F5F5', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
      <p>{account}</p>
      <p>{profile.name}</p>
      <p>{profile.bio}</p>
    </div>
  )}

  <div style={{ backgroundColor: '#F5F5F5', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" style={{ width: '100%', marginBottom: '10px' }} />
    <textarea value={bio}onChange={(e) => setBio(e.target.value)} placeholder="Bio" style={{ width: '100%', height: '100px', marginBottom: '10px' }} />
    <button style={{ backgroundColor: '#4CAF50', color: 'white', borderRadius: '12px', padding: '10px 20px' }} onClick={createProfile} >Set 𝕏Profile</button>
  </div>

  <div style={{ backgroundColor: '#F5F5F5', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
    <textarea onChange={(e) => setMessage(e.target.value)} placeholder="Message" style={{ width: '100%', height: '100px', marginBottom: '10px' }} />
    <input onChange={(e) => setHashtags(e.target.value)} placeholder="#Hashtags (capitals matter)" style={{ width: '100%', marginBottom: '10px' }} />
    <button style={{ backgroundColor: '#4CAF50', color: 'white', borderRadius: '12px', padding: '10px 20px' }} onClick={createPost} >Create 𝕏Post</button>
  </div>

  {posts.map((post, index) => (
    <div key={index} style={{ backgroundColor: '#F5F5F5', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
      <p>Message {post[3]}</p>
      <p>By Account: {post[0]}</p>
      <p>Message: {post[1]}</p>
      <p>Hashtags: {myJoin(post[2])}</p>
    </div>
  ))}
</div>
	  /*
    <div>
      {profile && (
        <div>
          <p>{account}</p>
          <h2>{profile.name}</h2>
          <p>{profile.bio}</p>
        </div>
      )}

      <div>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
        <input type="text" value={bio} onChange={e => setBio(e.target.value)} placeholder="Bio" />
        <button onClick={createProfile}>Set Profile</button>
      </div>
      <div>
        <input type="text" value={message} onChange={e => setMessage(e.target.value)} placeholder="Message" />
        <input type="text" value={hashtags} onChange={e => setHashtags(e.target.value)} placeholder="#Hashtags (capitals matter)" />
        <button onClick={createPost}>Create Post</button>
      </div>

      {posts.map((post, index) => (
        <div key={index}>
          <p>Message {post[3]}</p>
          <p>By Account: {post[0]}</p>
          <p>Message: {post[1]}</p>
          <p>Hashtags: {myJoin(post[2])}</p>
        </div>
      ))}
    </div>
  */
  );
};

export default AuthorProfile;
