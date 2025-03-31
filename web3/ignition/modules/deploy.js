const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  const BooToken = await hre.ethers.getContractFactory("BooToken");
  const booToken = await BooToken.deploy();
  await booToken.waitForDeployment();
  console.log(`BOO deployed to ${booToken.target}`);

  const LifeToken = await hre.ethers.getContractFactory("LifeToken");
  const lifeToken = await LifeToken.deploy();
  await lifeToken.waitForDeployment();
  console.log(`LIFE deployed to ${lifeToken.target}`);

  const MockSwapRouter = await hre.ethers.getContractFactory("MockSwapRouter");
  const mockSwapRouter = await MockSwapRouter.deploy(booToken.target, lifeToken.target);
  await mockSwapRouter.waitForDeployment();
  console.log(`MOCK SWAP ROUTER deployed to ${mockSwapRouter.target}`);

  const SingleSwapToken = await hre.ethers.getContractFactory("SwapToken");
  const singleSwapToken = await SingleSwapToken.deploy(
    mockSwapRouter.target,
    booToken.target,    
    lifeToken.target,   
  );
  await singleSwapToken.waitForDeployment();
  console.log(`SINGLE SWAP TOKEN deployed to ${singleSwapToken.target}`);

  const SwapMultiHop = await hre.ethers.getContractFactory("SwapMultiHop");
  const swapMultiHop = await SwapMultiHop.deploy(
    mockSwapRouter.target,
    booToken.target,     
    lifeToken.target     
  );
  await swapMultiHop.waitForDeployment();
  console.log(`SWAP MULTIHOP deployed to ${swapMultiHop.target}`);

  // MOCK WETH.
  const MockWETH = await hre.ethers.getContractFactory("MockWETH");
  const mockWETH = await MockWETH.deploy();
  await mockWETH.waitForDeployment();
  console.log(`MOCK WETH deployed to ${mockWETH.target}`);

  // MOCK DAI.
  const MockDAI = await hre.ethers.getContractFactory("MockDAI");
  const mockDAI = await MockDAI.deploy();
  await mockDAI.waitForDeployment();
  console.log(`MOCK DAI deployed to ${mockDAI.target}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });