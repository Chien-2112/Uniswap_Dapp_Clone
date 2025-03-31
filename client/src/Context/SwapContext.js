"use client";

import React, { useState, useEffect } from "react";
import { ethers } from "ethers"; // Chỉ import ethers, không cần BigNumber riêng
import Web3Modal from "web3modal";

// INTERNAL IMPORT
import {
  checkIfWalletConnected,
  connectWallet,
  connectingWithBooToken,
  connectingWithLifeToken,
  connectingWithSingleSwapToken,
  connectingWithIWETHToken,
  connectingWithDAIToken,
} from "../Utils/appFeatures.js";

import { IWETHABI } from "./constants.js";
import ERC20ABI from "./MyToken.json";

export const SwapTokenContext = React.createContext();

export const SwapTokenContextProvider = ({ children }) => {
  const swap = "Welcome to swap my token";

  // USESTATE
  const [account, setAccount] = useState("");
  const [ether, setEther] = useState("");
  const [networkConnect, setNetworkConnect] = useState("");
  const [weth, setWeth] = useState("");
  const [dai, setDai] = useState("");
  const [tokenData, setTokenData] = useState([]);

  const addToken = [
    "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
    "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
  ];

  // FETCH DATA
  const fetchingData = async () => {
    try {
      // GET USER ACCOUNT
      const userAccount = await checkIfWalletConnected();
      setAccount(userAccount);

      // CREATE PROVIDER
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);

      // CHECK BALANCE
      const balance = await provider.getBalance(userAccount);
      const ethValue = ethers.utils.formatEther(balance); 
      setEther(ethValue);

      // GET NETWORK
      const network = await provider.getNetwork();
      setNetworkConnect(network.name);

      // ALL TOKEN BALANCE AND DATA
      const updatedTokenData = await Promise.all(
        addToken.map(async (tokenAddress) => {
          // GETTING CONTRACT
          const contract = new ethers.Contract(tokenAddress, ERC20ABI.abi, provider);
          // GETTING BALANCE OF TOKEN
          const userBalance = await contract.balanceOf(userAccount);
          const convertTokenBal = ethers.utils.formatEther(userBalance);

          // GET NAME AND SYMBOL
          const symbol = await contract.symbol();
          const name = await contract.name();

          return {
            name,
            symbol,
            tokenBalance: convertTokenBal,
          };
        })
      );
      setTokenData(updatedTokenData); // Cập nhật state một lần duy nhất

      // WETH BALANCE
      const wethContract = await connectingWithIWETHToken();
      const wethBal = await wethContract.balanceOf(userAccount);
      const convertWethBal = ethers.utils.formatEther(wethBal);
      setWeth(convertWethBal);

      // DAI BALANCE
      const daiContract = await connectingWithDAIToken(); // Sửa IWETH thành DAI
      const daiBal = await daiContract.balanceOf(userAccount);
      const convertDaiBal = ethers.utils.formatEther(daiBal);
      setDai(convertDaiBal);

      console.log("Token Data: ", updatedTokenData);
      console.log("DAI: ", convertDaiBal, "WETH: ", convertWethBal);
    } catch (err) {
      console.error("Error fetching data: ", err);
    }
  };

  useEffect(() => {
	console.log(tokenData);
    fetchingData();
  }, []);

  return (
    <SwapTokenContext.Provider
      value={{ 
		account, 
		connectWallet, 
		weth, 
		dai, 
		networkConnect, 
		ether,
		tokenData
	  }}
    >
      {children}
    </SwapTokenContext.Provider>
  );
};