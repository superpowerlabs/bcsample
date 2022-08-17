import React, { useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Logo from "../images/logo.png";

import { Web3Context } from "../contexts/Web3Context";
import {
  ellipsizeAddress,
} from "../utils";

function NavigationBar() {
  const { web3Connect, web3NetworkDetails } = useContext(Web3Context);
  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={0}
      sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
    >
      <Toolbar sx={{ flexWrap: "wrap" }}>
        <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          <img src={Logo} alt={"logo"} style={{ height: 40, marginTop: 8 }} />
        </Typography>
        <nav></nav>
        <div>
          {web3NetworkDetails.connectedWallet ? (
            <div style={{ marginLeft: 24 }}>
              {ellipsizeAddress(web3NetworkDetails.connectedWallet)}
            </div>
          ) : (
            <Button
              onClick={web3Connect}
              variant="outlined"
              sx={{ my: 1, mx: 1.5 }}
            >
              Connect Wallet
            </Button>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default NavigationBar;
