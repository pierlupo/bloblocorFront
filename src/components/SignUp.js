// import useRef, useContext
import { useRef, useContext } from "react";
// import Context to get shared data.
import Context from "../Context";
// import validator to validate user's information.
// import validator from "validator";
// import uuid to generate id for users.
import { v4 as uuidv4 } from "uuid";
import { registerAPICall } from "../services/AuthService";
import closeButton from "../close-button.png";

function SignUp(props) {
  // get toggleModal functin from higher order components.
  const { toggleModal } = props;

  // create refs to get user's email, user's password, user's confirm password...
  const emailRef = useRef(null);
  const avatarRef = useRef(null);
  const usernameRef = useRef(null);
  const firstnameRef = useRef(null);
  const lastnameRef = useRef(null);
  const phoneRef = useRef(null);
  const driverRoleRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  //const isAdminRef = useRef(null);
  // const isDriverRef = useRef(null);

  const { cometChat, setIsLoading } = useContext(Context);

  

  let driverRole = "driver" ? true : false;
  let userRole = "user" 
  // let userRole = "user" ? true : false;

  /**
   * generate random avatar for demo purpose
   * @returns
   */
  // const generateAvatar = () => {
  //   // hardcode list of user's avatars for the demo purpose.
  //   const avatars = [
  //     "https://data-us.cometchat.io/assets/images/avatars/captainamerica.png",
  //     "https://data-us.cometchat.io/assets/images/avatars/cyclops.png",
  //     "https://data-us.cometchat.io/assets/images/avatars/ironman.png",
  //     "https://data-us.cometchat.io/assets/images/avatars/spiderman.png",
  //     "https://data-us.cometchat.io/assets/images/avatars/wolverine.png",
  //   ];
  //   const avatarPosition = Math.floor(Math.random() * avatars.length);
  //   return avatars[avatarPosition];
  // };

// https://www.woopets.fr/assets/races/000/338/bannerbig2021/abyssin_2.jpg
// https://www.woopets.fr/assets/races/000/347/bannerbig2021/bombay_2.jpg
// https://www.woopets.fr/assets/races/000/380/bannerbig2021/siamois_2.jpg
// https://www.woopets.fr/assets/races/000/369/bannerbig2021/norvegien_2.jpg
// https://www.woopets.fr/assets/races/000/385/bannerbig2021/somali_2.jpg
// https://www.woopets.fr/assets/races/000/346/bannerbig2021/bleu-russe_2.jpg
// https://www.woopets.fr/assets/races/000/345/bannerbig2021/bengal_2.jpg
// https://www.woopets.fr/assets/races/000/338/bannerbig2021/abyssin_2.jpg
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

  

  /**
   * sign up
   */
  const signup = () => {

    //  driverRole = "driver" ? 1 : 0;
    //  userRole = "user" ? 1 : 0;
    // get user's email, user's password, user's confirm password.
    const email = emailRef.current.value;
    const phone = phoneRef.current.value;
    //const role = roleRef.current.value;
    const username = usernameRef.current.value;
    const lastname = lastnameRef.current.value;
    const firstname = firstnameRef.current.value;
    const isAdmin = 0;
    console.log(driverRoleRef.current.value);
    // const isDriver = driverRoleRef.current.value;
    let isDriver = 0;
    if(driverRoleRef.current.value === "true") {
      isDriver = 1;
    }else{
      isDriver = 0;
      userRole = "user";
    }
    const role = driverRoleRef.current.value;
    console.log(isDriver);
    const avatar = avatarRef.current.value;

    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    const register = {
      username,
      avatar,
      password,
      firstname,
      lastname,
      phone,
      email,
      isAdmin,
      isDriver,
    };

    console.log(register);
    //if (isSignupValid({ username, password, firstname, lastname, phone, email, isDriver })) {

    setIsLoading(true);
    const userUuid = uuidv4();
    //const userAvatar = generateAvatar();

    registerAPICall(register)
      .then((response) => {
        // console.log(userUuid + userAvatar);
        console.log("test");
        const authKey = "*********************";
        const user = new cometChat.User(userUuid);
        user.setName(email);
        // user.setAvatar(userAvatar);
        user.setAvatar(avatar);

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
  };
 
  return (
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
          <input type="text" placeholder="Username" ref={usernameRef} required/>
          <input type="text" placeholder="Firstname" ref={firstnameRef} required/>
          <input type="text" placeholder="Lastname" ref={lastnameRef} required/>
          <input type="text" placeholder="Email" ref={emailRef} required/>
          <input type="text" placeholder="Phone" ref={phoneRef} required/>
          <input type="text" placeholder="Avatar" ref={avatarRef} required/>
          {/* <select ref={isAdminRef} defaultValue={userRole}>
            <option value={userRole}>User</option>
            <option value={driverRole}>Admin</option>
          </select> */}
          <select ref={driverRoleRef} defaultValue={userRole}>
            <option value={userRole}>User</option>
            <option value={driverRole}>Driver</option>
          </select>
          <input type="password" placeholder="Password" ref={passwordRef} />
          <input type="password" placeholder="Confirm Password" ref={confirmPasswordRef} />
          <button className="signup__btn" onClick={signup}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
