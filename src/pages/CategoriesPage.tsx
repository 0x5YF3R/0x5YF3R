import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { getAllArticles } from '@/services/articleService';

interface Article {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  excerpt: string;
}

interface CategoryWithArticles {
  name: string;
  description: string;
  articles: Article[];
}

const CategoriesPage = () => {
  const [categories, setCategories] = useState<CategoryWithArticles[]>([]);

  useEffect(() => {
    const articles = getAllArticles();
    
    // Get unique categories
    const uniqueCategories = [...new Set(articles.map(article => article.category))];
    
    // Create category descriptions
    const categoryDescriptions: Record<string, string> = {
      fundamentals: 'Core knowledge and foundational concepts in cybersecurity',
      attacks: 'Techniques, vectors, and methodologies used by attackers',
      defense: 'Protective measures, tools, and strategies for security'
    };
    
    // Group articles by category
    const categoriesWithArticles = uniqueCategories.map(categoryName => {
      const categoryArticles = articles.filter(article => article.category === categoryName);
      
      return {
        name: categoryName,
        description: categoryDescriptions[categoryName] || `Articles related to ${categoryName}`,
        articles: categoryArticles
      };
    });
    
    setCategories(categoriesWithArticles);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-cyber-black">
      <NavBar />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-mono font-bold text-cyber-blue">Categories</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Browse articles by category to focus on specific areas of cybersecurity
            </p>
          </div>
          
          <div className="space-y-12">
            {categories.map((category) => (
              <div key={category.name} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-mono font-bold capitalize text-cyber-blue">
                    {category.name}
                  </h2>
                  <p className="text-muted-foreground mt-1">{category.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.articles.map((article) => (
                    <Card 
                      key={article.slug}
                      className="bg-cyber-dark/90 border-cyber-blue/30 hover:border-cyber-blue/40 transition-colors backdrop-blur-md"
                    >
                      <Link to={`/articles/${article.slug}`} className="block p-6">
                        <h3 className="text-lg font-mono font-bold text-cyber-blue mb-2">
                          {article.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {article.excerpt}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-auto">
                          {article.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                          {article.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{article.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      </Link>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <footer className="bg-cyber-dark border-t border-cyber-blue/20 py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © {new Date().getFullYear()} 0x5yf3r • A Graph view of the Cybersecurity domain
            </p>
            <div className="flex space-x-4">
                <Link to="/Privacy" className="text-sm text-muted-foreground hover:text-cyber-blue transition-colors">Privacy</Link>
                <Link to="/Terms" className="text-sm text-muted-foreground hover:text-cyber-blue transition-colors">Terms</Link>
                <Link to="/Contact" className="text-sm text-muted-foreground hover:text-cyber-blue transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CategoriesPage;
