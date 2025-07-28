const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const articlesDir = path.join(__dirname, '../src/pages/articles');
const outFile = path.join(__dirname, '../src/data/articles.json');

function walk(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      results = results.concat(walk(full));
    } else if (file.endsWith('.md')) {
      results.push(full);
    }
  });
  return results;
}

const articles = walk(articlesDir).map(filePath => {
  const slug = path.basename(filePath, '.md');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  // Generate a shortTitle: use data.shortTitle, or first 24 chars of title, or slug
  let shortTitle = data.shortTitle || '';
  if (!shortTitle) {
    if (data.title && data.title.length > 28) {
      shortTitle = data.title.slice(0, 24).replace(/\s+\S*$/, '') + '...';
    } else if (data.title) {
      shortTitle = data.title;
    } else {
      shortTitle = slug;
    }
  }
  return {
    slug,
    title: data.title || slug,
    shortTitle,
    category: data.category || 'uncategorized',
    tags: data.tags || [],
    date: data.date || null,
    excerpt: data.excerpt || content.slice(0, 200) + '...',
    connections: data.connections || [],
    content,
  };
});

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(articles, null, 2));
console.log('Articles JSON generated:', outFile);
