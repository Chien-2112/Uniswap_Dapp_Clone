// SPDX-License-Identifier: MIT
pragma solidity >= 0.7.0 < 0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LifeToken is ERC20 {

	constructor() ERC20("LF", "Life") {
		_mint(msg.sender, 100000 * 10 ** decimals());
	}

}
// BOO deployed to 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707
// LIFE deployed to 0x0165878A594ca255338adfa4d48449f69242Eb8F
// SINGLE SWAP TOKEN deployed to 0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6
// SWAP MULTIHOP deployed to 0x8A791620dd6260079BF849Dc5567aDC3F2FdC318