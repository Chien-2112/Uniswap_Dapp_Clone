// SPDX-License-Identifier: MIT
pragma solidity >= 0.7.0 < 0.9.0;

import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SwapToken {
    ISwapRouter public swapRouter;
    address public WETH;
    address public DAI;
    address public USDC;

    event Swap(address indexed user, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut);

    constructor(address _swapRouter, address _weth, address _dai) {
        swapRouter = ISwapRouter(_swapRouter);
        WETH = _weth;
        DAI = _dai;
    }

    function swapExactInputSingle(uint256 amountIn, uint256 amountOutMinimum)
        external
        returns (uint256 amountOut)
    {
        require(IERC20(WETH).balanceOf(msg.sender) >= amountIn, "Insufficient WETH balance");
        require(
            IERC20(WETH).allowance(msg.sender, address(this)) >= amountIn,
            "Insufficient WETH allowance"
        );

        TransferHelper.safeTransferFrom(WETH, msg.sender, address(this), amountIn);
        TransferHelper.safeApprove(WETH, address(swapRouter), amountIn);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn: WETH,
            tokenOut: DAI,
            fee: 3000,
            recipient: msg.sender,
            deadline: block.timestamp + 15 minutes,
            amountIn: amountIn,
            amountOutMinimum: amountOutMinimum,
            sqrtPriceLimitX96: 0
        });

        amountOut = swapRouter.exactInputSingle(params);
        require(amountOut > 0, "Swap failed: No output received");
        emit Swap(msg.sender, WETH, DAI, amountIn, amountOut);
    }

    function swapExactOutputSingle(uint256 amountOut, uint256 amountInMaximum)
        external
        returns (uint256 amountIn)
    {
        require(IERC20(WETH).balanceOf(msg.sender) >= amountInMaximum, "Insufficient WETH balance");
        require(
            IERC20(WETH).allowance(msg.sender, address(this)) >= amountInMaximum,
            "Insufficient WETH allowance"
        );

        TransferHelper.safeTransferFrom(WETH, msg.sender, address(this), amountInMaximum);
        TransferHelper.safeApprove(WETH, address(swapRouter), amountInMaximum);

        ISwapRouter.ExactOutputSingleParams memory params = ISwapRouter.ExactOutputSingleParams({
            tokenIn: WETH,
            tokenOut: DAI,
            fee: 3000,
            recipient: msg.sender,
            deadline: block.timestamp + 15 minutes,
            amountOut: amountOut,
            amountInMaximum: amountInMaximum,
            sqrtPriceLimitX96: 0
        });

        amountIn = swapRouter.exactOutputSingle(params);

        if (amountIn < amountInMaximum) {
            TransferHelper.safeApprove(WETH, address(swapRouter), 0);
            TransferHelper.safeTransfer(WETH, msg.sender, amountInMaximum - amountIn);
        }

        emit Swap(msg.sender, WETH, DAI, amountIn, amountOut);
    }
}