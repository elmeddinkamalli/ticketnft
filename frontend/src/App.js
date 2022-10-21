import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Main from "./pages/Main";
import { fetchUser, selectUser } from "./redux/features/userSlice";

function App() {
  const selector = useSelector;
  const dispatch = useDispatch();
  let user = true;
  // const fetchUserData = async (dispatch, getState) => {
  //   await dispatch(fetchUser());
  // };

  // useEffect(() => {
  //   if (!user) {
  //     dispatch(fetchUserData);
  //   }
  // }, [user]);

  if (user) {
    return (
      <div className="App">
        <Main />
      </div>
    );
  } else {
    return <div></div>;
  }
}

export default App;
