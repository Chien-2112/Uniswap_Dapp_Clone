"use client";

import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { SwapTokenContext } from "../../Context/SwapContext.js";

import Style from "./NavBar.module.css";
import images from "../../assets";
import { Model, TokenList } from "../index.js";

const NavBar = () => {
  const context = useContext(SwapTokenContext);

  const { ether, account, networkConnect, connectWallet, tokenData } = context;

  const menuItems = [
    { name: "Swap", link: "/" },
    { name: "Tokens", link: "/" },
    { name: "Pools", link: "/" },
  ];

  const [openModel, setOpenModel] = useState(false);
  const [openTokenBox, setOpenTokenBox] = useState(false);
  console.log(tokenData);

  return (
    <div className={Style.NavBar}>
      <div className={Style.NavBar_box}>
        <div className={Style.NavBar_box_left}>
          {/* LOGO IMAGE */}
          <div className={Style.NavBar_box_left_img}>
            <Image src={images.uniswap} alt="logo" width={50} height={50} />
          </div>

          {/* MENU ITEMS */}
          <div className={Style.NavBar_box_left_menu}>
            {menuItems.map((el, i) => (
              <Link key={i + 1} href={el.link}>
                <p className={Style.NavBar_box_left_menu_item}>{el.name}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* MIDDLE SECTION */}
        <div className={Style.NavBar_box_middle}>
          <div className={Style.NavBar_box_middle_search}>
            <div className={Style.NavBar_box_middle_search_img}>
              <Image src={images.search} alt="search" width={20} height={20} />
            </div>
            <input type="text" placeholder="Search Tokens" />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className={Style.NavBar_box_right}>
          <div className={Style.NavBar_box_right_box}>
            <div className={Style.NavBar_box_right_box_img}>
              <Image src={images.ether} alt="Network" height={30} width={30} />
            </div>
            <p>{networkConnect || "Network"}</p> 
          </div>

          {account ? (
            <button onClick={() => setOpenTokenBox(true)}>
              {account.slice(0, 200)}..
            </button>
          ) : (
              <button onClick={() => setOpenModel(true)}>Connect</button>
          )}

          {/* CONNECT METAMASK */}
          {openModel && (
            <Model setOpenModel={setOpenModel} connectWallet={connectWallet} />
          )}
        </div>
      </div>

      {/* TOKENLIST COMPONENT */}
      {openTokenBox && (
        <TokenList tokenDate={tokenData} setOpenTokenBox={setOpenTokenBox} />
      )}
    </div>
  );
};

export default NavBar;