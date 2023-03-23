import React, { createContext, useEffect, useState } from "react";
import { Footer, Header, Main } from "./components";
import { auth, onAuthStateChanged } from "../firebase";
import AppContext from "./utils/app-context";
import { Timestamp } from "firebase/firestore";
function App() {
  const [user, setUser] = useState(null);
  // console.log(
  //   Timestamp.fromDate(new Date()).toDate().toLocaleDateString("en-CA")
  // );
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
      <div className="relative flex items-center justify-center h-screen w-full">
        <div className=" w-full sm:max-w-md h-5/6 mx-5 sm:mx-0 my-40 flex flex-col ">
          <Header />
          <Main />
          <Footer />
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default App;
