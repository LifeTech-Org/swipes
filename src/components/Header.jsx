import { AccountCircle } from "@mui/icons-material";
import { auth, provider, signInWithRedirect, signOut } from "../../firebase";
import { useContext } from "react";
import AppContext from "../utils/app-context";
import { Avatar, Badge, Chip } from "@mui/material";

const Header = () => {
  const user = useContext(AppContext);
  const isSignedIn = user !== null;
  return (
    <header className="h-12 flex justify-between items-center">
      <h3>swipe</h3>
      <SignInOptions {...{ isSignedIn }} />
    </header>
  );
};

const SignInOptions = ({ isSignedIn }) => {
  const signIn = () => {
    signInWithRedirect(auth, provider);
  };
  const signout = () => {
    signOut(auth);
  };
  return (
    <IconButton
      data={
        isSignedIn
          ? {
              type: "out",
              action: signout,
              text: "Sign out",
            }
          : {
              type: "in",
              action: signIn,
              text: "Sign in with your Google account",
            }
      }
    />
  );
};

const IconButton = ({ data }) => {
  const { type, action, text } = data;
  return (
    <Chip
      avatar={type === "out" ? <Avatar /> : <Avatar alt="profile" src={""} />}
      label={text}
      variant="outlined"
      onClick={action}
      color="primary"
    />
  );
};
export default Header;
