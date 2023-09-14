// import useRef and useContext
import React, { useRef, useContext } from "react";
// import Context to get shared data from React context.
import Context from "../Context";
// import custom components.
import withModal from "./Modal";
import SignUp from "./SignUp";
// import navigate
import { useNavigate } from "react-router-dom";
// import logo
//import logoBlack from '../logo_black.png';
import bloblocor from "../bloblocor.png";
import {
  loginAPICall,
  saveLoggedInUser,
  storeToken,
} from "../services/AuthService";



function Login(props) {

  // get shared data from context.
  const {  setUser, setIsLoading, cometChat } = useContext(Context);
  // get toggle modal function from withModal - higher order component.
  const { toggleModal } = props;

  // create ref to get user's email and user's password.
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const navigate = useNavigate();

  async function handleLoginForm(e) {
    e.preventDefault();
    setIsLoading(true);
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    await loginAPICall(username, password)
      .then((response) => {
        const token = "Bearer " + response.data.token;
        const user = response.data
        storeToken(token);
        saveLoggedInUser(username);
        setUser(user)
        console.log(user);
        localStorage.setItem("auth", JSON.stringify(user));
        setIsLoading(false);
        navigate("/home");
        window.location.reload(false);
      })
      .catch((error) => {
        console.error(error);
        console.log("error");
      });

  }

  return (
    <div className="login__container">
      <div className="login__welcome">
        <div className="login__logo">
          <img src={bloblocor} alt="Uber Clone" />
        </div>
        <p>Get moving with BlobloCor</p>
      </div>
      <div className="login__form-container">
        <div className="login__form">
          <input type="text" placeholder="Username" ref={usernameRef} />
          <input type="password" placeholder="Password" ref={passwordRef} />
          <button className="login__submit-btn" onClick={handleLoginForm}>
            Login
          </button>
          <span className="login__forgot-password">Forgot password?</span>
          <span className="login__signup" onClick={() => toggleModal(true)}>
            Create New Account
          </span>
        </div>
      </div>
    </div>
  );
}
export default withModal(SignUp)(Login);
