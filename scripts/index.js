const hre = require("hardhat");
const fs = require("fs");

async function interactWithMonarchs(contractAddress, newKing) {
    // Ensure the provided address is valid
    console.log(contractAddress);
    if (!hre.ethers.utils.isAddress(contractAddress)) {
        throw new Error("Invalid Ethereum address provided.");
    }

    // Get the Monarchs contract instance
    const MonarchsContract = await hre.ethers.getContractFactory('Monarchs');
    const monarchsInstance = await MonarchsContract.attach(contractAddress);

    // Claim the throne with the provided value (newKing in this case is the amount to send)
    const tx = await monarchsInstance.claimThrone({ value: hre.ethers.utils.parseEther(newKing) });
    await tx.wait();
    console.log(`Attempted to claim throne with ${newKing} ETH.`);

    // Retrieve the current king
    const currentKingAddress = await monarchsInstance.currentKing();
    console.log('Current king address:', currentKingAddress);

    // Retrieve the current claim price
    const currentClaimPrice = await monarchsInstance.claimPrice();
    console.log('Current claim price in ETH:', hre.ethers.utils.formatEther(currentClaimPrice));

    // Join the Royal Guild
    const tx2 = await monarchsInstance.joinRoyalGuild();
    await tx2.wait();
    // Join the Royal Guild
    const tx3 = await monarchsInstance.getGuildMembers();
    console.log(tx3)
}

// Main execution
(async () => {


    const contractAddressData = fs.readFileSync('contracts_build/contract-address.json', 'utf8');
    const MONARCHS_CONTRACT_ADDRESS = JSON.parse(contractAddressData)["Monarchs"];
    const ROYALGUILD_CONTRACT_ADDRESS = JSON.parse(contractAddressData)["RoyalGuild"];  // Make sure to add this

    // Extract newKing value from environment variable (amount in ETH to send for claiming throne)
    const newKingValue = process.env.NEW_KING_VALUE;

    if (!newKingValue || typeof newKingValue !== 'string') {
        console.error("Please provide a NEW_KING_VALUE as an environment variable (amount in ETH to send for claiming).");
        process.exit(1);
    }

    try {
        await interactWithMonarchs(MONARCHS_CONTRACT_ADDRESS, newKingValue);
    } catch (error) {
        console.error("Error interacting with Monarchs:", error.message);
        process.exit(1);
    }

})();
