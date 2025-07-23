import "../App.css";

const RecipeCard = ({ recipe }) => (
  <a href={`/recipes/${recipe.id}`} className="recipe-card-square">
    <div className="recipe-image-container">
      <img
        width={130}
        height={130}
        className="recipeCardSquareImg"
        src={recipe.icon}
        alt={recipe.name}
      />
      <h3 className="recipeCardSquareTitle">{recipe.name}</h3>
    </div>
    <div className="recipeCardSquareMeta">
      <span title="Upvotes" role="img" aria-label="upvotes">
        👍 {recipe.upvotes ?? 0}
      </span>
      <span title="Comments" role="img" aria-label="comments">
        💬 {recipe.comments ?? 0}
      </span>
    </div>
  </a>
);

export default RecipeCard;
