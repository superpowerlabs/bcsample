const contracts = Object.assign(require("./deployed.json"));

const abi = Object.assign(require("./ABIs.json").contracts);

for (let c in contracts) {
  for (let x in contracts[c]) {
    if (/\|/.test(x)) {
      let keys = x.split("|");
      contracts[c][keys[0]] = contracts[c][x];
      abi[keys[0]] = abi[keys[1]];
      delete contracts[c][x];
    }
  }
}

let isDev;
let isTestnet;
if (typeof window !== "undefined") {
  isDev = /(stage)/.test(window.location.origin);
  isTestnet = /(local)/.test(window.location.origin);
} else if (!!process) {
  isDev = isTestnet = true;
}

const config = {
  supportedId: {
    43113: {
        chainId: "0x" + Number(43113).toString(16),
        chainName: "Fuji",
        nativeCurrency: {
          name: "AVAX",
          symbol: "AVAX",
          decimals: 18,
        },
        rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
        blockExplorerUrls: ["https://cchain.explorer.avax-test.network"],
      },
    1337: {
          chainId: "0x" + Number(1337).toString(16),
          chainName: "Localhost 8545",
          nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
            decimals: 18,
          },
          rpcUrls: ["http://localhost:8545"],
          blockExplorerUrls: [],
        },
  },
  contracts,
  abi,
  isTestnet,
  isDev,
};

module.exports = config;
