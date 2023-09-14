import axios from "axios";

const REACT_APP_API_DATABASE_URL = "http://localhost:8082/api/user"

export const fetchUserData = (username) => axios.get(REACT_APP_API_DATABASE_URL + '/username/'+ username);

