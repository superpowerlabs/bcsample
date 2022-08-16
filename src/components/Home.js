import React from "react";
import {
  Table,
  TableCell,
  TableRow,
  TableContainer,
  TableHead,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Switch from "./Switch";
import { isMobile } from "../utils";
import { Web3Context } from "../contexts/Web3Context";

async function sleep(millis) {
  // eslint-disable-next-line no-undef
  return new Promise((resolve) => setTimeout(resolve, millis));
}

function Home() {
  let { web3NetworkDetails } = React.useContext(Web3Context);
  const { networkNotSupported, connectedNetwork, connectedWallet, contracts } =
    web3NetworkDetails || {};

  const [myTurfBalance, setMyTurfBalance] = React.useState(0);
  const [myTurfIDs, setMyTurfIDs] = React.useState([]);
  const [myFarmBalance, setMyFarmBalance] = React.useState(0);
  const [myFarmIDs, setMyFarmIDs] = React.useState();


  let styles = {
    buttonStyle: {
      backgroundColor: "#ffffff20",
      fontSize: "95%",
      borderColor: "#660",
      borderWidth: 1,
      color: "yellow",
    },
    body: { backgroundColor: "transparent" },
  };


  // React.useEffect(() => {
  //   (async () => {
  //     setMyTurfBalance(parseFloat(await balance(web3NetworkDetails, true, "turf")));
  //       setMyTurfIDs(await getMyNfts(web3NetworkDetails, false, "turf"));
  //       setMyFarmBalance(parseFloat(await balance(web3NetworkDetails, true, "farm")));
  //       setMyFarmIDs(await getMyNfts(web3NetworkDetails, false, "farm"));
  //   })();
  // }, [balance, getMyNfts, web3NetworkDetails]);

  if (networkNotSupported) {
    return (
      <>
        <div className={"centeredError"}>
          <Switch style={{ fontSize: "1.6rem" }} />
        </div>
      </>
    );
  } else {

    function getTable() {
      return (
        <div className={"allTokens"}>
          Welcome
        </div>
      );
    }

    return getTable();
  }
}

export default Home;
