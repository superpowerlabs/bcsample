import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Table,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
  TextField,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { isMobile } from "../utils";
import { Web3Context } from "../contexts/Web3Context";
import Unskewed from "./Unskewed";

const styles = {
  buttonStyle: {
    backgroundColor: "#00000060",
    color: "yellow",
    fontSize: "95%",
  },
  body: {
    backgroundColor: "#00000080",
    color: "white",
    border: "1px solid #707",
    padding: "20px",
    backdropFilter: "blur(4px)",
  },
};

function BuyDialogue({ opened, setOpened, buy, price, asset }) {
  const { web3NetworkDetails } = React.useContext(Web3Context);
  const [amount, setAmount] = React.useState(0);
  const [totalPrice, setTotalPrice] = React.useState(price);

  const closeDialog = () => {
    setOpened(false);
  };

  const onBuyClick = async (ev) => {
    setOpened(false);
    await buy(web3NetworkDetails, amount, asset);
  };

  const handleChange = (value) => {
    setAmount(value);
    setTotalPrice(value * price);
  };

  return (
    <Dialog
      open={opened}
      onClose={closeDialog}
      aria-describedby="staking-dialog-description"
      aria-labelledby="staking-dialog-title"
      PaperProps={{
        style: {
          backgroundColor: "",
          opacity: 0.95,
          boxShadow: "none",
        },
      }}
    >
      <DialogTitle
        id="staking-dialog-title"
        style={{
          backgroundColor: "#00000044",
          backdropFilter: "blur(12px)",
        }}
      >
        {"Choose turf amount to buy"}
      </DialogTitle>
      <TableContainer
        component={Paper}
        sx={{
          minWidth: isMobile() ? 0 : 480,
          width: isMobile() ? "96%" : "70%",
          margin: "auto",
        }}
        style={styles.body}
      >
        <Table aria-label="staking pools">
          <TableBody>
            <TableRow>
              <TableCell align="left">TURFS</TableCell>
              <TableCell align="right">Total Price</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">
                <TextField
                  type="number"
                  onChange={(e) => handleChange(e.target.value)}
                  InputProps={{
                    style: { fontSize: 10 },
                    inputProps: { min: 0 },
                  }}
                />
              </TableCell>
              <TableCell align="right">{totalPrice}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <DialogActions
        style={{
          backdropFilter: "blur(4px)",
        }}
      >
        <div
          className={"centered"}
        >
          <Button
            onClick={onBuyClick}
            variant="contained"
            autoFocus
            sx={{
              width: "100%",
              margin: 0,
            }}
            style={{
              fontSize: "110%",
              fontWeight: "bold",
            }}
            className={"skewedButton"}
          >
            <Unskewed>BUY</Unskewed>
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}

export default BuyDialogue;
