import React, { useRef, useEffect, useState } from 'react';
import NavBar from '@/components/NavBar';
import KnowledgeGraph from '@/components/KnowledgeGraph';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  // console.log('Index page rendered');
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const navigate = useNavigate();

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };

    // Initial update
    updateDimensions();
    
    // Add event listener
    window.addEventListener('resize', updateDimensions);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-cyber-black">
      
      <NavBar />
      
      <main className="flex-1 flex flex-col">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-mono font-bold text-cyber-blue">CyberSecurity Knowledge Graph</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Explore the interconnected world of cybersecurity concepts
              </p>
            </div>
            <Button 
              variant="outline" 
              className="border-cyber-blue text-cyber-blue hover:bg-cyber-blue/20"
              onClick={() => navigate('/articles')}
            >
              Browse All Articles <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div 
            ref={containerRef} 
            className="w-full h-[calc(100vh-220px)] min-h-[500px] border border-cyber-blue/20 rounded-lg overflow-hidden bg-cyber-dark/50"
          >
            <KnowledgeGraph width={dimensions.width} height={dimensions.height} />
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-cyber-dark p-4 rounded-lg border border-cyber-blue/20">
              <h3 className="text-lg font-mono font-medium text-cyber-blue mb-2">Navigate the Knowledge Graph</h3>
              <p className="text-sm text-muted-foreground">
                The graph visualizes relationships between cybersecurity concepts. Click on nodes to explore articles or drag to rearrange the network.
              </p>
            </div>
            <div className="bg-cyber-dark p-4 rounded-lg border border-cyber-blue/20">
              <h3 className="text-lg font-mono font-medium text-cyber-blue mb-2">Latest Updates</h3>
              <p className="text-sm text-muted-foreground">
                New articles on web security, cryptography fundamentals, and network defense strategies have been added. Click on the corresponding nodes to read more.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-cyber-dark border-t border-cyber-blue/20 py-6">
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

export default Index;
