import axios from "axios";

export default axios.create({
  baseURL: "https://byte-me-guc.herokuapp.com/api/",
  responseType: "json"
});
