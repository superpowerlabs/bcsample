import React from "react";
import Db from "./Db";
let db;

export const StoreContext = React.createContext();

function StoreContextProvider({ children }) {
  const [store, setStore] = React.useState({});

  if (!db) {
    db = new Db(setStore);
  }

  return (
    <StoreContext.Provider
      value={{
        store,
        db,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export default StoreContextProvider;
