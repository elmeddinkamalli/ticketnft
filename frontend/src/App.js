import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import InfoMessage from "./components/page-contents/InfoMessage";
import Loading from "./components/page-contents/Loading";
import Main from "./pages/Main";
import {
  connectedAddress,
  getUserDetails,
  loggedUser,
} from "./redux/features/userSlice";

function App() {
  const selector = useSelector;
  const dispatch = useDispatch();

  let user = selector(loggedUser);
  selector(connectedAddress);
  const fetchUserData = async (dispatch, getState) => {
    await dispatch(
      getUserDetails({
        requestToGetAccounts: false,
      })
    );
  };

  useEffect(() => {
    if (!user) {
      dispatch(fetchUserData);
    }
  }, [user]);

  return (
    <div className="App">
      <Loading />
      {localStorage.getItem("hasInfoMessage") && <InfoMessage />}
      <Main />
    </div>
  );
}

export default App;
