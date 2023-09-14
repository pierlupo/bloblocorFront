// import useState
import { useState, useEffect } from 'react';
// import react router dom.
import {
  BrowserRouter as Router,
  Routes ,
  Route
} from 'react-router-dom';
// import custom components.
import Home from './components/Home';
import Login from './components/Login';
import Loading from './components/Loading';
import Chat from './components/Chat';
import UserProfile from './components/UserProfile';
//import PrivateRoute from './components/PrivateRoute';
// import global styling.
import './index.css';
// import Context
import Context from './Context';
// import realtime database from Firebase.
import { realTimeDb } from "./firebase";
import React from 'react';
import firebase from 'firebase/compat/app'
import 'firebase/compat/database';

let FirebaseConfig = {
  apiKey: "AIzaSyA6H7Umx4PLVWPPzevyG3HU82Z9RrIlHeo",
  authDomain: `${process.env.REACT_APP_FIREBASE_AUTH_DOMAIN}`,
  databaseURL: "https://bloblocor-f56ab-default-rtdb.firebaseio.com/",
  projectId: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}`,
  storageBucket: `${process.env.REACT_APP_FIREBASE_STORAGE_BUCKET}`,
  messagingSenderId: `${process.env.REACT_APP_FIREABSE_MESSAGING_SENDER_ID}`,
  appId: `${process.env.REACT_APP_FIREBASE_APP_ID}`,
};

firebase.initializeApp(FirebaseConfig);

// create App components.
function App() {
  // create loading state and share to other components.
  // loading state will be used to show / hide loading indicator.
  const [isLoading, setIsLoading] = useState(false);
  // user state contains authenticated user.
  const [user, setUser] = useState(null);
  // comet chat.
  const [cometChat, setCometChat] = useState(null);
  // selected from, selected to.
  const [selectedFrom, setSelectedFrom] = useState(null);
  const [selectedTo, setSelectedTo] = useState(null);
  // created ride request.
  const [rideRequest, setRideRequest] = useState(null);
  // current ride.
  const [currentRide, setCurrentRide] = useState(null);
  // rides.
  const [rides, setRides] = useState(null);
  const [date, setDate] = useState(null);
  const [price, setPrice] = useState(null);
  



  const lookingDriverMaxTime = 30000;

  useEffect(() => {
    initAuthUser();
    initCometChat();
    initCurrentRide();
    
  }, []);

  useEffect(() => {
    if (rideRequest) {
      // create a timeout to trigger notification if there is no driver.
      const lookingDriverTimeout = setTimeout(() => {
        alert('Cannot find your driver, please re-enter your pickup location and try again');
        // remove the created ride.
        setRideRequest(null);
        // hide loading indicator.
        setIsLoading(false);
      }, lookingDriverMaxTime);
      // show loading indicator.
      setIsLoading(true);
      // check data changes from firebase real time database. If there is a driver accepted the request.
        //const createdRideRef = realTimeDb.ref(`rides/${rideRequest.rideUuid}`);
        const createdRideRef = firebase.database().ref(`rides/${rideRequest.rideUuid}`);
        
        createdRideRef.on("value", (snapshot) => {
          const updatedRide = snapshot.val();
          if (updatedRide && updatedRide.rideUuid === rideRequest.rideUuid && updatedRide.driver) {
          // hide loading indicator.
            setIsLoading(false);
          // remove looking for driver timeout.
            clearTimeout(lookingDriverTimeout);
          // set rider request and created ride.
            setRideRequest(null);
          // set created ride.
           localStorage.setItem('currentRide', JSON.stringify(updatedRide));
          // set current Ride. 
            setCurrentRide(() => updatedRide);
        }
      });
    }
 }, [rideRequest]);

    
   useEffect(() => {
     if (currentRide) {
       //const currentRideRef = realTimeDb.ref(`rides/${currentRide.rideUuid}`);
       const currentRideRef = firebase.database().ref(`rides/${currentRide.rideUuid}`);
       currentRideRef.on("value", (snapshot) => {
         const updatedRide = snapshot.val();
        if (updatedRide && updatedRide.rideUuid === currentRide.rideUuid && updatedRide.driver && (updatedRide.status === -1 || updatedRide.status === 2)) {
  //         // remove localStorage.
           localStorage.removeItem('currentRide');
  //         // remove data from context.
           setCurrentRide(null);
  //         // reload window 
           window.location.reload();
        }
      });
    }
  }, [currentRide]);

  /**
   * init current ride
   */
  const initCurrentRide = () => {
    const currentRide = localStorage.getItem('currentRide');
    if (currentRide) { 
      setCurrentRide(() => JSON.parse(currentRide));
    }
  }

  /**
   * init auth user
   */
  const initAuthUser = () => { 
    const authenticatedUser = localStorage.getItem('auth');
    if (authenticatedUser) { 
      setUser(JSON.parse(authenticatedUser));
    }
  };

  /**
   * init comet chat.
   */
   const initCometChat = async () => {
    const { CometChat }  = await import('@cometchat-pro/chat');
    //const appID = `${process.env.REACT_APP_COMETCHAT_APP_ID}`;
    const appID = "24480181d01fd571";
    //const region = `${process.env.REACT_APP_COMETCHAT_REGION}`;
    const region = "eu";
    const appSetting = new CometChat.AppSettingsBuilder().subscribePresenceForAllUsers().setRegion(region).build();
    CometChat.init(appID, appSetting).then(
      () => {
        setCometChat(() => CometChat);
      },
      error => {
      }
    );
  }

  return (
    <Context.Provider value={{isLoading, setIsLoading, user, setUser, cometChat, selectedFrom, setSelectedFrom, selectedTo, setSelectedTo, rideRequest, setRideRequest, currentRide, setCurrentRide, rides, setRides, price, setPrice, date, setDate}}>
      <Router>
        <Routes >
          {/* Home Route */}
          <Route exact path="/home" element = { <Home /> }></Route>
          <Route exact path="/chat" element = { <Chat /> }></Route>
          <Route exact path="/profile" element = { <UserProfile /> }></Route>
          {/* <PrivateRoute exact path="/chat" element={ <Chat/> } /> */}
          {/* End Home Route */}
          {/* Login Route */}
          <Route exact path="/" element = { <Login />}></Route>
          {/* End Login Route */}
        </Routes >
      </Router>
      {isLoading && <Loading />}
    </Context.Provider>
  );
}

export default App;
