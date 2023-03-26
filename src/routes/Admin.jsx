import { useEffect, useState } from "react";
import {
  auth,
  db,
  onAuthStateChanged,
  provider,
  signInWithRedirect,
  signOut,
  storage,
} from "../../firebase";
import { Button } from "@mui/material";

import { uploadBytes, getDownloadURL, ref } from "firebase/storage";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { generateKey } from "../utils/generateKey";
const Admin = () => {
  const [user, setUser] = useState(null);
  const [access, setAccess] = useState(false);
  const [files, setFiles] = useState([]);
  const [messages, setMessages] = useState([
    { type: "err", text: "Error feels RED" },
    { type: "success", text: "Success feels GREEN" },
  ]);

  const signIn = () => {
    signInWithRedirect(auth, provider);
  };
  const signout = () => {
    signOut(auth);
  };
  const getUrl = (storageRef) => {
    let url;
    getDownloadURL(storageRef)
      .then((_url) => {
        url = _url;
      })
      .catch((err) => (url = null));
    return url;
  };
  const uploadFile = async (file) => {
    const path = "images/" + generateKey();
    const storageRef = ref(storage, path);

    await uploadBytes(storageRef, file)
      .then(async () => {
        await getDownloadURL(storageRef).then(async (url) => {
          await addDoc(collection(db, "swipes"), {
            date: Timestamp.now().toDate().toLocaleDateString("en-CA"),
            likes: [],
            dislikes: [],
            seen: [],
            url: url,
          })
            .then(() => {
              setMessages((oldMsgs) => [
                ...oldMsgs,
                { type: "success", text: "Successfully uploaded!" },
              ]);
            })
            .catch((err) => {
              setMessages((oldMsgs) => [
                ...oldMsgs,
                { type: "err", text: "Failed at stage 2: " + err },
              ]);
            });
        });
      })
      .catch((err) => {
        setMessages((oldMsgs) => [
          ...oldMsgs,
          { type: "err", text: "Failed at stage 1: " + err },
        ]);
      });
  };
  const handleClickSubmitFiles = (e) => {
    e.preventDefault();
    Array.from(files).forEach((file) => {
      uploadFile(file);
    });
  };
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        if (user.email === "ayetigbosamuel01@gmail.com") {
          setAccess(true);
        } else {
          setAccess(false);
        }
      } else {
        setUser(null);
        setAccess(false);
      }
    });
    return () => unSubscribe();
  }, []);
  return (
    <main className="flex flex-col">
      <div className="bg-red-400 text-white h-12 flex items-center px-2">
        {user === null
          ? "You are required to be signed in to be here"
          : access
          ? "You have access. Continue managing"
          : "You are signed in but not suppose to be here. It will be futile anyways, I have Google behind me. Hahaha"}
      </div>
      <div className="h-12 bg-white flex items-center">
        {user === null ? (
          <Button variant="contained" color="primary" onClick={signIn}>
            sign in
          </Button>
        ) : (
          <Button variant="contained" color="warning" onClick={signout}>
            sign out
          </Button>
        )}
      </div>
      {user && access && (
        <>
          <form>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setFiles(e.target.files)}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={(e) => handleClickSubmitFiles(e)}
            >
              submit
            </Button>
          </form>
          <div className="flex flex-col">
            <h2 className="font-semibold text-gray-800 uppercase">
              See messages here
            </h2>
            {messages.map(({ type, text }, index) => {
              return (
                <div
                  key={index}
                  className={
                    type === "err"
                      ? "text-red-800 text-md font-mono"
                      : "text-green-700 text-md font-mono"
                  }
                >
                  {"---> " + text}
                </div>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
};

export default Admin;
