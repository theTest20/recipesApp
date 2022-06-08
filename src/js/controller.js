import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
//if (module.hot) {
//module.hot.accept();
//}

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    //Getting id
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    //0 Update search result to mark the selected recipe
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    //1 Loading Recipe
    await model.loadRecipe(id);

    //2 Rendering Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) It gets search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    //resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4) Render Show pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError();
  }
};

//window.addEventListener('hashchange', controlRecipes);
//window.addEventListener('load', controlRecipse); //me u shfaq recipe kur e bojm copy-paste linkun

const controlPagination = function (goToPage) {
  // 1) Render New results
  //resultsView.render(model.state.search.results);
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update the recipe servings (in the state)
  model.updateServings(newServings);
  //Update the recipe view
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1) Add/Delete bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }
  //2) Update reipe view with bookmark added
  recipeView.update(model.state.recipe);
  //3)
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  //console.log(newRecipe);
  try {
    //Spinner
    addRecipeView.renderSpinner();
    //Upload new Recipe data
    await model.uploadRecipe(newRecipe);
    //Render recipe
    recipeView.render(model.state.recipe);
    //Succes message
    addRecipeView.renderMessage();
    //Render Bookmarks view
    bookmarksView.render(model.state.bookmarks);
    //Change ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //Close Form
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandleRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
