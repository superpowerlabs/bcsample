import React from "react";
import {
  Table,
  TableCell,
  TableRow,
  TableContainer,
  TableHead,
  Typography,
  Button,
} from "@mui/material";
import BuyDialogue from "./BuyDialogue";
import Unskewed from "./Unskewed";
import Paper from "@mui/material/Paper";
import Switch from "./Switch";
import { isMobile, parseAnd2Decimals } from "../utils";
import { Web3Context } from "../contexts/Web3Context";
import { SaleContext } from "../contexts/SaleContext";

async function sleep(millis) {
  // eslint-disable-next-line no-undef
  return new Promise((resolve) => setTimeout(resolve, millis));
}

function AllTokens() {
  let { web3NetworkDetails } = React.useContext(Web3Context);
  const { networkNotSupported, connectedNetwork, connectedWallet, contracts } =
    web3NetworkDetails || {};

  const { nextTokenId, maxSupply, getNftsPrice, buyNftsTokens, whiteBalance } =
    React.useContext(SaleContext);

  const [buyingOpened, setBuyingOpened] = React.useState(false);
  const [nxtturfId, setNxtTurfId] = React.useState(0);
  const [maximumTurfSupply, setMaximumTurfSupply] = React.useState(0);
  const [turfPrice, setTurfPrice] = React.useState(0);
  const [asset, setAsset] = React.useState();
  const [nxtfarmId, setNxtFarmId] = React.useState(0);
  const [maximumFarmSupply, setMaximumFarmSupply] = React.useState(0);
  const [farmPrice, setFarmPrice] = React.useState(0);
  const [buyingPrice, setBuyingPrice] = React.useState(0);
  const [whiteTurf, setWhiteTurf] = React.useState(0);
  const [whiteFarm, setWhiteFarm] = React.useState(0);

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

  React.useEffect(() => {
    (async () => {
      setNxtTurfId(parseFloat(await nextTokenId(web3NetworkDetails, true, "turf")));
      setMaximumTurfSupply(parseFloat(await maxSupply(web3NetworkDetails, true, "turf")));
      setTurfPrice(parseAnd2Decimals(await getNftsPrice(web3NetworkDetails, true, "turf")));
      setNxtFarmId(parseFloat(await nextTokenId(web3NetworkDetails, true, "farm")));
      setMaximumFarmSupply(parseFloat(await maxSupply(web3NetworkDetails, true, "farm")));
      setFarmPrice(parseAnd2Decimals(await getNftsPrice(web3NetworkDetails, true, "farm")));
      setWhiteTurf(parseFloat(await whiteBalance(web3NetworkDetails, true, "turf")));
      setWhiteFarm(parseFloat(await whiteBalance(web3NetworkDetails, true, "farm")));
    })();
  }, [ getNftsPrice, maxSupply, nextTokenId, web3NetworkDetails, whiteBalance]);

  if (networkNotSupported) {
    return (
      <>
        <div className={"centeredError"}>
          <Switch style={{ fontSize: "1.6rem" }} />
        </div>
      </>
    );
  } else {


    function buyOnclick(nft, price) {
      setAsset(nft)
      setBuyingPrice(price)
      setBuyingOpened(true);
    }

    function getTable() {
      return (
        <div className={"allTokens"}>
          <Typography
            variant="h4"
            align="center"
            color="text.primary"
            component="p"
            sx={{ margin: "24px 0 12px" }}
          >
            All Turfs
          </Typography>
          <TableContainer
            component={Paper}
            sx={{
              minWidth: isMobile() ? 0 : 480,
              width: isMobile() ? "96%" : "50%",
              margin: "auto",
            }}
            style={styles.body}
          >
            <Table aria-label="staking pools">
              <TableHead>
                <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Whitelist Slot : {whiteTurf}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Next Turf : {nxtturfId}
                  </TableCell>
                  <TableCell> Maximum Supply: {maximumTurfSupply}</TableCell>
                  <TableCell>Turf Price: {turfPrice}</TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </TableContainer>
          <div className="buyButton">
            <Button
              style={styles.buttonStyle}
              className={"skewedButton"}
              variant="outlined"
              disabled={whiteTurf === 0 ? true : false}
              onClick={() => buyOnclick("turf", turfPrice)}
            >
              <Unskewed>BUY TURF</Unskewed>
            </Button>
          </div>
          <TableContainer
            component={Paper}
            sx={{
              minWidth: isMobile() ? 0 : 480,
              width: isMobile() ? "96%" : "50%",
              margin: "auto",
            }}
            style={styles.body}
          >
            <Table aria-label="staking pools">
              <TableHead>
                <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Whitelist Slot : {whiteFarm}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Next Farm : {nxtfarmId}
                  </TableCell>
                  <TableCell> Maximum Supply: {maximumFarmSupply}</TableCell>
                  <TableCell>Farm Price: {farmPrice}</TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </TableContainer>
          <div className="buyButton">
            <Button
              style={styles.buttonStyle}
              className={"skewedButton"}
              variant="outlined"
              disabled={whiteFarm === 0 ? true : false}
              onClick={() => buyOnclick("farm", farmPrice)}
            >
              <Unskewed>BUY FARM</Unskewed>
            </Button>
          </div>
          <BuyDialogue
            opened={buyingOpened}
            setOpened={setBuyingOpened}
            buy={buyNftsTokens}
            price={buyingPrice}
            asset={asset}
          />
        </div>
      );
    }

    return getTable();
  }
}

export default AllTokens;
