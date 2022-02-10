import {  AJAX} from "./helpers.js";
import { RES_PER_PAGE,API_URL, KEY_API } from "./config";


export const state = {
  recipe: {},
  search: { query: "", results: [], page: 1, resultPerPage: RES_PER_PAGE },
  bookmarks: [],
};


export const loadSearchResults = async function (query) {
  try {
    state.search.page = 1;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY_API}`);

    const { recipes } = data.data;
    state.search.results = recipes.map((rec) => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        imageUrl: rec["image_url"],
        ...(rec.key&& {key: rec.key})
      };
    });
  } catch (err) {
    console.error("err--->" + err.message);
    throw err.message;
  }
};

const createRecipeObject = function(data){
  const {recipe} = data.data;
  return  {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe["source_url"],
    imageUrl: recipe["image_url"],
    servings: recipe.servings,
    cookingTime: recipe["cooking_time"],
    ingredients: recipe.ingredients,
    ...(recipe.key&& {key: recipe.key})
  };
}

export const loadRecipe = async function (id) {
  try {
    const data  = await AJAX(`${API_URL}${id}?key=${KEY_API}`);


    state.recipe = createRecipeObject(data)
    state.recipe.bookmarked = state.bookmarks.some(
      (bookmark) => bookmark.id === id
    );
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

export const getSearchResultsPerPage = function (page = state.search.page) {
  // if(Object.keys(state.search.results).length===0) return [];
  state.search.page = page;

  const start = (page - 1) * state.search.resultPerPage;
  const end = page * state.search.resultPerPage;
  return state.search.results.slice(start, end);
};

export const updateServing = function (newServing = 8) {
  state.recipe.ingredients.forEach(
    (ing) =>
      (ing.quantity = (ing.quantity * newServing) / state.recipe.servings)
  );
  state.recipe.servings = newServing;
};
export const persistBookmark = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};
export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);

  state.recipe.bookmarked = true;
  persistBookmark();
};

export const deleteBookmark = function (recipe) {

  const indx = state.bookmarks.findIndex(
    (bookmark) => bookmark.id === recipe.id
  );
  state.bookmarks.splice(indx, 1);
  state.recipe.bookmarked = false;
  persistBookmark();
};

export const addRecipe = async function (newRecipe) {
  try {

    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
      .map((ing) => {
        const ingArr = ing[1].split(",").map(el=>el.trim());
        if (ingArr.length !== 3) throw new Error("Wrong ingredient format!");
        const [ quantity, unit,description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      cooking_time: +newRecipe.cookingTime,
      image_url: newRecipe.image,
      ingredients: ingredients,
      publisher: newRecipe.publisher,
      servings: newRecipe.servings,
      source_url: newRecipe.sourceUrl,
      title: newRecipe.title,

    };

    const data = await AJAX(`${API_URL}?key=${KEY_API}`,recipe)

    state.recipe = createRecipeObject(data)

    addBookmark(state.recipe)

  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

export const init = function () {
  state.bookmarks.push(...JSON.parse(localStorage.getItem("bookmarks")|| "[]"));
};

init();
