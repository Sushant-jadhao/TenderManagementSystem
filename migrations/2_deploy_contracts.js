const TenderManagement = artifacts.require("TenderManagement");

module.exports = function (deployer) {
  deployer.deploy(TenderManagement);
};
