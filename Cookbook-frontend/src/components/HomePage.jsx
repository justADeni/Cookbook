import { useState, useEffect } from 'react';
import axios from 'axios';
import RecipeCard from './RecipeCard';
import { API_URL } from '../global';
import "../App.css";

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get(`${API_URL}/recipes`);
      const recipes = response.data.map(r => ({ ...r, image: r.icon }));
      // Fetch upvotes and comments for each recipe
      const recipesWithMeta = await Promise.all(
        recipes.map(async (recipe) => {
          const [upvotesRes, commentsRes] = await Promise.all([
            axios.get(`${API_URL}/recipes/${recipe.id}/upvotes`).catch(() => ({ data: { upvotes: 0 } })),
            axios.get(`${API_URL}/recipes/${recipe.id}/comments`).catch(() => ({ data: [] }))
          ]);
          return {
            ...recipe,
            upvotes: upvotesRes.data.upvotes || 0,
            comments: commentsRes.data.length || 0
          };
        })
      );
      setRecipes(recipesWithMeta);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  return (
    <div>
      <h1>Recipes</h1>
      <input
        type="text"
        placeholder="Search recipes by name..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          padding: '0.5em 1em',
          borderRadius: '0.5em',
          border: '1px solid #ccc',
          marginBottom: '1.5em',
          fontSize: '1em',
          width: '100%',
          maxWidth: '25em',
          boxSizing: 'border-box',
        }}
        aria-label="Search recipes"
      />
      <div className="recipe-grid">
        {recipes
          .filter(recipe => recipe.name.toLowerCase().includes(search.toLowerCase()))
          .map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
      </div>
    </div>
  );
};

export default HomePage;
