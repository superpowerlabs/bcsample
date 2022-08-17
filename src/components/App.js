// React
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// MUI
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// internal imports
import Web3ContextProvider from "../contexts/Web3Context";
import StoreContextProvider from "../contexts/StoreContext";

import NavigationBar from "./NavigationBar";
import config from "../config";
import Home from "./Home";

function App() {
  const theme = createTheme({
    palette: {
      mode: "dark",
    },
    typography: {
      fontFamily: "Modeco",
    },
  });

  const { location } = window;
  if (!/local/.test(location.origin)) {
    if (window.location.protocol === "http:") {
      window.location = "https://" + location.host + location.pathname;
    }
  }

  function getWidth() {
    return window.innerWidth;
  }

  // eslint-disable-next-line no-unused-vars
  const [windowWidth, setWindowWidth] = React.useState(getWidth());

  React.useEffect(() => {
    return () => {
      window.addEventListener("resize", () => setWindowWidth(getWidth()));
      return () =>
        window.removeEventListener("resize", () => setWindowWidth(getWidth()));
    };
  }, []);

  return (
    <StoreContextProvider>
      <Web3ContextProvider config={config}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <GlobalStyles
              styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
            />
            <CssBaseline />
            <NavigationBar />
            <Routes>
              <Route exact path="/" element={<Home />} />
            </Routes>
          </ThemeProvider>
        </BrowserRouter>
      </Web3ContextProvider>
    </StoreContextProvider>
  );
}

export default App;
