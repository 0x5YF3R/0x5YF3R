import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Clock, Folder, Search } from 'lucide-react';
import { getAllArticles } from '@/services/articleService';

interface Article {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  date: string;
  excerpt: string;
}

const ArticlesPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    const fetchedArticles = getAllArticles();
    setArticles(fetchedArticles);
    setFilteredArticles(fetchedArticles);
  }, []);

  useEffect(() => {
    filterArticles();
  }, [searchTerm, selectedCategory, selectedTag, articles]);

  const filterArticles = () => {
    let filtered = [...articles];
    
    if (searchTerm.trim()) {
      filtered = filtered.filter((article) => 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter((article) => article.category === selectedCategory);
    }
    
    if (selectedTag) {
      filtered = filtered.filter((article) => article.tags.includes(selectedTag));
    }
    
    setFilteredArticles(filtered);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get unique categories
  const categories = [...new Set(articles.map((article) => article.category))];
  
  // Get all unique tags
  const allTags = [...new Set(articles.flatMap((article) => article.tags))];

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#10131a' }}>
      <NavBar />
      <div style={{ height: 56 }} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-mono font-bold text-cyber-blue">Articles</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Browse all cybersecurity articles and resources
              </p>
            </div>
            
            <div className="flex items-center w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  className="pl-9 bg-[#10131a] border-cyber-blue/20 focus:border-cyber-blue focus-visible:ring-cyber-blue/20"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="sticky top-8 space-y-6">
                <Card className="bg-[#10131a] border-cyber-blue/30 hover:border-cyber-blue/40 transition-colors backdrop-blur-md">
                  <div className="p-4">
                    <h3 className="text-lg font-mono font-medium text-cyber-blue mb-3">Categories</h3>
                    <div className="space-y-2">
                      <Button
                        variant={!selectedCategory ? "default" : "outline"}
                        className={!selectedCategory ? "bg-cyber-blue text-white hover:bg-cyber-blue/90" : "border-cyber-blue/30 hover:bg-cyber-blue/10"}
                        size="sm"
                        onClick={() => setSelectedCategory(null)}
                      >
                        All Categories
                      </Button>
                      
                      {categories.map((category) => (
                        <Button
                          key={category}
                          variant={selectedCategory === category ? "default" : "outline"}
                          className={`$${
                            selectedCategory === category 
                              ? "bg-cyber-blue text-white hover:bg-cyber-blue/90" 
                              : "border-cyber-blue/30 hover:bg-cyber-blue/10"
                          } capitalize mb-2`}
                          size="sm"
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                  </div>
                </Card>
                
                <Card className="bg-[#10131a] border-cyber-blue/30 backdrop-blur-md">
                  <div className="p-4">
                    <h3 className="text-lg font-mono font-medium text-cyber-blue mb-3">Popular Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant={selectedTag === tag ? "default" : "secondary"}
                          className={`cursor-pointer ${
                            selectedTag === tag 
                              ? "bg-cyber-green text-black hover:bg-cyber-blue/90" 
                              : "hover:bg-secondary/80"
                          }`}
                          onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
            
            <div className="lg:col-span-3 order-1 lg:order-2">
              <div className="space-y-6">
                {filteredArticles.length > 0 ? (
                  filteredArticles.map((article) => (
                    <Card 
                      key={article.slug}
                      className="bg-[#10131a] border-cyber-blue/30 hover:border-cyber-blue/40 transition-colors backdrop-blur-md"
                    >
                      <Link to={`/articles/${article.slug}`} className="block p-6">
                        <div className="mb-2">
                          <Badge variant="outline" className="bg-cyber-blue/20 text-cyber-blue border-cyber-blue/30 capitalize">
                            {article.category}
                          </Badge>
                        </div>
                        
                        <h2 className="text-xl font-mono font-bold text-cyber-blue hover:text-cyber-blue/50 transition-colors mb-2">
                          {article.title}
                        </h2>
                        
                        <div className="flex items-center text-sm text-muted-foreground mb-3">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatDate(article.date)}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-4">
                          {article.excerpt}
                        </p>
                        
                        <div className="flex flex-wrap gap-2">
                          {article.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="hover:bg-secondary/80">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </Link>
                    </Card>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="text-center">
                      <h3 className="text-xl font-medium text-cyber-blue mb-2">No articles found</h3>
                      <p className="text-muted-foreground mb-4">
                        Try changing your search term or filters
                      </p>
                      <Button 
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory(null);
                          setSelectedTag(null);
                        }}
                      >
                        Reset Filters
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t border-cyber-blue/20 py-6 mt-12" style={{ background: '#10131a' }}>
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

export default ArticlesPage;
