"use client";
import React, { useState, useContext, useEffect } from "react";

// INTERNAL IMPORT.
import { HeroSection } from "../Components/index.js";

const Home = () => {
	return (
		<div>
			<HeroSection accounts="hey"
				tokenData='DATA'
			/>
		</div>
	);
}
 
export default Home;