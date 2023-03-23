import { AccountCircle } from "@mui/icons-material";
import { auth, provider, signInWithRedirect, signOut } from "../../firebase";
import { useContext } from "react";
import AppContext from "../utils/app-context";

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
              Icon: AccountCircle,
              action: signout,
              text: "Sign out",
            }
          : {
              Icon: AccountCircle,
              action: signIn,
              text: "Sign in with your Google account",
            }
      }
    />
  );
};

const IconButton = ({ data }) => {
  const { Icon, action, text } = data;
  return (
    <button onClick={action}>
      <Icon />
      <span>{text}</span>
    </button>
  );
};
export default Header;
