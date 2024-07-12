var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.username) {
    DButils.execQuery("SELECT username FROM users").then((users) => {
      if (users.find((x) => x.username === req.session.username)) {
        req.username = req.session.username;
        next();
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});


/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/favorites', async (req,res,next) => {
  try{
    const username = req.session.username;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsFavorite(username,recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get('/favorites', async (req,res,next) => {
  try{
    const username = req.session.username;
    console.log("username:", username);
    let favorite_recipes = {};
    const recipes_id = await user_utils.getFavoriteRecipes(username);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await Promise.all(
      recipes_id_array.map((id) => recipe_utils.getRecipeDetails(id)));
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});

/**
 * This path returns the user's recipes that were created by the logged-in user
 */
router.get('/recipes', async (req,res,next) => {
  try{
    const username = req.session.username;
    const recipes = await user_utils.getUsersRecipes(username);
    res.status(200).send(recipes);
  } catch(error){
    next(error); 
  }
});

/**
 * This path gets body with recipe parameters and save this recipe in the user's list of the logged-in user
 */
router.post('/recipes', async (req,res,next) => {
  try{
    const username = req.session.username;
    const { title, image, readyInMinutes, vegetarian, vegan, glutenFree, ingredients, instructions, servings } = req.body;

    // Convert boolean values to 0 and 1
    const vegetarianInt = vegetarian ? 1 : 0;
    const veganInt = vegan ? 1 : 0;
    const glutenFreeInt = glutenFree ? 1 : 0;

    await user_utils.createUserRecipe(username, title, image, readyInMinutes, vegetarianInt, veganInt, glutenFreeInt, ingredients, instructions, servings);
    res.status(200).send("The Recipe successfully added as new recipe");
    } catch(error){
    next(error);
  }
})


module.exports = router;
