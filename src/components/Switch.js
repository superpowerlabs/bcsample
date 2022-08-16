import { isTestnet } from "../config";

async function switchTo() {
  if (isTestnet) {
  await window.ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: "0x" + Number(43113).toString(16) }],
  });
} else {
  await window.ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: "0x" + Number(56).toString(16) }],
  });
}
}

function Switch(props) {
  // const { web3NetworkDetails } = useContext(Web3Context);
  const style = Object.assign(props.style || {}, {
    cursor: "pointer",
    color: "gold",
  });
  return (
    <span style={style} onClick={() => switchTo()}>
      Click here to switch to BNB chain
    </span>
  );
}
export default Switch;
