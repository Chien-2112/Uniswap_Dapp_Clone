import { ethers } from "ethers";
import Web3Modal from "web3modal";

import { 
	BooTokenAddress,
	BooTokenABI, 
	LifeTokenAddress,
	LifeTokenABI,
	SingleSwapTokenAddress,
	SingleSwapTokenABI,
	SwapMultiHopAddress,
	SwapMultiHopABI,
	IWETHAddress,
	IWETHABI
} from "../Context/constants.js";

// CHECK IF WALLET IS CONNECT.
export const checkIfWalletConnected = async() => {
	try {
		if(!window.ethereum) return console.log("Install MetaMask");
		const accounts = await window.ethereum.request({
			method: "eth_accounts",
		});
		const firstAccount = accounts[0];
		return firstAccount;
	} catch(err) {
		console.log(err);
	}
}

// CONNECT WALLET.
export const connectWallet = async() => {
	try {
		if(!window.ethereum) return console.log("Install MetaMask");
		const accounts = await window.ethereum.request({
			method: "eth_requestAccounts",
		});
		const firstAccount = accounts[0];
		return firstAccount;
	} catch(err) {
		console.log(err);
	}
}

// FETCHING CONTRACT-----------------------------

// BOO TOKEN FETCHING.
export const fetchBooContract = (signerOrProvider) => 
	new ethers.Contract(BooTokenAddress, BooTokenABI, signerOrProvider);

// CONNECTING WITH BOO TOKEN CONTRACT.
export const connectingWithBooToken = async() => {
	try {
		const web3modal = new Web3Modal();
		const connection = await web3modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		const signer = provider.getSigner();
		const contract = fetchBooContract(signer);
		return contract;
	} catch(err) {
		console.log(err);
	}
}

// FETCHING CONTRACT-----------------------------

// LIFE TOKEN FETCHING.
export const fetchLifeContract = (signerOrProvider) => 
	new ethers.Contract(LifeTokenAddress, LifeTokenABI, signerOrProvider);

// CONNECTING WITH LIFE TOKEN CONTRACT.
export const connectingWithLifeToken = async() => {
	try {
		const web3modal = new Web3Modal();
		const connection = await web3modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		const signer = provider.getSigner();
		const contract = fetchLifeContract(signer);
		return contract;
	} catch(err) {
		console.log(err);
	}
}

// FETCHING CONTRACT-----------------------------

// SINGLE SWAP TOKEN FETCHING.
export const fetchSingleSwapContract = (signerOrProvider) => 
	new ethers.Contract(
		SingleSwapTokenAddress, 
		SingleSwapTokenABI, 
		signerOrProvider
	);

// CONNECTING WITH SINGLE SWAP TOKEN CONTRACT.
export const connectingWithSingleSwapToken = async() => {
	try {
		const web3modal = new Web3Modal();
		const connection = await web3modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		const signer = provider.getSigner();
		const contract = fetchSingleSwapContract(signer);
		return contract;
	} catch(err) {
		console.log(err);
	}
}

// FETCHING CONTRACT-----------------------------

// IWETH TOKEN FETCHING.
export const fetchIWETHContract = (signerOrProvider) => 
	new ethers.Contract(
		IWETHAddress, 
		IWETHABI, 
		signerOrProvider
	);

// CONNECTING WITH IWETH TOKEN CONTRACT.
export const connectingWithIWETHToken = async() => {
	try {
		const web3modal = new Web3Modal();
		const connection = await web3modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		const signer = provider.getSigner();
		const contract = fetchIWETHContract(signer);
		return contract;
	} catch(err) {
		console.log(err);
	}
}

// FETCHING CONTRACT-----------------------------

// DAI TOKEN FETCHING.
const DAIAddress = "0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1";
export const fetchDAIContract = (signerOrProvider) => 
	new ethers.Contract(
		DAIAddress, 
		IWETHABI, 
		signerOrProvider
	);

// CONNECTING WITH DAI TOKEN CONTRACT.
export const connectingWithDAIToken = async() => {
	try {
		const web3modal = new Web3Modal();
		const connection = await web3modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		const signer = provider.getSigner();
		const contract = fetchDAIContract(signer);
		return contract;
	} catch(err) {
		console.log(err);
	}
}