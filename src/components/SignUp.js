// import useRef, useContext
import { useRef, useContext } from "react";
// import Context to get shared data.
import Context from "../Context";
// import validator to validate user's information.
import validator from "validator";
// import firebase authentication.
import { auth, realTimeDb } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { set, ref } from "firebase/database";
// import uuid to generate id for users.
import { v4 as uuidv4 } from "uuid";
import { registerAPICall } from "../services/AuthService";
import closeButton from "../close-button.png";

function SignUp(props) {
  // get toggleModal functin from higher order components.
  const { toggleModal } = props;

  // create refs to get user's email, user's password, user's confirm password.
  const emailRef = useRef(null);
  const usernameRef = useRef(null);
  const firstnameRef = useRef(null);
  const lastnameRef = useRef(null);
  const phoneRef = useRef(null);
  // const roleRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const isAdminRef = useRef(null);
  const isDriverRef = useRef(null);

  const { cometChat, setIsLoading } = useContext(Context);

  const driverRole = "driver";
  const userRole = "user";

  /**
   * generate random avatar for demo purpose
   * @returns
   */
  const generateAvatar = () => {
    // hardcode list of user's avatars for the demo purpose.
    const avatars = [
      "https://data-us.cometchat.io/assets/images/avatars/captainamerica.png",
      "https://data-us.cometchat.io/assets/images/avatars/cyclops.png",
      "https://data-us.cometchat.io/assets/images/avatars/ironman.png",
      "https://data-us.cometchat.io/assets/images/avatars/spiderman.png",
      "https://data-us.cometchat.io/assets/images/avatars/wolverine.png",
    ];
    const avatarPosition = Math.floor(Math.random() * avatars.length);
    return avatars[avatarPosition];
  };

  /**
   * validate user's informatin.
   * @param {*} param0
   * @returns
   */
  // const isSignupValid = ({ email, phone, role, password, confirmPassword }) => {
  //   if (!validator.isEmail(email)) {
  //     alert("Please input your email");
  //     return false;
  //   }
  //   if (!validator.isMobilePhone(phone, ['en-US', 'fr-FR'])) {
  //     alert("Please input your phone number");
  //     return false;
  //   }
  //   if (validator.isEmpty(role)) {
  //     alert("Please input your role");
  //     return false;
  //   }
  //   if (validator.isEmpty(password) || !validator.isLength(password, {min: 6})) {
  //     alert("Please input your password. You password must have at least 6 characters");
  //     return false;
  //   }
  //   if (validator.isEmpty(confirmPassword)) {
  //     alert("Please input your confirm password");
  //     return false;
  //   }
  //   if (password !== confirmPassword) {
  //     alert("Confirm password and password must be the same");
  //     return false;
  //   }
  //   return true;
  // };

  const isSignupValid = ({
    email,
    username,
    firstname,
    lastname,
    phone,
    isAdmin,
    isDriver,
    password,
    confirmPassword,
  }) => {
    if (!validator.isEmail(email)) {
      alert("Please put your email");
      return false;
    }
    // if (!validator.isUsername(username)) {
    //   alert("Please put your email");
    //   return false;
    // }
    // if (!validator.isFirstname(firstname)) {
    //   alert("Please put your email");
    //   return false;
    // }
    // if (!validator.isLastname(lastname)) {
    //   alert("Please put your email");
    //   return false;
    // }
    if (!validator.isMobilePhone(phone, ["en-US", "fr-FR"])) {
      alert("Please put your phone number");
      return false;
    }
    if (
      validator.isEmpty(password) ||
      !validator.isLength(password, { min: 6 })
    ) {
      alert(
        "Please put your password. You password must have at least 6 characters"
      );
      return false;
    }
    if (validator.isEmpty(confirmPassword)) {
      alert("Please put your confirmed password");
      return false;
    }
    if (password !== confirmPassword) {
      alert("Confirm password and password must be the same");
      return false;
    }
    return true;
  };

  /**
   * sign up
   */
  const signup = () => {
    // get user's email, user's password, user's confirm password.
    const email = emailRef.current.value;
    const phone = phoneRef.current.value;
    //const role = roleRef.current.value;
    const username = usernameRef.current.value;
    const lastname = lastnameRef.current.value;
    const firstname = firstnameRef.current.value;
    const isAdmin = false;
    const isDriver = false;

    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    const register = {
      username,
      password,
      firstname,
      lastname,
      phone,
      email,
      isAdmin,
      isDriver,
    };

    // if(isDriver.current.value == driverRole){
    //   isDriver = true;
    // } else {
    //   isDriver = false;
    // }

    //isDriver.current.value == driverRole ? isDriver = true : false;

    console.log(register);
    // if (isSignupValid({ username, password, firstname, lastname, phone, email, isDriver })) {

    setIsLoading(true);
    const userUuid = uuidv4();
    const userAvatar = generateAvatar();

    registerAPICall(register)
      .then((response) => {
        console.log(userUuid + userAvatar);
        console.log("test");
        const authKey = "acbd9af1d08f7723c91675770d8d4598f9314c04";
        const user = new cometChat.User(userUuid);
        user.setName(email);
        user.setAvatar(userAvatar);

        cometChat.createUser(user, authKey).then(
          (user) => {
            setIsLoading(false);
          },
          (error) => {
            setIsLoading(false);
          }
        );
        toggleModal(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        alert(
          `Cannot create your account, ${register.email} might exist, please try again!`
        );
      })
      .then(() => {
        alert(
          `${register.email} was created successfully! Please sign in with your created account`
        );
      });
    //}
  };
  //  if (isSignupValid({ username, password, firstname,lastname,phone, email, isAdmin, isDriver })) {
  // show loading

  //setIsLoading(true);
  // create new user's uuid.
  //const userUuid = uuidv4();
  // generate user's avatar.

  //const userAvatar = generateAvatar();

  // call firebase to to register a new account.
  // createUserWithEmailAndPassword(auth, email, password).then((auth) => {
  //    if (auth) {
  //     // call firebase real time database to insert a new user.

  //     set(ref(realTimeDb,`users/${userUuid}`),{
  //        id: userUuid,
  //        email,
  //        phone,
  //        role,
  //        avatar: userAvatar
  //      }).then(() => {
  //        alert(`${auth.user.email} was created successfully! Please sign in with your created account`);
  // cometchat auth key
  //  const authKey = `${process.env.REACT_APP_COMETCHAT_AUTH_KEY}`;
  //  const authKey = "acbd9af1d08f7723c91675770d8d4598f9314c04";
  // call cometchat service to register a new account.
  //  const user = new cometChat.User(userUuid);
  //  user.setName(email);
  //  user.setAvatar(userAvatar);

  //  cometChat.createUser(user, authKey).then(
  //   user => {
  //     setIsLoading(false);
  //   },error => {
  //     setIsLoading(false);
  //   }
  // )
  // close sign up dialog.
  //           toggleModal(false);
  //         });
  //       }
  //     }).catch((error) => {
  //       console.log(error);
  //       setIsLoading(false);
  //       alert(`Cannot create your account, ${email} might exist, please try again!`);
  //     });
  //   }
  // };

  return (
    // <div className="signup">
    //   <div className="signup__content">
    //     <div className="signup__container">
    //       <div className="signup__title">Sign Up</div>
    //       <div className="signup__close">
    //         <img
    //           alt="close"
    //           onClick={() => toggleModal(false)}
    //           src="https://static.xx.fbcdn.net/rsrc.php/v3/y2/r/__geKiQnSG-.png"
    //         />
    //       </div>
    //     </div>
    //     <div className="signup__subtitle"></div>
    //     <div className="signup__form">
    //       <input type="text" placeholder="Email" ref={emailRef} />
    //       <input type="text" placeholder="Phone" ref={phoneRef} />
    //       <select ref={roleRef} defaultValue={userRole}>
    //         <option value={userRole}>User</option>
    //         <option value={driverRole}>Driver</option>
    //       </select>
    //       <input type="password" placeholder="Password" ref={passwordRef} />
    //       <input
    //         type="password"
    //         placeholder="Confirm Password"
    //         ref={confirmPasswordRef}
    //       />
    //       <button className="signup__btn" onClick={signup}>
    //         Sign Up
    //       </button>
    //     </div>
    //   </div>
    // </div>
    // username, password, firstname, lastname, phone, email, isAdmin, isDriver
    <div className="signup">
      <div className="signup__content">
        <div className="signup__container">
          <div className="signup__title">Sign Up</div>
          <div className="signup__close">
            <img
              className="closebtn"
              alt="close"
              onClick={() => toggleModal(false)}
              src={closeButton}
            />
          </div>
        </div>
        <div className="signup__subtitle"></div>
        <div className="signup__form">
          <input type="text" placeholder="Username" ref={usernameRef} />
          <input type="text" placeholder="Firstname" ref={firstnameRef} />
          <input type="text" placeholder="Lastname" ref={lastnameRef} />
          <input type="text" placeholder="Email" ref={emailRef} />
          <input type="text" placeholder="Phone" ref={phoneRef} />
          {/* <select ref={isAdminRef} defaultValue={userRole}>
            <option value={userRole}>User</option>
            <option value={driverRole}>Admin</option>
          </select> */}
          <select ref={isDriverRef} defaultValue={userRole}>
            <option value={userRole}>User</option>
            <option value={driverRole}>Driver</option>
          </select>
          <input type="password" placeholder="Password" ref={passwordRef} />
          <input
            type="password"
            placeholder="Confirm Password"
            ref={confirmPasswordRef}
          />
          <button className="signup__btn" onClick={signup}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
