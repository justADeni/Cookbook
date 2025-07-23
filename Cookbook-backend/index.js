const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const PORT = 3000;
const RECIPES_DIR = path.join(__dirname, 'recipes');

app.use(cors());
app.use(express.json());

// List all recipes (name, icon, id)
app.get('/recipes', async (req, res) => {
  try {
    const folders = await fs.readdir(RECIPES_DIR);
    const recipes = await Promise.all(folders.map(async (folder) => {
      const infoPath = path.join(RECIPES_DIR, folder, 'info.json');
      const info = JSON.parse(await fs.readFile(infoPath, 'utf-8'));
      return { id: folder, name: info.name, icon: info.icon };
    }));
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to list recipes' });
  }
});

// Get recipe info and markdown
app.get('/recipes/:id', async (req, res) => {
  try {
    const folder = path.join(RECIPES_DIR, req.params.id);
    const info = JSON.parse(await fs.readFile(path.join(folder, 'info.json'), 'utf-8'));
    const markdown = await fs.readFile(path.join(folder, 'recipe.md'), 'utf-8');
    res.json({ ...info, markdown });
  } catch (err) {
    res.status(404).json({ error: 'Recipe not found' });
  }
});

// Get comments
app.get('/recipes/:id/comments', async (req, res) => {
  try {
    const folder = path.join(RECIPES_DIR, req.params.id);
    const data = JSON.parse(await fs.readFile(path.join(folder, 'comments-and-upvotes.json'), 'utf-8'));
    res.json(data.comments || []);
  } catch (err) {
    res.status(404).json({ error: 'Recipe not found' });
  }
});

// Add comment
app.post('/recipes/:id/comments', async (req, res) => {
  try {
    const folder = path.join(RECIPES_DIR, req.params.id);
    const filePath = path.join(folder, 'comments-and-upvotes.json');
    const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));
    const { author, text } = req.body;
    if (!author || !text) return res.status(400).json({ error: 'Author and text are required' });
    const comment = { author, text, date: new Date().toISOString() };
    data.comments = data.comments || [];
    data.comments.push(comment);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    res.status(201).json(comment);
  } catch (err) {
    res.status(404).json({ error: 'Recipe not found' });
  }
});

// Get upvotes
app.get('/recipes/:id/upvotes', async (req, res) => {
  try {
    const folder = path.join(RECIPES_DIR, req.params.id);
    const data = JSON.parse(await fs.readFile(path.join(folder, 'comments-and-upvotes.json'), 'utf-8'));
    res.json({ upvotes: data.upvotes || 0 });
  } catch (err) {
    res.status(404).json({ error: 'Recipe not found' });
  }
});

// Upvote
app.post('/recipes/:id/upvote', async (req, res) => {
  try {
    const folder = path.join(RECIPES_DIR, req.params.id);
    const filePath = path.join(folder, 'comments-and-upvotes.json');
    const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));
    data.upvotes = (data.upvotes || 0) + 1;
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    res.json({ upvotes: data.upvotes });
  } catch (err) {
    res.status(404).json({ error: 'Recipe not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Cookbook backend running on http://localhost:${PORT}`);
}); 