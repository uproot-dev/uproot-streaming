const Contract = artifacts.require("StreamerCredentials");

module.exports = function(deployer) {
  deployer.deploy(Contract);
};
