"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

// INTERNAL IMPORT.
import Style from "./Model.module.css";
import images from "./../../assets";

const Model = ({ setOpenModel, connectWallet }) => {
  const walletMenu = ["MetaMask", "Coinbase", "Wallet", "WalletConnect"];

  return (
    <div className={Style.Model}>
      <div className={Style.Model_box}>
        <div className={Style.Model_box_heading}>
          <p>Connect a wallet</p>
          <div className={Style.Model_box_heading_img}>
            <Image
              src={images.close}
              alt="close"
              width={24}
              height={24}
              onClick={() => setOpenModel(false)}
            />
          </div>
        </div>

        <div className={Style.Model_box_wallet}>
          {walletMenu.map((el, i) => (
            <p key={i + 1} onClick={() => connectWallet()}>
              {el}
            </p>
          ))}
        </div>

        <p className={Style.Model_box_para}>
          By connecting a wallet, you agree to Uniswap Lab's{" "}
          <a href="#">Terms of Service</a> and consent to its{" "}
          <a href="#">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
};

export default Model;