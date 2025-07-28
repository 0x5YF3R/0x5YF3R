import React, { useEffect, useState, useRef, memo } from "react";
import { ForceGraph3D } from "react-force-graph";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import articles from "@/data/articles.json";

const categoryColors = {
  fundamentals: "#00b4d8", // blue
};

const KnowledgeGraph = () => {
  // Define types for nodes and links
  interface GraphNode {
    id: string;
    name: string;
    slug: string;
    category: string;
    val: number;
  }
  interface GraphLink {
    source: string;
    target: string;
    value: number;
  }

  const [graphData, setGraphData] = useState<{ nodes: GraphNode[]; links: GraphLink[] }>({ nodes: [], links: [] });
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const graphRef = useRef<any>(null);
  const navigate = useNavigate();

  // Add state for force parameters
  const [chargeStrength, setChargeStrength] = useState(-80);
  const [linkDistance, setLinkDistance] = useState(80);

  // Responsive width/height for full screen
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!articles || !Array.isArray(articles)) return;
    // Build nodes
    const nodes: GraphNode[] = articles.map((article: any) => ({
      id: article.slug,
      name: article.shortTitle || article.title,
      slug: article.slug,
      category: article.category,
      val: 8,
    }));
    const nodeIds = new Set(nodes.map(n => n.id));
    // Build links, but only if both source and target exist
    // Also add logical links between related topics
    let links: GraphLink[] = articles.flatMap((article: any) =>
      (article.connections || [])
        .filter((conn: string) => nodeIds.has(article.slug) && nodeIds.has(conn))
        .map((conn: string) => ({
          source: article.slug,
          target: conn,
          value: 1,
        }))
    );

    // Add logical links between related topics if not already present
    const logicalPairs: [string, string][] = [
      ["Cloud Security", "Cloud Security Due Diligence"],
      ["Cloud Security", "S3 Buckets"],
      ["Cloud Security", "Security Architecture"],
      ["Security Architecture", "Network Security"],
      ["Security Architecture", "Cryptography"],
      ["Network Security", "Penetration Testing"],
      ["Network Security", "Web Security"],
      ["Web Security", "Cryptography"],
      ["Web Security", "Social Engineering"],
      ["Web Security", "Penetration Testing"],
      ["Web Security", "Secure Coding"],
      ["Malware Analysis", "Digital Forensics"],
      ["Malware Analysis", "Social Engineering"],
      ["Digital Forensics", "Malware Analysis"],
      ["Penetration Testing", "Web Security"],
      ["Penetration Testing", "Network Security"],
      ["Secure Coding", "Web Security"],
      ["Cryptography", "Network Security"],
      ["Cryptography", "Security Architecture"],
      ["Social Engineering", "Web Security"],
      ["Social Engineering", "Malware Analysis"]
    ];
    for (const [a, b] of logicalPairs) {
      if (nodeIds.has(a) && nodeIds.has(b)) {
        if (!links.some(l => (l.source === a && l.target === b) || (l.source === b && l.target === a))) {
          links.push({ source: a, target: b, value: 1 });
        }
      }
    }
    setGraphData({ nodes, links });
  }, []);

  // Force simulation to restart when data is set, but only if there is data
  useEffect(() => {
    if (graphRef.current && graphData.nodes && graphData.nodes.length > 0) {
      // Set force parameters dynamically
      graphRef.current.d3Force('charge').strength(chargeStrength);
      graphRef.current.d3Force('link').distance(linkDistance);
      graphRef.current.d3ReheatSimulation();
    }
  }, [graphData, chargeStrength, linkDistance]);

  const handleNodeClick = (node: GraphNode) => setSelectedNode(node);

  const getConnectedNodes = (node: GraphNode, data: { nodes: GraphNode[]; links: GraphLink[] }) => {
    if (!node) return [];
    const connectedIds = data.links
      .filter(l => l.source === node.id || l.target === node.id)
      .map(l => (l.source === node.id ? l.target : l.source));
    return data.nodes.filter(n => connectedIds.includes(n.id));
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        background: "var(--background, #181a20)"
      }}
    >
      <ForceGraph3D
        ref={graphRef}
        graphData={graphData}
        nodeId="id"
        nodeLabel="name"
        nodeColor={node => categoryColors[node.category] || "#00b4d8"}
        nodeRelSize={3}
        nodeThreeObjectExtend={false}
        nodeThreeObject={node => {
          // Render a sphere and text label sprite above the node
          const group = new THREE.Group();

          const color = categoryColors[node.category] || "#00b4d8";
          const geometry = new THREE.SphereGeometry(node.val || 5, 16, 16);
          const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.35 });
          const sphere = new THREE.Mesh(geometry, material);
          group.add(sphere);

          // Draw label sprite
          const fontSize = 28;
          const padding = 24;
          const text = node.name || node.id;
          const tempCanvas = document.createElement("canvas");
          const tempCtx = tempCanvas.getContext("2d");
          if (!tempCtx) return group;
          tempCtx.font = `bold ${fontSize}px JetBrains Mono, monospace`;
          const textWidth = tempCtx.measureText(text).width;
          const width = Math.ceil(textWidth + padding * 2);
          const height = fontSize + padding;
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return group;
          ctx.clearRect(0, 0, width, height);
          ctx.font = `bold ${fontSize}px JetBrains Mono, monospace`;
          ctx.fillStyle = color;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.shadowColor = color;
          ctx.shadowBlur = 8;
          ctx.fillText(text, width / 2, height / 2);

          const texture = new THREE.CanvasTexture(canvas);
          texture.needsUpdate = true;
          texture.minFilter = THREE.LinearFilter;
          const spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            alphaTest: 0.05,
            depthWrite: false
          });
          const sprite = new THREE.Sprite(spriteMaterial);
          const scale = 0.25;
          sprite.scale.set(width * scale, height * scale, 1);
          sprite.position.set(0, (node.val || 5) + (height * scale) / 2 + 2, 0);
          group.add(sprite);

          return group;
        }}
        linkColor={link => {
          const sourceNode = graphData.nodes.find(n => n.id === link.source);
          return categoryColors[sourceNode?.category] || "#00b4d8";
        }}
        linkWidth={1}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={2}
        linkDirectionalParticleSpeed={0.005}
        onNodeClick={handleNodeClick}
        width={dimensions.width}
        height={dimensions.height}
        d3VelocityDecay={0.28}
      />
      {/* Node/link force controls */}
      <div className="absolute z-10 p-3 bg-cyber-dark/80 backdrop-blur-sm rounded-md border border-cyber-blue/20 flex flex-col gap-3 min-w-[160px] w-[200px]"
        style={{ top: '84px', right: '10px' }} // right: 10px to match NavBar, top: 84px for alignment
      >
        <div>
          <label className="block text-cyber-blue font-mono text-xs mb-1" htmlFor="chargeStrength">Node Repulsion</label>
          <div className="flex items-center gap-2 w-full">
            <input
              id="chargeStrength"
              type="range"
              min="-300"
              max="0"
              step="1"
              value={chargeStrength}
              onChange={e => setChargeStrength(Number(e.target.value))}
              style={{ accentColor: '#00b4d8', width: '100%', height: '4px' }}
              className="h-1 w-full rounded-full outline-none border-none bg-cyber-blue/30 slider-thumb-cyber"
            />
          </div>
        </div>
        <div>
          <label className="block text-cyber-blue font-mono text-xs mb-1" htmlFor="linkDistance">Link Distance</label>
          <div className="flex items-center gap-2 w-full">
            <input
              id="linkDistance"
              type="range"
              min="20"
              max="300"
              step="1"
              value={linkDistance}
              onChange={e => setLinkDistance(Number(e.target.value))}
              style={{ accentColor: '#00b4d8', width: '100%', height: '4px' }}
              className="h-1 w-full rounded-full outline-none border-none bg-cyber-blue/30 slider-thumb-cyber"
            />
          </div>
        </div>
      </div>

      {/* Popup for selected node */}
      {selectedNode && (
        <div
          className="fixed left-1/2 top-1/2 z-20 bg-cyber-dark/95 border border-cyber-blue/40 rounded-xl shadow-2xl p-10 min-w-[400px] max-w-[90vw] max-h-[80vh] overflow-auto"
          style={{ transform: "translate(-50%, -50%)" }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-cyber-blue text-2xl font-bold font-mono">{selectedNode.name}</h2>
            <button
              className="text-cyber-blue hover:text-white text-2xl font-bold ml-4"
              onClick={() => setSelectedNode(null)}
              aria-label="Close"
            >×</button>
          </div>
          <div className="mb-2 text-cyber-blue/80 text-xs font-mono">
            Category: <span className="capitalize">{selectedNode.category}</span>
          </div>
          <div className="mb-4 text-cyber-blue/80 text-xs font-mono">
            Slug: <span>{selectedNode.slug}</span>
          </div>
          <div className="mb-2 font-semibold text-cyber-blue">Connected Articles:</div>
          <ul className="list-disc pl-5">
            {getConnectedNodes(selectedNode, graphData).map(n => (
              <li key={n.id}>
                <button
                  className="text-cyber-blue hover:underline font-mono text-sm bg-transparent border-none p-0 m-0 cursor-pointer"
                  onClick={() => setSelectedNode(n)}
                >
                  {n.name}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <button
              className="bg-cyber-blue text-cyber-dark px-4 py-2 rounded font-mono font-bold hover:bg-cyber-blue/80"
              onClick={() => navigate(`/articles/${selectedNode.slug}`)}
            >
              View Article
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(KnowledgeGraph);

/* Add this CSS to your index.css or a global stylesheet */
