const DButils = require("./DButils");

async function markAsFavorite(username, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${username}',${recipe_id})`);
}

async function getFavoriteRecipes(username){
    const recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where username='${username}'`);
    return recipes_id;
}

// async function getUsersRecipes(username){
//     const recipes = await DButils.execQuery(`select * from myRecipes where username='${username}'`);
//     // For each recipe, query the ingredients and add them to the recipe object
//     const recipesWithIngredients = await Promise.all(recipes.map(async recipe => {
//         const ingredients = await DButils.execQuery(`SELECT ingredients FROM myRecipesIngredients WHERE username='${username}' AND title='${recipe.title}'`);
//         // Map each ingredient to the expected format
//         recipe.extendedIngredients = ingredients.map(ingredient => ({ original: ingredient.ingredients }));
        
//         return recipe;
//     }));
//     return recipesWithIngredients;
// }

async function getUsersRecipes(username) {
    // Query to get the user's recipes
    const recipes = await DButils.execQuery(`SELECT * FROM myRecipes WHERE username='${username}'`);
    
    // For each recipe, query the ingredients and add them to the recipe object
    const recipesWithIngredients = await Promise.all(recipes.map(async recipe => {
      const ingredients = await DButils.execQuery(`SELECT ingredients FROM myRecipesIngredients WHERE username='${username}' AND title='${recipe.title}'`);
  
      // Convert integer values to booleans
      recipe.vegetarian = recipe.vegetarian === 1;
      recipe.vegan = recipe.vegan === 1;
      recipe.glutenFree = recipe.glutenFree === 1;
  
      // Remove the original integer fields
      delete recipe.vegetarian;
      delete recipe.glutenFree;
  
      // Map each ingredient to the expected format
      recipe.extendedIngredients = ingredients.map(ingredient => ({ original: ingredient.ingredients }));
  
      console.log(`Fetched ingredients for recipe ${recipe.title}:`, ingredients);
      console.log("recipe", recipe);
      return recipe;
    }));
    // console.log("ingredients:", recipesWithIngredients);
    console.log('recipes with all:', recipesWithIngredients);
    return recipesWithIngredients;
  }

async function getOneUserRecipe(username, title){
    // Query to get the user's recipes
    const recipes = await DButils.execQuery(`SELECT * FROM myRecipes WHERE username='${username}' AND title='${title}'`);
    
    // For each recipe, query the ingredients and add them to the recipe object
    const recipesWithIngredients = await Promise.all(recipes.map(async recipe => {
      const ingredients = await DButils.execQuery(`SELECT ingredients FROM myRecipesIngredients WHERE username='${username}' AND title='${recipe.title}'`);
  
      // Convert integer values to booleans
      recipe.vegetarian = recipe.vegetarian === 1;
      recipe.vegan = recipe.vegan === 1;
      recipe.glutenFree = recipe.glutenFree === 1;
  
      // Remove the original integer fields
      delete recipe.vegetarian;
      delete recipe.glutenFree;
  
      // Map each ingredient to the expected format
      recipe.extendedIngredients = ingredients.map(ingredient => ({ original: ingredient.ingredients }));
  
      console.log(`Fetched ingredients for recipe ${recipe.title}:`, ingredients);
      console.log("recipe", recipe);
      return recipe;
    }));
    // console.log("ingredients:", recipesWithIngredients);
    console.log('recipes with all:', recipesWithIngredients);
    return recipesWithIngredients;
}
  
async function createUserRecipe(username, title, image, readyInMinutes, vegetarian, vegan, glutenFree, ingredients, instructions, servings, maxRetries = 3) {
    let attempt = 0;
    
    // Insert the main recipe details
    await DButils.execQuery(`INSERT INTO myRecipes (username, title, image, readyInMinutes, vegetarian, vegan, glutenFree, instructions, servings) VALUES ('${username}', '${title}', '${image}', ${readyInMinutes}, ${vegetarian}, ${vegan}, ${glutenFree}, '${instructions}', ${servings})`);
    
    while (attempt < maxRetries) {
        try {
            // Insert each ingredient into the myRecipesIngredients table sequentially
            for (const ingredient of ingredients) {
                await DButils.execQuery(`INSERT INTO myRecipesIngredients (username, title, ingredients) VALUES ('${username}', '${title}', '${ingredient}')`);
            }
            
            // If successful, break out of the loop
            break;
        } catch (error) {
            if (error.code === 'ER_LOCK_WAIT_TIMEOUT') {
                attempt++;
                if (attempt >= maxRetries) {
                    throw new Error('Max retry attempts reached. ' + error.message);
                }
                // Wait for a bit before retrying
                await new Promise(res => setTimeout(res, 1000));
            } else {
                throw error;
            }
        }
    }
}

exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.getUsersRecipes = getUsersRecipes;
exports.createUserRecipe = createUserRecipe;
exports.getOneUserRecipe = getOneUserRecipe;
