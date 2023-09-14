// import useContext
import { useContext } from 'react';
// import realtime database from Firebase.
import { realTimeDb } from "../firebase";
// import uuid to generate id for users.
import { v4 as uuidv4 } from "uuid";
// import Context
import closeButton from "../close-button.png";
import Context from '../Context';
import firebase from 'firebase/compat/app'
import 'firebase/compat/database';
import { saveResa } from '../services/ResService';


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


function RequestRide(props) {
  // get toggleModal functin from higher order components.
  const { toggleModal } = props;

  const { user, selectedFrom, selectedTo, setRideRequest, setIsLoading } = useContext(Context);

  /**
   * request a ride
   */
  async function requestRide() {
    if (user && selectedFrom && selectedTo) {
      // close the modal.
      toggleModal(false);
      // show loading indicator. 
      setIsLoading(true);
      // create object.
      //const rideUuid = uuidv4();
      const ride = {
        //"rideUuid": rideUuid,
        "departure": selectedFrom,
        "arrival": selectedTo,
        "date": "2023-15-09",
        "price": 50, 
        "driverId" : 1,
        "clientId": 1,
        "isEnded": false
      }
      // insert to Firebase realtime database.
       //realTimeDb.refFromURL(`rides/${rideUuid}`).set(ride).then(() => {
      //   firebase.database().ref(`rides/${rideUuid}`).set(ride).then(() => {
      //    setRideRequest(ride);
      //    setIsLoading(false);
      //  }).catch(() => {
      //    setIsLoading(false);
      //  });

      await saveResa(ride).then((response) => {
        console.log(response);
        setRideRequest(ride);
        setIsLoading(false);
      })
     }
   };
  
  return (
    <div className="request-ride">
      <div className="request-ride__content">
        <div className="request-ride__container">
          <div className="request-ride__title">
            {/* Requesting a Ride */}
            Offering a ride
            </div>
          <div className="request-ride__close">
            <img className="closebtn"
              alt="close"
              onClick={() => toggleModal(false)}
              src={closeButton}
            />
          </div>
        </div>
        <div className="request-ride__subtitle"></div>
        <div className="request-ride__form">
          <p>
            {/* You entered the pickup location successfully. Do you want to request a ride now ? */}
            You entered the pickup location successfully. Do you want to offer a ride now ?
          </p>
          <button className="request-ride__btn request-ride__change-btn" onClick={() => toggleModal(false)}>
            Change
          </button>
          <button className="request-ride__btn" onClick={requestRide}>
            {/* Requesting a ride now */}
            Offer a ride
          </button>
        </div>
      </div>
    </div>
  );
}

export default RequestRide;