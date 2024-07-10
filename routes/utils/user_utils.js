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
    console.log("Fetched recipes:", recipes);

    // For each recipe, query the ingredients and add them to the recipe object
    const recipesWithIngredients = await Promise.all(recipes.map(async recipe => {
        const ingredients = await DButils.execQuery(`SELECT ingredients FROM myRecipesIngredients WHERE username='${username}' AND title='${recipe.title}'`);
        console.log(`Fetched ingredients for recipe ${recipe.title}:`, ingredients);

        // Convert integer values to booleans
        recipe.vegetarian = recipe.vegeterian === 1;
        recipe.vegan = recipe.vegan === 1;
        recipe.glutenFree = recipe.gultenFree === 1;

        // Remove the original integer fields
        delete recipe.vegeterian;
        delete recipe.gultenFree;

        // Map each ingredient to the expected format
        recipe.extendedIngredients = ingredients.map(ingredient => ({ original: ingredient.ingredients }));
        
        return recipe;
    }));

    return recipesWithIngredients;
}
  
async function createUserRecipe(username, title, image, readyInMinutes, vegetarian, vegan, glutenFree, ingredients, instructions, servings){
    await DButils.execQuery(`insert into myRecipes values ('${username}','${title}','${image}','${readyInMinutes}','${vegetarian}','${vegan}','${glutenFree}','${instructions}','${servings}')`);
    // Insert each ingredient into the myRecipesIngredients table
    await Promise.all(ingredients.map(async (ingredient) => {
        await DButils.execQuery(`INSERT INTO myRecipesIngredients (username, title, ingredients) VALUES ('${username}', '${title}', '${ingredient}')`);
    }));
}

exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.getUsersRecipes = getUsersRecipes;
exports.createUserRecipe = createUserRecipe;
