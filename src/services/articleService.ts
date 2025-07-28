import articles from '@/data/articles.json';

export interface Article {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  date: string;
  excerpt: string;
  content: string;
  connections: string[];
}

export const getArticle = (slug: string): Article | null => {
  return articles.find((article: Article) => article.slug === slug) || null;
};

export const getAllArticles = (): Article[] => {
  return articles;
};

export const getConnectedArticles = (slug: string): Article[] => {
  const article = getArticle(slug);
  if (!article || !article.connections || article.connections.length === 0) {
    return [];
  }
  return article.connections
    .map(connectedSlug => getArticle(connectedSlug))
    .filter((article): article is Article => article !== null);
};

export const getArticlesByCategory = (category: string): Article[] => {
  return getAllArticles().filter(article => article.category === category);
};

export const getArticlesByTag = (tag: string): Article[] => {
  return getAllArticles().filter(article => article.tags.includes(tag));
};

export const getGraphData = () => {
  const articles = getAllArticles();
  const nodes = articles.map(article => ({
    id: article.slug,
    name: article.title,
    slug: article.slug,
    category: article.category,
    val: 5 + Math.floor(Math.random() * 5)
  }));

  const links: Array<{ source: string; target: string; value: number }> = [];

  articles.forEach(article => {
    if (article.connections) {
      article.connections.forEach(connection => {
        links.push({
          source: article.slug,
          target: connection,
          value: 1
        });
      });
    }
  });

  return { nodes, links };
};

// If you have any path-based logic or references to /blog/, update them to /articles/.
// For example, if you have a function that builds a path:
// export const getArticlePath = (slug: string) => `/pages/articles/${slug}.md`;
