// import { ethers } from "ethers";

import { ethers } from "ethers";
import config from "../config";
import { isMobile as mobile } from "react-device-detect";

function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
}

function ellipsizeAddress(address, width = 4) {
  return `${address.slice(0, width + 2)}...${address.slice(-width)}`;
}

function addSomeDecimals(s, c = 2) {
  s = s.toString().split(".");
  s[1] = (s[1] || "").substring(0, c);
  s[1] = s[1] + "0".repeat(c - s[1].length);
  return s.join(".");
}

function localeFormat(num) {
  if (num === "") {
    return "";
  }
  if (typeof num === "string") {
    num = parseFloat(num);
  }
  return num.toLocaleString(getLang());
}

function getLang() {
  return navigator.language || navigator.languages[0] || "en-us";
}

async function sleep(millis) {
  // eslint-disable-next-line no-undef
  return new Promise((resolve) => setTimeout(resolve, millis));
}

// check if it is on mainnet before adding it
async function addTokenToWallet(chainId) {
  const contracts = config.contracts[chainId];
  if (contracts) {
    let address, symbol, image;
    const decimals = 18;
    address = contracts.SynrMock;
    symbol = "SYNR";
    image = "https://data.syn.city/assets/SynCityLogo97x97Black.png";
    if (typeof window.ethereum !== "undefined") {
      try {
        return window.ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20", // Initially only supports ERC20, but eventually more!
            options: {
              address,
              symbol,
              decimals,
              image,
            },
          },
        });
      } catch (error) {
        console.error(error);
      }
    }
  }
}

function isMobile() {
  return mobile;
}

function parseAnd2Decimals(amount, noDecimals, justString) {
  if (!amount || amount.toString() === "0") {
    return noDecimals ? 0 : "0.00";
  }
  if (/\./.test(amount.toString())) {
    return amount;
  }
  let str = ethers.utils.formatEther(amount.toString());
  if (justString) {
    return str;
  }
  let res = parseFloat(str).toLocaleString("us-en");
  if (noDecimals) {
    return res.split(".")[0];
  }
  if (/\./.test(res)) {
    res = res.substring(0, res.length - 1);
  }
  return res;
}

function add2Decimals(amount) {
  if (!amount || amount === "0") {
    return "0.00";
  }
  let res = parseFloat(amount).toLocaleString("us-en").split(".");
  res[1] = res[1] || "";
  if (res[1].length >= 2) {
    res[1] = res[1].substring(0, 2);
  } else {
    res[1] = res[1] + "0".repeat(2 - res[1].length);
  }
  return res.join(".");
}

export {
  capitalize,
  ellipsizeAddress,
  addSomeDecimals,
  localeFormat,
  getLang,
  sleep,
  isMobile,
  parseAnd2Decimals,
  add2Decimals,
  addTokenToWallet,
};
