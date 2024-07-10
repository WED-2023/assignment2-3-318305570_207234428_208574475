const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";


/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */

async function getRecipeInformation(recipe_id) {
    const recipe_info = await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            //apiKey: process.env.spooncular_apiKey
            apiKey: "093ccbf0ecfa4b0a8e68366711ced8cf"
        }
    }); 
    let { id, title, readyInMinutes, image, vegan, vegetarian, glutenFree, instructions, extendedIngredients } = recipe_info.data;
    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        instructions: instructions,
        extendedIngredients: extendedIngredients   
    }
}


async function getRecipeDetails(recipe_id) {
    const recipe_info = await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            //apiKey: process.env.spooncular_apiKey
            apiKey: "093ccbf0ecfa4b0a8e68366711ced8cf"
        }
    }); 
    let { id, title, readyInMinutes, image, vegan, vegetarian, glutenFree } = recipe_info.data;
    
    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,   
    }
}

async function searchRecipe(recipeName, cuisine, diet, intolerance, number) {
    const response = await axios.get(`${api_domain}/complexSearch`, {
        params: {
            query: recipeName,
            cuisine: cuisine,
            diet: diet,
            intolerances: intolerance,
            number: number,
            //apiKey: process.env.spooncular_apiKey
            apiKey: "093ccbf0ecfa4b0a8e68366711ced8cf"
        }
    });

    // Await all the fetched details together
    const recipesDetails = await Promise.all(response.data.results.map(recipe => 
        getRecipeDetails(recipe.id)));
    return recipesDetails;
}

async function randomRecipes(limit) {
    const response = await axios.get(`${api_domain}/random`, {
        params: {
            number: limit,
            //apiKey: process.env.spooncular_apiKey
            apiKey: "093ccbf0ecfa4b0a8e68366711ced8cf"
        }
    });

    const recipesDetails = await Promise.all(response.data.recipes.map(async (recipe) => {
        let { id, title, readyInMinutes, image, vegan, vegetarian, glutenFree } = recipe;
        return {
            id: id,
            title: title,
            readyInMinutes: readyInMinutes,
            image: image,
            vegan: vegan,
            vegetarian: vegetarian,
            glutenFree: glutenFree
        };
    }));
    return recipesDetails;
}


exports.getRecipeDetails = getRecipeDetails;
exports.searchRecipe = searchRecipe;
exports.randomRecipes = randomRecipes;
exports.getRecipeInformation = getRecipeInformation;


