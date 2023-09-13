import axios from "axios";

const REACT_APP_API_DATABASE_URL = "http://localhost:8082/api/user"

export const getUser = (user) => axios.get(REACT_APP_API_DATABASE_URL + '/id', user);