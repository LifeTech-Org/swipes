import { AccountCircle } from "@mui/icons-material";
import { auth, provider, signInWithRedirect, signOut } from "../../firebase";
import { useContext } from "react";
import AppContext from "../utils/app-context";
import { Avatar, Badge, Chip } from "@mui/material";
import Logo from "../assets/imgs/logo.png";
const Header = () => {
  const user = useContext(AppContext);
  const isSignedIn = user !== null;
  return (
    <header className="h-12 flex justify-between items-center">
      <img src={Logo} alt={"swipes logo"} className="h-8 w-auto" />
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
  const { photoURL } = useContext(AppContext) || { photoURL: null };
  return (
    <Chip
      avatar={photoURL ? <Avatar src={photoURL} /> : <Avatar />}
      label={text}
      variant={type === "out" ? "outlined" : "filled"}
      onClick={action}
      color={type === "out" ? "warning" : "primary"}
    />
  );
};
export default Header;
