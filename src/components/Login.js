// import useRef and useContext
// import 'firebase/database'
import React, { useRef, useContext, useState } from "react";
// import Parse from 'parse/dist/parse.min.js';
// import Context to get shared data from React context.
import Context from "../Context";
// import firebase authentication and real time database.
// import { app, db, auth, realTimeDb } from "../firebase";
// import { signInWithEmailAndPassword } from "firebase/auth"
// import { ref } from "firebase/database"
// import validator to validate user's credentials.
import validator from "validator";
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
// import firebase from 'firebase/compat/app'
// import 'firebase/compat/database';

// let FirebaseConfig = {
//   apiKey: "AIzaSyA6H7Umx4PLVWPPzevyG3HU82Z9RrIlHeo",
//   authDomain: `${process.env.REACT_APP_FIREBASE_AUTH_DOMAIN}`,
//   databaseURL: "https://bloblocor-f56ab-default-rtdb.firebaseio.com/",
//   projectId: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}`,
//   storageBucket: `${process.env.REACT_APP_FIREBASE_STORAGE_BUCKET}`,
//   messagingSenderId: `${process.env.REACT_APP_FIREABSE_MESSAGING_SENDER_ID}`,
//   appId: `${process.env.REACT_APP_FIREBASE_APP_ID}`,
// };

// firebase.initializeApp(FirebaseConfig);

function Login(props) {
  // const [username, setUsername] = useState('');
  // const [password, setPassword] = useState('');
  // const [currentUser, setCurrentUser] = useState(null);

  // get shared data from context.
  const { setUser, setIsLoading, cometChat } = useContext(Context);
  // get toggle modal function from withModal - higher order component.
  const { toggleModal } = props;
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // create ref to get user's email and user's password.
  const usernameRef = useRef(null);
  // const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const navigate = useNavigate();

  /**
   * validate user's credentials.
   * @param {*} email
   * @param {*} password
   * @returns
   */
  // const isUserCredentialsValid = (email, password) => {
  //   return validator.isEmail(email) && password;
  // };

  //   const isUserCredentialsValid = (username, password) => {
  //   return validator.isUsername(username) && password;
  // };

  /**
   * login
   */
  // const  login = () => {

  //const auth = getAuth();

  // console.log(email, password);
  ///console.log(username, password);

  // signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
  //   const userEmail = userCredential.user.email;

  async function handleLoginForm(e) {
    e.preventDefault();
    setIsLoading(true);
    const username = usernameRef.current.value;
    // const email = emailRef.current.value;
    const password = passwordRef.current.value;

    await loginAPICall(username, password)
      .then((response) => {
        console.log(response.data);
        const token = "Bearer " + response.data.accessToken;
        storeToken(token);

        saveLoggedInUser(username);

        //localStorage.setItem("auth", JSON.stringify(user));
        setIsLoading(false);
        navigate("/");

        window.location.reload(false);
      })
      .catch((error) => {
        console.error(error);
        console.log("error");
      });

    // }
    //if (isUserCredentialsValid(email, password)) {
    // firebase.database().ref().child('users').orderByChild('email').equalTo(userEmail).on("value", function(snapshot) {
    //   const val = snapshot.val();
    //   if (val) {
    //     const keys = Object.keys(val);
    //     const user = val[keys[0]];
    //     cometChat.login(user.id, "acbd9af1d08f7723c91675770d8d4598f9314c04").then(
    //        User => {
    //   localStorage.setItem("auth", JSON.stringify(user));
    //   setUser(user);
    //   setIsLoading(false);
    //   navigate("/");
    //     });
    //   }
    // });

    //}
    // }
    // );
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
