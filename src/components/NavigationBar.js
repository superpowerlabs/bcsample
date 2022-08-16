import React, { useContext, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";
import Logo from "./Logo";

import { Web3Context } from "../contexts/Web3Context";
import {
  addTokenToWallet,
  capitalize,
  ellipsizeAddress,
  isMobile,
} from "../utils";

const menuItems = [
  { title: "All NFTS", link: "/" },
  { title: "Your NFTS", link: "/yournfts" },
];

// const siteName = "Syn City Staking";

/**
 * Site-wide navigation bar
 */

const useStyles = makeStyles({
  paper: {
    background: "black",
  },
});

const styles = {
  link: {
    backgroundColor: "#000000",
    color: "yellow",
    borderRadius: 6,
    border: "1px solid #440",
    padding: "3px 8px",
    textDecoration: "none",
    fontSize: "96%",
  },
  RouterLink: {
    color: "yellow",
    fontSize: "20px",
  },
  icon: {
    color: "yellow",
  },
  drawer: {
    backgroundColor: "black",
  },
};

function NavigationBar() {
  const classes = useStyles();
  const { web3Connect, web3NetworkDetails } = useContext(Web3Context);
  const [openDrawer, setOpenDrawer] = useState(false);
  // console.log(openDrawer);
  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={0}
      sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
    >
      <Toolbar sx={{ flexWrap: "wrap" }}>
        <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          ByteCity Sample App
        </Typography>
        <nav>
        </nav>
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
