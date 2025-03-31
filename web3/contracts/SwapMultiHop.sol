// SPDX-License-Identifier: MIT
pragma solidity >= 0.7.0 < 0.9.0;

import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SwapMultiHop {
    ISwapRouter public immutable swapRouter;
    address public immutable WETH;
    address public immutable DAI;

    event Swap(
        address indexed user,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOut
    );

    constructor(address _swapRouter, address _weth, address _dai) {
        swapRouter = ISwapRouter(_swapRouter);
        WETH = _weth;
        DAI = _dai;
    }

    function swapExactInputMultihop(
        uint256 amountIn,
        uint256 amountOutMinimum,
        bytes calldata path
    ) external returns (uint256 amountOut) {
        (address tokenIn, , address tokenOut) = abi.decode(path, (address, uint24, address));
        require(tokenIn == WETH, "TokenIn must be WETH");
        require(tokenOut == DAI, "TokenOut must be DAI");

        require(IERC20(WETH).balanceOf(msg.sender) >= amountIn, "Insufficient WETH balance");
        require(
            IERC20(WETH).allowance(msg.sender, address(this)) >= amountIn,
            "Insufficient WETH allowance"
        );

        TransferHelper.safeTransferFrom(WETH, msg.sender, address(this), amountIn);

        TransferHelper.safeApprove(WETH, address(swapRouter), amountIn);

        ISwapRouter.ExactInputParams memory params = ISwapRouter.ExactInputParams({
            path: path,
            recipient: msg.sender,
            deadline: block.timestamp + 15 minutes,
            amountIn: amountIn,
            amountOutMinimum: amountOutMinimum
        });

        amountOut = swapRouter.exactInput(params);
        require(amountOut > 0, "Swap failed: No output received");

        emit Swap(msg.sender, WETH, DAI, amountIn, amountOut);
    }

    function swapExactOutputMultihop(
        uint256 amountOut,
        uint256 amountInMaximum,
        bytes calldata path
    ) external returns (uint256 amountIn) {
        (address tokenOut, , address tokenIn) = abi.decode(path, (address, uint24, address));
        require(tokenIn == WETH, "TokenIn must be WETH");
        require(tokenOut == DAI, "TokenOut must be DAI");

        require(
            IERC20(WETH).balanceOf(msg.sender) >= amountInMaximum,
            "Insufficient WETH balance"
        );
        require(
            IERC20(WETH).allowance(msg.sender, address(this)) >= amountInMaximum,
            "Insufficient WETH allowance"
        );

        TransferHelper.safeTransferFrom(WETH, msg.sender, address(this), amountInMaximum);

        TransferHelper.safeApprove(WETH, address(swapRouter), amountInMaximum);

        ISwapRouter.ExactOutputParams memory params = ISwapRouter.ExactOutputParams({
            path: path,
            recipient: msg.sender,
            deadline: block.timestamp + 15 minutes,
            amountOut: amountOut,
            amountInMaximum: amountInMaximum
        });

        amountIn = swapRouter.exactOutput(params);
        require(amountIn > 0, "Swap failed: No input used");

        if (amountIn < amountInMaximum) {
            TransferHelper.safeApprove(WETH, address(swapRouter), 0);
            TransferHelper.safeTransfer(WETH, msg.sender, amountInMaximum - amountIn);
        }

        emit Swap(msg.sender, WETH, DAI, amountIn, amountOut);
    }
}