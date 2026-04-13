import axios from "axios";

const baseURL =
  import.meta.env.MODE === "production"
    ? "https://restaurent-tiz5.onrender.com/api"
    : "http://localhost:5000/api";

export default axios.create({
  baseURL,
});