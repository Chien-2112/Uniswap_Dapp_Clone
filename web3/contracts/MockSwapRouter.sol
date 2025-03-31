// SPDX-License-Identifier: MIT
pragma solidity >= 0.7.0 < 0.9.0;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";

contract MockSwapRouter {
    address public weth;
    address public dai;

    uint256 public wethReserve;
    uint256 public daiReserve;
    uint256 public constant FEE = 30; // 0.3%

    constructor(address _weth, address _dai) {
        weth = _weth;
        dai = _dai;
        wethReserve = 1000 * 10**18;
        daiReserve = 1000000 * 10**18;
    }

    function exactInput(
        ISwapRouter.ExactInputParams calldata params
    ) external returns (uint256 amountOut) {
        uint256 amountInAfterFee = (params.amountIn * (10000 - FEE)) / 10000;
        uint256 newWethReserve = wethReserve + amountInAfterFee;
        uint256 newDaiReserve = (wethReserve * daiReserve) / newWethReserve;
        amountOut = daiReserve - newDaiReserve;

        require(amountOut >= params.amountOutMinimum, "MockSwapRouter: Insufficient output amount");
        require(IERC20(dai).balanceOf(address(this)) >= amountOut, "MockSwapRouter: Insufficient DAI balance");

        wethReserve = newWethReserve;
        daiReserve = newDaiReserve;

        require(IERC20(weth).transferFrom(msg.sender, address(this), params.amountIn), "MockSwapRouter: WETH transfer failed");
        require(IERC20(dai).transfer(params.recipient, amountOut), "MockSwapRouter: DAI transfer failed");

        return amountOut;
    }

    function exactOutput(
        ISwapRouter.ExactOutputParams calldata params
    ) external returns (uint256 amountIn) {
        uint256 newDaiReserve = daiReserve - params.amountOut;
        uint256 newWethReserve = (wethReserve * daiReserve) / newDaiReserve;
        uint256 amountInBeforeFee = newWethReserve - wethReserve;

        amountIn = (amountInBeforeFee * 10000) / (10000 - FEE);

        require(amountIn <= params.amountInMaximum, "MockSwapRouter: Too much input required");
        require(IERC20(dai).balanceOf(address(this)) >= params.amountOut, "MockSwapRouter: Insufficient DAI balance");

        wethReserve = newWethReserve;
        daiReserve = newDaiReserve;

        require(IERC20(weth).transferFrom(msg.sender, address(this), amountIn), "MockSwapRouter: WETH transfer failed");
        require(IERC20(dai).transfer(params.recipient, params.amountOut), "MockSwapRouter: DAI transfer failed");

        return amountIn;
    }

    function exactInputSingle(
        ISwapRouter.ExactInputSingleParams calldata params
    ) external returns (uint256 amountOut) {
        uint256 amountInAfterFee = (params.amountIn * (10000 - FEE)) / 10000;
        uint256 newWethReserve = wethReserve + amountInAfterFee;
        uint256 newDaiReserve = (wethReserve * daiReserve) / newWethReserve;
        amountOut = daiReserve - newDaiReserve;

        require(amountOut >= params.amountOutMinimum, "MockSwapRouter: Insufficient output amount");
        require(IERC20(dai).balanceOf(address(this)) >= amountOut, "MockSwapRouter: Insufficient DAI balance");

        wethReserve = newWethReserve;
        daiReserve = newDaiReserve;

        require(IERC20(weth).transferFrom(msg.sender, address(this), params.amountIn), "MockSwapRouter: WETH transfer failed");
        require(IERC20(dai).transfer(params.recipient, amountOut), "MockSwapRouter: DAI transfer failed");

        return amountOut;
    }

    function exactOutputSingle(
        ISwapRouter.ExactOutputSingleParams calldata params
    ) external returns (uint256 amountIn) {
        uint256 newDaiReserve = daiReserve - params.amountOut;
        uint256 newWethReserve = (wethReserve * daiReserve) / newDaiReserve;
        uint256 amountInBeforeFee = newWethReserve - wethReserve;

        amountIn = (amountInBeforeFee * 10000) / (10000 - FEE);

        require(amountIn <= params.amountInMaximum, "MockSwapRouter: Too much input required");
        require(IERC20(dai).balanceOf(address(this)) >= params.amountOut, "MockSwapRouter: Insufficient DAI balance");

        wethReserve = newWethReserve;
        daiReserve = newDaiReserve;

        require(IERC20(weth).transferFrom(msg.sender, address(this), amountIn), "MockSwapRouter: WETH transfer failed");
        require(IERC20(dai).transfer(params.recipient, params.amountOut), "MockSwapRouter: DAI transfer failed");

        return amountIn;
    }
}