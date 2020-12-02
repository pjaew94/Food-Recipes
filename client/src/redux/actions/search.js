import axios from "axios";
import { SEARCH_RECIPES } from "./types";

export const searchRecipes = (input) => async (dispatch) => {
  try {
    const appId = process.env.REACT_APP_APP_ID;
    const apiKey = process.env.REACT_APP_API_KEY;

    const res = await axios.get(`https://api.edamam.com/search?q=chicken&app_id=${appId}&app_key=${apiKey}&from=0&to=3&calories=591-722&health=alcohol-free`);

    dispatch({
      type: SEARCH_RECIPES,
      payload: res.data, 
    });
  } catch (err) {
    console.log(err.message);
  }
};
