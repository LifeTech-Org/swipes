import React, { createContext, useEffect, useRef, useState } from "react";
import { Footer, Header, Main } from "./components";
import { auth, onAuthStateChanged } from "../firebase";
import AppContext from "./utils/app-context";
import { Timestamp } from "firebase/firestore";
import getInfo from "./utils/info";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  Button,
} from "@mui/material";
function App() {
  const [user, setUser] = useState(null);
  const info = useRef(getInfo());
  const [showInfo, setShowInfo] = useState(true);
  useEffect(() => {
    const unSubcribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unSubcribe();
  }, []);
  return (
    <AppContext.Provider value={user}>
      <div className="relative flex items-center justify-center h-screen w-full bg-gray-800">
        <div className=" w-full sm:max-w-md  mx-5 sm:mx-0 flex flex-col ">
          <Dialog open={showInfo} onClose={() => setShowInfo(false)} >
            <DialogTitle>Fun Facts (-_-)</DialogTitle>
            <DialogContent>
              <DialogContentText>{info.current}</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowInfo(false)}>Close</Button>
            </DialogActions>
          </Dialog>
          <Header />
          <Main />
          <Footer />
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default App;
