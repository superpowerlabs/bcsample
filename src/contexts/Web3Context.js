import React from "react";

import ls from "local-storage";
import { ethers } from "ethers";

// import { isTestnet } from "../config";
import { isMobile } from "../utils";
import WalletConnectProvider from "@walletconnect/web3-provider";

function BN(amount) {
  return ethers.BigNumber.from(amount.toString() || "0")
}

function getContracts(config, chainId, web3Provider) {
  let contracts = {};
  let networkNotSupported = false;
  let connectedNetwork = null;
  if (config.supportedId[chainId]) {
    let addresses = config.contracts[chainId];
    connectedNetwork = config.supportedId[chainId];
    for (let contractName in addresses) {
      try {
        contracts[contractName] = new ethers.Contract(
          addresses[contractName],
          config.abi[contractName],
          web3Provider
        );
      } catch (e) {
        console.log("error", e.message);
      }
    }
  } else {
    networkNotSupported = true;
  }
  return {
    contracts,
    connectedNetwork,
    networkNotSupported,
  };
}

export const Web3Context = React.createContext();

let web3SetUp;

function Web3ContextProvider({ config, children }) {
  const [networkDetails, setNetworkDetails] = React.useState({
    provider: "",
    signer: "",
    connectedWallet: "",
    chainId: "",
    contracts: "",
    connectedNetwork: "",
    networkNotSupported: "",
  });

  async function setWallet(eth, connectedWith) {
    try {
      const provider = new ethers.providers.Web3Provider(eth);
      const signer = provider.getSigner();
      const chainId = (await provider.getNetwork()).chainId;
      const connectedWallet = await signer.getAddress();
      const { contracts, connectedNetwork, networkNotSupported } = getContracts(
        config,
        chainId,
        provider
      );
      setNetworkDetails({
        provider,
        signer,
        connectedWallet,
        chainId,
        contracts,
        connectedNetwork,
        networkNotSupported,
      });

      ls.set("connectedWith", connectedWith);
    } catch (e) {
      console.log(e);
      // window.location.reload();
    }
  }

  async function connect() {
    // console.log("connecting");
    let eth = null;
    if (isMobile()) {
      eth = new WalletConnectProvider({
        infuraId: "a5d8ae5cf48e49269d71a5cf25289c0d",
        qrcodeModalOptions: {
          mobileLinks: ["metamask"],
        },
      });
      await eth.enable();
      setWallet(eth, "metamask");

      if (await eth.request({ method: "eth_requestAccounts" })) {
        eth.on("accountsChanged", (accounts) => {
          window.reload();
        });
        eth.on("chainChanged", (chainId) => {
          window.reload();
        });
        eth.on("disconnect", (code, reason) => {
          window.reload();
        });
        setWallet(eth, "metamask");
      }
    } else if (typeof window.ethereum !== "undefined") {
      let eth = window.ethereum;
      if (await eth.request({ method: "eth_requestAccounts" })) {
        eth.on("accountsChanged", () => window.location.reload());
        eth.on("chainChanged", () => window.location.reload());
        eth.on("disconnect", () => window.location.reload());
        setWallet(eth, "metamask");
      }
    }
  }

  const isConnected = () => !!networkDetails.connectedWallet;

  React.useEffect(() => {
    // useEffect is synchronous
    (async () => {
      const connectedWith = ls("connectedWith") || "";
      // we use web3Setup to avoid executing this function again and again
      if (connectedWith === "metamask" && !web3SetUp) {
        web3SetUp = true;
        await connect();
      }
    })();
  });

  async function balances() {
    const { contracts, connectedWallet } = networkDetails;
    return {
      usdt: await contracts.TetherMock.balanceOf(connectedWallet),
      usdc: await contracts.USDCoinMock.balanceOf(connectedWallet),
    };
  }

  function getToken(tokenType) {
    const { contracts } = networkDetails;
    return contracts[tokenType === 1 ? "TetherMock" : "USDCoinMock"];
  }

  async function formatAmount(token, amount) {
    const decimals = await token.decimals();
    amount = parseInt(amount).toString();
    return BN(amount).mul(BN(1 + "0".repeat(decimals)));
  }

  async function isApproved(tokenType, amount) {
    const { contracts, connectedWallet } = networkDetails;
    const token = getToken(tokenType);
    amount = await formatAmount(token, amount);
    const allowance = await token.allowance(
      connectedWallet,
      contracts.ByteCity.address
    );
    return allowance.gte(amount);
  }

  async function approve(tokenType, amount) {
    const { contracts, signer } = networkDetails;
    const token = getToken(tokenType);
    amount = await formatAmount(token, amount);
    return token.connect(signer).approve(contracts.ByteCity.address, amount);
  }

  function cleanStruct(struct) {
    let ret = {};
    for (let key in struct) {
      if (isNaN(parseInt(key))) {
        ret[key] = struct[key];
      }
    }
    return ret;
  }


  async function listDeposits() {
    const { contracts, connectedWallet } = networkDetails;
    const { ByteCity } = contracts;
    const depositLength = await ByteCity.depositsAmount(connectedWallet);
    const deposits = [];
    for (let i = 0; i < depositLength; i++) {
      deposits.push(cleanStruct(await ByteCity.depositByIndex(connectedWallet, i)));
    }
    return deposits;
  }

  async function newDeposit(tokenType, amount, depositId) {
    const { contracts, signer } = networkDetails;
    const token = getToken(tokenType);
    amount = await formatAmount(token, amount);
    return contracts.ByteCity.connect(signer).deposit(
      tokenType,
      amount,
      depositId
    );
  }

  return (
    <Web3Context.Provider
      value={{
        web3NetworkDetails: networkDetails,
        web3Connect: connect,
        web3IsConnected: isConnected,
        balances: balances,
        isApproved: isApproved,
        approve: approve,
        newDeposit: newDeposit,
        listDeposits: listDeposits,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export default Web3ContextProvider;
