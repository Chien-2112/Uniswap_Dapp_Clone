const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SwapMultiHop", () => {
    let swapMultiHop;
    let accounts;
    let weth;
    let dai;
    let swapRouter;
    let owner;
    let user;

    before(async () => {
		accounts = await ethers.getSigners();
		owner = accounts[0];
		user = accounts[1];
	
		const MockWETH = await ethers.getContractFactory("MockWETH");
		const wethTx = await MockWETH.deploy();
		weth = await wethTx.waitForDeployment();
		console.log("MockWETH deployed at:", weth.target);
	
		const MockDAI = await ethers.getContractFactory("MockDAI");
		const daiTx = await MockDAI.deploy();
		dai = await daiTx.waitForDeployment();
		console.log("MockDAI deployed at:", dai.target);
	
		const MockSwapRouter = await ethers.getContractFactory("MockSwapRouter");
		const swapRouterTx = await MockSwapRouter.deploy(weth.target, dai.target);
		swapRouter = await swapRouterTx.waitForDeployment();
		console.log("MockSwapRouter deployed at:", swapRouter.target);
	
		const SwapMultiHop = await ethers.getContractFactory("SwapMultiHop");
		const swapMultiHopTx = await SwapMultiHop.deploy(
			swapRouter.target,
			weth.target,
			dai.target
		);
		swapMultiHop = await swapMultiHopTx.waitForDeployment();
		console.log("SwapMultiHop deployed at:", swapMultiHop.target);
	
		const amountIn = ethers.parseUnits("9000", 18);
		await weth.connect(user).deposit({ value: amountIn });
	
		await dai.transfer(swapRouter.target, ethers.parseUnits("1000000", 18));
	
		await weth.deposit({ value: ethers.parseUnits("10", 18) });
		await weth.transfer(swapRouter.target, ethers.parseUnits("10", 18));
	
		await weth.connect(user).approve(swapMultiHop.target, amountIn);
	});

    it("swapExactInputMultihop", async () => {
        const amountIn = ethers.parseUnits("10", 18);
        const amountOutMinimum = ethers.parseUnits("8500", 18);

        const path = ethers.AbiCoder.defaultAbiCoder().encode(
            ["address", "uint24", "address"],
            [weth.target, 3000, dai.target]
        );

        const wethBalanceBefore = await weth.balanceOf(user.address);
        const daiBalanceBefore = await dai.balanceOf(user.address);
        console.log("WETH balance before:", ethers.formatUnits(wethBalanceBefore, 18));
        console.log("DAI balance before:", ethers.formatUnits(daiBalanceBefore, 18));

        const tx = await swapMultiHop.connect(user).swapExactInputMultihop(
            amountIn,
            amountOutMinimum,
            path
        );
        await tx.wait();

        const wethBalanceAfter = await weth.balanceOf(user.address);
        const daiBalanceAfter = await dai.balanceOf(user.address);
        console.log("WETH balance after:", ethers.formatUnits(wethBalanceAfter, 18));
        console.log("DAI balance after:", ethers.formatUnits(daiBalanceAfter, 18));

        expect(wethBalanceAfter).to.be.lt(wethBalanceBefore);
        expect(daiBalanceAfter).to.be.gt(daiBalanceBefore);
    });

    it("swapExactOutputMultihop", async () => {
        const amountOut = ethers.parseUnits("5000", 18);
        const amountInMaximum = ethers.parseUnits("6000", 18); // Tăng lên 6000 WETH

        const path = ethers.AbiCoder.defaultAbiCoder().encode(
            ["address", "uint24", "address"],
            [dai.target, 3000, weth.target]
        );

        const wethBalanceBefore = await weth.balanceOf(user.address);
        const daiBalanceBefore = await dai.balanceOf(user.address);
        console.log("WETH balance before:", ethers.formatUnits(wethBalanceBefore, 18));
        console.log("DAI balance before:", ethers.formatUnits(daiBalanceBefore, 18));

        const tx = await swapMultiHop.connect(user).swapExactOutputMultihop(
            amountOut,
            amountInMaximum,
            path
        );
        await tx.wait();

        const wethBalanceAfter = await weth.balanceOf(user.address);
        const daiBalanceAfter = await dai.balanceOf(user.address);
        console.log("WETH balance after:", ethers.formatUnits(wethBalanceAfter, 18));
        console.log("DAI balance after:", ethers.formatUnits(daiBalanceAfter, 18));

        expect(wethBalanceAfter).to.be.lt(wethBalanceBefore);
        expect(daiBalanceAfter).to.be.gt(daiBalanceBefore);
    });
});