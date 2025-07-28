import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Clock, Folder, List } from 'lucide-react';
import { getArticle, getConnectedArticles } from '@/services/articleService';
import { ForceGraph2D } from 'react-force-graph';

interface Article {
  slug: string;
  title: string;
  shortTitle?: string;
  category: string;
  tags: string[];
  date: string;
  excerpt: string;
  content: string;
  connections: string[];
}

const ConnectedArticlesGraph = ({ article, connectedArticles }) => {
  // Build nodes: main article + connected articles
  const nodes = [
    {
      id: article.slug,
      name: article.shortTitle || article.title,
      slug: article.slug,
      category: article.category,
      val: 10,
    },
    ...connectedArticles.map((a) => ({
      id: a.slug,
      name: a.shortTitle || a.title,
      slug: a.slug,
      category: a.category,
      val: 7,
    })),
  ];
  // Build links: from main article to each connected
  const links = connectedArticles.map((a) => ({
    source: article.slug,
    target: a.slug,
    value: 1,
  }));
  return (
    <ForceGraph2D
      graphData={{ nodes, links }}
      nodeColor={() => 'hsl(var(--primary))'}
      nodeRelSize={3}
      nodeCanvasObject={(node, ctx, globalScale) => {
        // Use CSS variable for color
        const color = getComputedStyle(document.documentElement).getPropertyValue('--primary') || '#00b4d8';
        ctx.beginPath();
        ctx.arc(node.x || 0, node.y || 0, node.val || 5, 0, 2 * Math.PI, false);
        ctx.shadowBlur = 25;
        ctx.shadowColor = `hsl(${color})`;
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = `hsl(${color})`;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
        // Draw label
        if (globalScale > 0.7) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = `hsl(${color})`;
          ctx.fillStyle = `hsl(${color})`;
          ctx.font = `bold 12px JetBrains Mono, monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(node.name, node.x || 0, (node.y || 0) + 12);
          ctx.shadowBlur = 0;
          ctx.shadowColor = 'transparent';
        }
      }}
      linkColor={() => 'hsl(var(--primary))'}
      linkWidth={1}
      linkDirectionalParticles={2}
      linkDirectionalParticleWidth={2}
      linkDirectionalParticleSpeed={0.005}
      width={250}
      height={220}
      cooldownTicks={50}
      d3VelocityDecay={0.1}
    />
  );
};

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [connectedArticles, setConnectedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) {
      const articleData = getArticle(slug);
      setArticle(articleData);
      
      if (articleData) {
        const connected = getConnectedArticles(slug);
        setConnectedArticles(connected);
      }
      
      setLoading(false);
    }
  }, [slug]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-cyber-black">
        <NavBar />
        <div className="container mx-auto px-4 py-12 flex-1 flex items-center justify-center">
          <div className="animate-pulse text-cyber-blue">Loading article...</div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex flex-col min-h-screen bg-cyber-black">
        <NavBar />
        <div className="container mx-auto px-4 py-12 flex-1">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-cyber-blue mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist or may have been moved.</p>
            <Button onClick={() => navigate('/')}>
              Return to Knowledge Graph
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-cyber-black">
      <NavBar />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            className="mb-6 text-muted-foreground hover:text-cyber-blue"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="mb-6">
                <h1 className="text-3xl font-mono font-bold text-cyber-blue mb-2">{article.title}</h1>
                
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatDate(article.date)}
                  </div>
                  
                  <div className="flex items-center">
                    <Folder className="h-4 w-4 mr-1" />
                    <Link 
                      to={`/categories/${article.category}`}
                      className="hover:text-cyber-blue transition-colors"
                    >
                      <Badge variant="outline" className="bg-cyber-blue/20 text-cyber-blue border-cyber-blue/30 capitalize">
                        {article.category}
                      </Badge>
                    </Link>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {article.tags.map((tag) => (
                    <Link key={tag} to={`/tags/${tag}`}>
                      <Badge variant="secondary" className="hover:bg-secondary/80">
                        #{tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
              
              <MarkdownRenderer content={article.content} />
            </div>
            
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <Card className="bg-cyber-dark/90 border-cyber-blue/30 mb-6 backdrop-blur-md">
                  <div className="p-4">
                    <h3 className="text-lg font-mono font-medium text-cyber-blue mb-3 flex items-center">
                      <List className="h-4 w-4 mr-2" />
                      Connected Articles
                    </h3>
                    
                    {connectedArticles.length > 0 ? (
                      <ul className="space-y-2">
                        {connectedArticles.map((connectedArticle) => (
                          <li key={connectedArticle.slug}>
                            <Link
                              to={`/articles/${connectedArticle.slug}`}
                              className="block p-2 rounded hover:bg-cyber-blue/10 transition-colors"
                            >
                              <div className="font-medium text-cyber-blue">{connectedArticle.title}</div>
                              <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {connectedArticle.excerpt}
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">No connected articles found.</p>
                    )}
                  </div>
                </Card>

                <Card className="bg-cyber-dark/90 border-cyber-blue/30 mb-6 backdrop-blur-md">
                  <div className="p-4">
                    <h3 className="text-lg font-mono font-medium text-cyber-blue mb-3 flex items-center">
                      <List className="h-4 w-4 mr-2" />
                      Connected Graph
                    </h3>
                    <div style={{ width: '100%', height: 250 }}>
                      {connectedArticles.length > 0 && (
                        <ConnectedArticlesGraph
                          article={article}
                          connectedArticles={connectedArticles}
                        />
                      )}
                    </div>
                  </div>
                </Card>

                <Card className="bg-cyber-dark/90 border-cyber-blue/30 backdrop-blur-md">
                  <div className="p-4">
                    <h3 className="text-lg font-mono font-medium text-cyber-blue mb-3">Explore More</h3>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left border-cyber-blue/30 hover:bg-cyber-blue/10"
                        onClick={() => navigate('/')}
                      >
                        View Knowledge Graph
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left border-cyber-blue/30 hover:bg-cyber-blue/10"
                        onClick={() => navigate('/articles')}
                      >
                        Browse All Articles
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-cyber-dark border-t border-cyber-blue/20 py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © {new Date().getFullYear()} CyberKnowledge • Built with Obsidian-inspired Graph
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-sm text-muted-foreground hover:text-cyber-blue transition-colors">Privacy</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-cyber-blue transition-colors">Terms</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-cyber-blue transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ArticlePage;