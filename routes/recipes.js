var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("im here"));

/**
 * This path is for searching a recipe
 */
router.get("/search", async (req, res, next) => {
  try {
    console.log("get search");
    const recipeName = req.query.query;
    const cuisine = req.query.cuisine;
    const diet = req.query.diet;
    const intolerance = req.query.intolerance;
    const number = req.query.number || 5;
    const sort = req.query.sort;
    const results = await recipes_utils.searchRecipe(recipeName, cuisine, diet, intolerance, number, sort);
    res.send(results);
  } catch (error) {
    next(error);
  }}),

/**
 * This path returns a preview details of a recipe by its id
 */
router.get("/previewRecipe/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns a full details of a recipe by its id
 */
router.get("/fullRecipe/:recipeId", async (req, res, next) => {
  try {
    console.log("recipeId:", req.params.recipeId);
    const recipe = await recipes_utils.getRecipeInformation(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns random recipes according to the number asked
 */
router.get("/random", async (req, res, next) => {
  try {
    const limit = req.params.limit || 6;
    const recipe = await recipes_utils.randomRecipes(limit);
    res.send(recipe);
  } 
  catch (error) {
    next(error);
  }
});

module.exports = router;
