import axios from "axios";

export default axios.create({
  baseURL: "http://www.gucmun.me/api/",
  responseType: "json"
});
