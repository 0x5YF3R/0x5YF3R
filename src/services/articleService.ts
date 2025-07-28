import articles from '@/data/articles.json';

interface Article {
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

// If you have any path-based logic or references to /blog/, update them to /articles/.
// For example, if you have a function that builds a path:
// export const getArticlePath = (slug: string) => `/pages/articles/${slug}.md`;
