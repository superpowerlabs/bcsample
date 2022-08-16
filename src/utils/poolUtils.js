// import { ethers } from "ethers";
import {
  CORE_POOL_CONTRACT_NAME,
  TOKEN_CONTRACT_NAME,
} from "../config/constants";

const isApproved = async (networkDetails, amount) => {
  const poolContract = networkDetails.contracts[CORE_POOL_CONTRACT_NAME];
  const synTokenContract = networkDetails.contracts[TOKEN_CONTRACT_NAME];
  const approved = await synTokenContract.allowance(
    networkDetails.connectedWallet,
    poolContract.address
  );
  if (approved.toString() === "0") {
    return false;
  } else {
    return approved.gte(amount);
  }
};

const approveAmount = async (networkDetails, amount) => {
  const poolContract = networkDetails.contracts[CORE_POOL_CONTRACT_NAME];
  const synTokenContract = networkDetails.contracts[TOKEN_CONTRACT_NAME];
  try {
    const tx = await synTokenContract
      .connect(networkDetails.signer)
      .approve(poolContract.address, amount);
    await tx.wait();
    return true;
  } catch (e) {
    return false;
  }
};

export { isApproved, approveAmount };
