const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SwapToken", () => {
    let swapToken;
    let accounts;
    let weth;
    let dai;
    let swapRouter;
    let owner;
    let user;

    before(async () => {
        // Lấy danh sách tài khoản
        accounts = await ethers.getSigners();
        owner = accounts[0];
        user = accounts[1];

        const MockWETH = await ethers.getContractFactory("MockWETH");
        weth = await MockWETH.deploy(); // Không cần waitForDeployment ở đây
        console.log("MockWETH deployed at:", weth.target);

        const MockDAI = await ethers.getContractFactory("MockDAI");
        dai = await MockDAI.deploy();
        console.log("MockDAI deployed at:", dai.target);

        const MockSwapRouter = await ethers.getContractFactory("MockSwapRouter");
        swapRouter = await MockSwapRouter.deploy(weth.target, dai.target);
        console.log("MockSwapRouter deployed at:", swapRouter.target);

        const SwapToken = await ethers.getContractFactory("SwapToken");
        swapToken = await SwapToken.deploy(
            swapRouter.target,
            weth.target,
            dai.target,
        );
        console.log("SwapToken deployed at:", swapToken.target);

        const amountIn = ethers.parseUnits("20", 18);
        await weth.connect(user).deposit({ value: amountIn });


        await dai.transfer(swapRouter.target, ethers.parseUnits("1000000", 18));
        await weth.connect(user).approve(swapToken.target, amountIn);
    });

    it("swapExactInputSingle", async () => {
        const amountIn = ethers.parseUnits("10", 18);
        const amountOutMinimum = ethers.parseUnits("9000", 18); // Điều chỉnh dựa trên pool

        const wethBalanceBefore = await weth.balanceOf(user.address);
        const daiBalanceBefore = await dai.balanceOf(user.address);
        console.log("WETH balance before:", ethers.formatUnits(wethBalanceBefore, 18));
        console.log("DAI balance before:", ethers.formatUnits(daiBalanceBefore, 18));

        const tx = await swapToken.connect(user).swapExactInputSingle(amountIn, amountOutMinimum);
        await tx.wait();

        const wethBalanceAfter = await weth.balanceOf(user.address);
        const daiBalanceAfter = await dai.balanceOf(user.address);
        console.log("WETH balance after:", ethers.formatUnits(wethBalanceAfter, 18));
        console.log("DAI balance after:", ethers.formatUnits(daiBalanceAfter, 18));

        expect(wethBalanceAfter).to.be.lt(wethBalanceBefore);
        expect(daiBalanceAfter).to.be.gt(daiBalanceBefore);
    });

    it("swapExactOutputSingle", async () => {
        const amountOut = ethers.parseUnits("5000", 18);
        const amountInMaximum = ethers.parseUnits("10", 18); // Điều chỉnh dựa trên pool

        const wethBalanceBefore = await weth.balanceOf(user.address);
        const daiBalanceBefore = await dai.balanceOf(user.address);
        console.log("WETH balance before:", ethers.formatUnits(wethBalanceBefore, 18));
        console.log("DAI balance before:", ethers.formatUnits(daiBalanceBefore, 18));

        const tx = await swapToken.connect(user).swapExactOutputSingle(amountOut, amountInMaximum);
        await tx.wait();

        const wethBalanceAfter = await weth.balanceOf(user.address);
        const daiBalanceAfter = await dai.balanceOf(user.address);
        console.log("WETH balance after:", ethers.formatUnits(wethBalanceAfter, 18));
        console.log("DAI balance after:", ethers.formatUnits(daiBalanceAfter, 18));

        expect(wethBalanceAfter).to.be.lt(wethBalanceBefore);
        expect(daiBalanceAfter).to.be.gt(daiBalanceBefore);
    });
});