const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });


async function main() {
  const kingOfTheHillContract = await ethers.getContractFactory("KingOfTheHill")

  const deployedKingOfTheHillContract = await kingOfTheHillContract.deploy({ value: ethers.utils.parseEther("0.001") })

  await deployedKingOfTheHillContract.deployed()

  console.log("KingOfTheHill Contract: ", deployedKingOfTheHillContract.address)
}

// Async Sleep function
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
