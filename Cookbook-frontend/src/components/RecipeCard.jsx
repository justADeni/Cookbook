import { Link } from 'react-router-dom';
import "../App.css";

const RecipeCard = ({ recipe }) => (
  <a href={`/recipes/${recipe.id}`}>
  <div className="recipe-card-square">
    <img
      width={100}
      height={100}
      className="recipeCardSquareImg"
      src={recipe.icon}
      alt={recipe.name}
    />
    <h3 className="recipeCardSquareTitle">{recipe.name}</h3>
    <div className="recipeCardSquareMeta">
      <span title="Upvotes" role="img" aria-label="upvotes">👍 {recipe.upvotes ?? 0}</span>
      <span title="Comments" role="img" aria-label="comments">💬 {recipe.comments ?? 0}</span>
    </div>
  </div>
  </a>
);

export default RecipeCard;