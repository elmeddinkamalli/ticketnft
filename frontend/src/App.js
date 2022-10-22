import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { select } from "underscore";
import Main from "./pages/Main";
import {
  connectedAddress,
  connectToWallet,
  getUserDetails,
  loggedUser,
  user,
} from "./redux/features/userSlice";
let loginRequest = 0;

function App() {
  const selector = useSelector;
  const dispatch = useDispatch();

  // (() => {
  //   console.log(user);
  //   new Promise(function (resolve, reject) {
  //     if(loginRequest == 0){
  //       loginRequest++;
  //       resolve(fetchUser());
  //     }
  //     // resolve(getAccount());
  //   }).then((res) => {
  //     console.log(res);
  //     // if(!res.error){
  //     //   setUser(selector(loggedUser))
  //     // }
  //     // if(!res){
  //     //   dispatch(connectToWallet({
  //     //     isWalletConnect: false,
  //     //     needNonce: false
  //     //   }))
  //     // }else{
  //     //   setConnectedAccount(res)
  //     // }
  //   });
  // })();

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
      <Main />
    </div>
  );
}

export default App;
