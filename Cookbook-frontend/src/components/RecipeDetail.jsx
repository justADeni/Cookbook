import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { API_URL } from '../global';
import ReactMarkdown from 'react-markdown';
import ErrorPage from './ErrorPage';
import '../App.css';

const RecipeDetail = () => {
  const [info, setInfo] = useState(null);
  const [markdown, setMarkdown] = useState('');
  const [upvotes, setUpvotes] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [author, setAuthor] = useState("");
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchRecipe();
    fetchUpvotes();
    fetchComments();
    // eslint-disable-next-line
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const response = await axios.get(`${API_URL}/recipes/${id}`);
      setInfo({ name: response.data.name, image: response.data.icon });
      setMarkdown(response.data.markdown);
    } catch (error) {
      setError({
        code: error.response?.status || 'Error',
        message: error.response?.data?.error || error.message || 'Failed to fetch recipe.'
      });
      setInfo(null);
      setMarkdown('');
    }
  };

  const fetchUpvotes = async () => {
    try {
      const response = await axios.get(`${API_URL}/recipes/${id}/upvotes`);
      setUpvotes(response.data.upvotes);
    } catch {
      setUpvotes(0);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${API_URL}/recipes/${id}/comments`);
      setComments(response.data);
    } catch {
      setComments([]);
    }
  };

  const handleUpvote = async () => {
    try {
      const response = await axios.post(`${API_URL}/recipes/${id}/upvote`);
      setUpvotes(response.data.upvotes);
    } catch {
      // ignore
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!author.trim() || !commentText.trim()) return;
    try {
      await axios.post(`${API_URL}/recipes/${id}/comments`, { author, text: commentText });
      setCommentText("");
      setAuthor("");
      fetchComments();
    } catch {
      // ignore
    }
  };

  if (error) {
    return <ErrorPage code={error.code} message={error.message} />;
  }

  if (!info) return <div>Loading...</div>;

  return (
    <div className="recipe-detail-container">
      <div className="recipe-detail-markdown">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
      <div className="recipe-detail-upvote-section">
        <button onClick={handleUpvote} className="recipe-detail-upvote-btn">
          👍 Upvote
        </button>
        <span className="recipe-detail-upvote-count">{upvotes} upvotes</span>
      </div>
      <div className="recipe-detail-comments-section">
        <h3 className="recipe-detail-comments-title">Comments</h3>
        <form onSubmit={handleCommentSubmit} className="recipe-detail-comment-form">
          <input
            type="text"
            placeholder="Your name"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            className="recipe-detail-input"
            required
          />
          <textarea
            placeholder="Add a comment..."
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            className="recipe-detail-textarea"
            rows={2}
            required
          />
          <button type="submit" className="recipe-detail-comment-btn">
            💬 Add Comment
          </button>
        </form>
        <div className="recipe-detail-comments-list">
          {comments.length === 0 && <div className="recipe-detail-no-comments">No comments yet.</div>}
          {comments.map((c, i) => (
            <div key={i} className="recipe-detail-comment">
              <strong className="recipe-detail-comment-author">{c.author}</strong> <span className="recipe-detail-comment-date">{new Date(c.date).toLocaleString()}</span>
              <div className="recipe-detail-comment-text">{c.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;