import axios from "axios";

export default axios.create({
  baseURL: "https://gucmun-back.herokuapp.com/api",
  responseType: "json"
});
