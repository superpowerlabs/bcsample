import React, { useContext, useState, useEffect } from "react";
import {
  Button,
  OutlinedInput,
  InputAdornment,
  LinearProgress,
  Table,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
  TableHead,
} from "@mui/material";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

import { StoreContext } from "../contexts/StoreContext";

import Switch from "./Switch";
import { Web3Context } from "../contexts/Web3Context";

import { Container, Grid } from "@mui/material";

function Home() {
  let {
    web3NetworkDetails,
    balances,
    isApproved,
    approve,
    newDeposit,
    listDeposits,
  } = useContext(Web3Context);
  const { db } = useContext(StoreContext);
  const { networkNotSupported, connectedWallet } = web3NetworkDetails || {};

  const [value, setValue] = useState("usdt");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [myDeposits, setMyDeposits] = useState([]);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const [myBalances, setMyBalances] = useState(false);
  const [amount, setAmount] = useState("0");

  useEffect(() => {
    (async () => {
      if (connectedWallet && !myBalances) {
        setMyBalances(await balances());
        setMyDeposits(await listDeposits());
      }
    })();
  }, [connectedWallet, balances, myBalances, listDeposits]);

  const onChange = (ev) => {
    let value = ev.target.value;
    if (!value) {
      value = "0";
    } else {
      value = value.replace(/^0+([1-9])/, "$1");
    }
    setAmount(value);
  };

  function newDepositId(amount) {
    const depositIds = db.get("depositIds") || {};
    const newId = () => parseInt(1e9 * Math.random());
    // verify that it's unique
    let id = newId()
    while (depositIds[id]) {
      id = newId();
    }
    depositIds[id] = { amount };
    db.updateOne("depositIds", depositIds);
    return id;
  }

  function progress(message) {
    return (
        <div className={'centered'}>
          <div style={{ padding: 12 }}>
            {message}
          </div>
          <LinearProgress color="inherit" sx={{width: "60%", margin: "0 auto"}}/>
        </div>
    );
  }

  const onClick = async () => {
    const tokenType = value === "usdt" ? 1 : 2;
    let tx
    try {
      // verify if it is approved
      if (!(await isApproved(tokenType, amount))) {
        setMessage("To deposit you must approve the spend...");
        // if not approve the spend
        tx = await approve(tokenType, amount);
        setMessage(progress("Approving the spend of your tokens..."));
        await tx.wait();
      }
      setMessage("Ready to deposit your tokens");
      // generate a new unique depositId
      const newId = newDepositId(amount);
      // make the deposit
      tx = await newDeposit(tokenType, amount, newId);
      setMessage(progress("Depositing your tokens..."));
      // saving the transaction hash in the local db
      const depositIds = db.get("depositIds");
      depositIds[newId].txId = tx.hash;
      db.updateOne("depositIds", depositIds);
      // wait for the transaction to be mined
      await tx.wait();
      setMessage("Your deposit was successful");
      depositIds[newId].completed = true;
      db.updateOne("depositIds", depositIds);
      await refreshMyDeposits();
    } catch (e) {
      setMessage("");
      setError(e.message);
    }
  };

  function formatTokenAmount(tokenType, amount) {
    amount = amount.toString();
    let size = tokenType === 1 ? 6 : 18;
    return amount.substring(0, amount.length - size) + "." + amount.slice(-size);
  }

  async function refreshMyDeposits() {
    setMyDeposits(await listDeposits());
  }

  function enUsFormat(num) {
    return parseFloat(num.toString()).toLocaleString("us-en");
  }


  function listMyDeposits() {
    let allDeposits = []
    for (let i = 0;i<myDeposits.length; i++) {
      let elem = myDeposits[i];
      allDeposits.push(
          <TableRow
              key={"deposit_" + i}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
          >
          <TableCell component="td" scope="row" align={'center'}>
            {elem.id}
          </TableCell>
          <TableCell component="td" scope="row" align={'center'}>
            {elem.tokenType === 1 ? "USDT" : "USDC"}
          </TableCell>
          <TableCell component="td" scope="row" align={'center'}>
            {enUsFormat(formatTokenAmount(elem.tokenType, elem.amount))}
          </TableCell>
          <TableCell component="td" scope="row" align={'center'}>
            {(new Date(elem.createdAt)).toUTCString()}
          </TableCell>
          </TableRow>
      );
    }

    return <TableBody>
        {allDeposits}
    </TableBody>
  }

  if (networkNotSupported) {
    return (
      <>
        <div className={"centeredError"}>
          <Switch style={{ fontSize: "1.6rem" }} />
        </div>
      </>
    );
  } else {
    return (
      <Container maxWidth="lg" component="main" className={"container"}>
        <Grid container spacing={0} alignItems="flex-start">
          <Grid item xs={12} sm={12} md={12}>
            <div className={"centered"} style={{ minHeight: 50 }}>
              {error ? <span className={"error"}>{error}</span> : message}
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={4} className={"tile"}>
            <div className={"tileBox"}>
              <h3>MY BALANCES</h3>
              <div>
                <p>
                  Tether USD:{" "}
                  {myBalances !== false
                    ? parseFloat(formatTokenAmount(1, myBalances.usdt.toString()))
                    : 0}
                  <br />
                  USD Coin:{" "}
                  {myBalances !== false
                    ? parseFloat(formatTokenAmount(2, myBalances.usdc.toString()))
                    : 0}
                </p>
                <h4>Make a new deposit</h4>
                <FormControl>
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={value}
                    row
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="usdt"
                      control={<Radio />}
                      label="Tether USD"
                    />
                    <FormControlLabel
                      value="usdc"
                      control={<Radio />}
                      label="USD Coin"
                    />
                  </RadioGroup>
                </FormControl>
                <OutlinedInput
                  id="staked-amount"
                  type="number"
                  value={amount}
                  onChange={onChange}
                  sx={{ width: "100%" }}
                  endAdornment={
                    <InputAdornment position="end">
                      <Button onClick={onClick} className={"smallButton"}>
                        Make deposit
                      </Button>
                    </InputAdornment>
                  }
                />
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={8} className={"tile"}>
            <div className={"tileBox"}>
              <h3>MY DEPOSITS</h3>
              <TableContainer
                  sx={{
                    margin: "auto",
                  }}
              >
                <Table aria-label="staking pools">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Deposit ID</TableCell>
                      <TableCell align="center">Type</TableCell>
                      <TableCell align="center">Amount</TableCell>
                      <TableCell align="center">Date</TableCell>
                    </TableRow>
                  </TableHead>
                  {listMyDeposits()}
                </Table>
              </TableContainer>
            </div>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default Home;
