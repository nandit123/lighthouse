const Migrations = artifacts.require("Migrations");
const FPS = artifacts.require("FPS");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(FPS);
};
