import React from 'react';
import NavBar from '@/components/NavBar';
import { Card } from '@/components/ui/card';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { useNavigate, Link } from 'react-router-dom';

const ContactPage = () => {
  const aboutMarkdown = `
# About CyberKnowledge Graph

## Our Mission

The CyberKnowledge Graph is a unique learning platform designed to help cybersecurity enthusiasts, students, and professionals explore the interconnected world of cybersecurity concepts through an intuitive graph-based interface inspired by Obsidian's knowledge graph.

## How It Works

The knowledge graph visualizes relationships between cybersecurity topics, making it easier to:

- Discover connections between related security concepts
- Navigate through complex cybersecurity domains
- Build a comprehensive mental model of cybersecurity

## Features

- **Interactive Graph Visualization**: Explore topics and their interconnections visually
- **Markdown-Based Articles**: All content is written in Markdown, making it easy to read and update
- **Category & Tag Organization**: Find related content through intuitive categorization
- **Connected Articles**: Each article links to related topics, creating a web of knowledge

## Contributing

This platform represents my current understanding of the cyber security domain. I welcome contributions from the community to help expand and improve the knowledge base. If you're interested in contributing, please follow these steps:

1. Write your articles in Markdown format
2. Include proper frontmatter with tags, categories, and connections
3. Submit a pull request to our repository

## Future Plans

We're constantly expanding our knowledge base with new articles and improving the platform with features like:

- User accounts and personal knowledge graphs
- Content submission portal
- Advanced search and filtering
- Interactive learning paths

## Contact

Have questions, feedback, or want to contribute? Reach out to us at 0x5yf3r@proton.me.

---

*"The most powerful tool we have as defenders is knowledge."*
  `;

  return (
    <div className="flex flex-col min-h-screen bg-cyber-black ">
      <NavBar />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-cyber-dark border-cyber-blue/20 mb-6">
              <div className="p-6">
                <MarkdownRenderer content={aboutMarkdown} />
              </div>
            </Card>

            <Card className="bg-cyber-dark border-cyber-blue/20">
              <div className="p-6">
                <h2 className="text-2xl font-mono font-bold text-cyber-blue mb-4">The Maintainer</h2>
                <p className="text-muted-foreground mb-6">
                  0x5yf3r (read as hex cipher) is maintained by myself as a passion project to document the my knowledge of Cybersecurity 
                  domain and is semantic connections. I am a security student focusing on web security, cryptography, web3, and threat hunting. 
                  I aim to create a comprehensive resource for anyone interested in cybersecurity.
                </p>
                <div className="flex flex-col items-center text-center p-4">
                  <div className="w-20 h-20 rounded-full bg-cyber-blue/20 flex items-center justify-center mb-3">
                    <span className="text-2xl text-cyber-blue">JD</span>
                  </div>
                  <h3 className="text-lg font-mono font-medium text-cyber-blue">Joshua Dix</h3>
                  <p className="text-sm text-muted-foreground mt-1">Security Researcher & Maintainer</p>
                </div>
              </div>
            </Card>
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

export default ContactPage;
