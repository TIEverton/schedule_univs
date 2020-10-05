import axios from "axios";

const api = axios.create({
  baseURL: "https://api-scheduleunivs.herokuapp.com",
});

export default api;

//https://api-scheduleunivs.herokuapp.com
