import { useState, useEffect } from 'react';
import axios from 'axios';
import RecipeCard from './RecipeCard';
import ErrorPage from './ErrorPage';
import { API_URL } from '../global';
import "../App.css";

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date"); // 'date' or 'popularity'
  const [error, setError] = useState(null);

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
      setError({
        code: error.response?.status || 'Error',
        message: error.response?.data?.error || error.message || 'Failed to fetch recipes.'
      });
    }
  };

  if (error) {
    return <ErrorPage code={error.code} message={error.message} />;
  }

  return (
    <div>
      <h1>Recipes</h1>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1em',
        marginBottom: '1.5em',
      }}>
        <input
          type="text"
          placeholder="Search recipes by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: '0.5em 1em',
            borderRadius: '0.5em',
            border: '1px solid #ccc',
            fontSize: '1em',
            width: '100%',
            maxWidth: '25em',
            boxSizing: 'border-box',
            flex: 1,
            minWidth: '180px',
          }}
          aria-label="Search recipes"
        />
        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <label htmlFor="sort-select" style={{ marginRight: '0.5em', fontWeight: 500 }}>Sort by:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{ padding: '0.4em 1em', borderRadius: '0.5em', fontSize: '1em' }}
          >
            <option value="date">Newest</option>
            <option value="popularity">Popularity</option>
          </select>
        </div>
      </div>
      <div className="recipe-grid">
        {recipes
          .filter(recipe => recipe.name.toLowerCase().includes(search.toLowerCase()))
          .sort((a, b) => {
            if (sortBy === "date") {
              // Sort by date descending (newest first)
              return new Date(b.date) - new Date(a.date);
            } else if (sortBy === "popularity") {
              // Sort by upvotes descending
              return (b.upvotes || 0) - (a.upvotes || 0);
            }
            return 0;
          })
          .map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
      </div>
    </div>
  );
};

export default HomePage;
