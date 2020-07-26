// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity >=0.5.0 <0.7.0;

import '@openzeppelin/contracts/access/Ownable.sol';

contract StreamerCredentials is Ownable {
    constructor() public {}

    struct Credentials {
        string ApiKey;
        string ApiSecret;
    }

    mapping(address => Credentials) _userCredentials;

    function setCredentialsAddress(address addr, string memory key, string memory secret) public onlyOwner {
      _userCredentials[addr] = Credentials(key, secret);
    }

    function clearCredentialsAddress(address addr) public onlyOwner {
      _userCredentials[addr] = Credentials('', '');
    }

    function getCredentials() public view returns (string memory, string memory) {
      Credentials memory credentials = _userCredentials[_msgSender()];
      return (credentials.ApiKey, credentials.ApiSecret);
    }

    function setCredentials(string memory key, string memory secret) public {
      _userCredentials[_msgSender()] = Credentials(key, secret);
    }

    function clearCredentials() public {
      _userCredentials[_msgSender()] = Credentials('', '');
    }
}
