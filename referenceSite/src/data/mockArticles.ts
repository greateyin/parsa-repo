import { Article, ArticleCategory } from "@/types/article";

export const categories: ArticleCategory[] = [
  { id: "1", name: "人工智慧", slug: "ai", description: "Latest AI breakthroughs and applications" },
  { id: "2", name: "硬體科技", slug: "hardware", description: "Hardware innovations and reviews" },
  { id: "3", name: "軟體開發", slug: "software", description: "Software development trends" },
  { id: "4", name: "網路安全", slug: "security", description: "Cybersecurity news and analysis" },
  { id: "5", name: "雲端運算", slug: "cloud", description: "Cloud computing developments" },
  { id: "6", name: "區塊鏈", slug: "blockchain", description: "Blockchain and crypto technology" },
];

export const mockArticles: Article[] = [
  {
    id: "1",
    title: "GPT-5 Breakthrough: AI Reaches New Heights in Natural Language Understanding",
    excerpt: "OpenAI announces major advancement in language models with unprecedented reasoning capabilities and multimodal integration.",
    content: `OpenAI has unveiled its latest breakthrough in artificial intelligence with the announcement of GPT-5, marking a significant leap forward in natural language processing and reasoning capabilities. The new model demonstrates unprecedented understanding of context, nuance, and complex reasoning tasks.

# Key Features

The GPT-5 architecture introduces several groundbreaking improvements:

## Enhanced Reasoning
The model shows remarkable improvements in logical reasoning, mathematical problem-solving, and multi-step task completion. Early benchmarks suggest performance that rivals human experts in many domains.

## Multimodal Integration
Unlike its predecessors, GPT-5 seamlessly integrates text, image, audio, and video understanding, enabling more comprehensive and contextual responses.

## Improved Factuality
Advanced fact-checking mechanisms and grounding in verified sources significantly reduce hallucinations and improve the reliability of generated content.

# Industry Impact

The release is expected to transform multiple industries:

- **Healthcare**: Enhanced medical diagnosis support and research assistance
- **Education**: Personalized learning experiences at scale
- **Software Development**: More capable code generation and debugging
- **Creative Industries**: Advanced content creation and editing tools

# Ethical Considerations

OpenAI emphasizes that GPT-5 includes robust safety measures and alignment protocols to ensure responsible deployment. The company continues to work with policymakers and researchers to address potential concerns around AI safety and societal impact.`,
    author: "Sarah Chen",
    publishedAt: "2025-10-10T10:00:00Z",
    readTime: 8,
    category: "ai",
    tags: ["AI", "GPT-5", "Machine Learning", "NLP"],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    featured: true,
  },
  {
    id: "2",
    title: "Apple Vision Pro 2: Next-Gen Spatial Computing Arrives",
    excerpt: "Apple's second-generation mixed reality headset promises lighter design, improved performance, and revolutionary AR capabilities.",
    content: `Apple has announced the Vision Pro 2, the highly anticipated successor to its groundbreaking spatial computing platform. The new device addresses many of the concerns raised about the original while introducing compelling new features.

# Design Evolution

The Vision Pro 2 is 30% lighter than its predecessor, making extended wear significantly more comfortable. Apple has also refined the fit system and introduced new cushion materials for improved comfort during long sessions.

# Technical Improvements

Key specifications include:
- M4 and R2 chip combination for enhanced performance
- 4K per eye micro-OLED displays
- Expanded field of view (130 degrees)
- Improved eye tracking with 50% faster response time
- Enhanced hand tracking with sub-millimeter precision

# Software Ecosystem

visionOS 3.0 brings hundreds of new spatial apps and experiences, with major developers like Adobe, Unity, and Autodesk announcing professional-grade applications.`,
    author: "Michael Park",
    publishedAt: "2025-10-09T14:30:00Z",
    readTime: 6,
    category: "hardware",
    tags: ["Apple", "VR", "AR", "Mixed Reality", "Hardware"],
    image: "https://images.unsplash.com/photo-1617802690658-1173a812650d?w=800&q=80",
    featured: true,
  },
  {
    id: "3",
    title: "Quantum Computing Achieves Commercial Viability",
    excerpt: "IBM and Google announce first commercially viable quantum computers, opening new possibilities for drug discovery and cryptography.",
    content: `The quantum computing industry has reached a historic milestone as both IBM and Google announce quantum systems that are now commercially viable for specific applications.

# Technical Achievement

IBM's new "Condor+" system features 1,500 qubits with significantly improved error rates, while Google's "Willow" processor demonstrates quantum advantage in multiple real-world scenarios.

# Practical Applications

Industries are already exploring applications in:
- **Pharmaceutical**: Molecular simulation for drug discovery
- **Finance**: Portfolio optimization and risk analysis
- **Materials Science**: Discovery of new materials and catalysts
- **Cryptography**: Development of post-quantum security systems

The era of practical quantum computing has begun.`,
    author: "Dr. Emily Zhang",
    publishedAt: "2025-10-08T09:15:00Z",
    readTime: 10,
    category: "hardware",
    tags: ["Quantum Computing", "IBM", "Google", "Technology"],
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
  },
  {
    id: "4",
    title: "Revolutionary Cybersecurity Framework Protects Against AI-Powered Attacks",
    excerpt: "New defense system uses AI to detect and neutralize sophisticated threats in real-time, marking major advance in cybersecurity.",
    content: `A consortium of cybersecurity firms has unveiled a revolutionary defense framework capable of detecting and neutralizing AI-powered cyber attacks in real-time.

# The Threat Landscape

As cybercriminals increasingly leverage AI for sophisticated attacks, traditional security measures have become inadequate. The new framework addresses this challenge with adaptive, AI-driven defenses.

# How It Works

The system employs multiple layers of protection:
1. **Behavioral Analysis**: Monitors network patterns to detect anomalies
2. **Predictive Modeling**: Anticipates attack vectors before they're exploited
3. **Automated Response**: Neutralizes threats without human intervention
4. **Continuous Learning**: Adapts to new threat patterns in real-time

# Industry Adoption

Major enterprises and government agencies are already implementing the framework, with early results showing a 95% reduction in successful breaches.`,
    author: "James Rodriguez",
    publishedAt: "2025-10-07T11:45:00Z",
    readTime: 7,
    category: "security",
    tags: ["Cybersecurity", "AI", "Defense", "Enterprise"],
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
  },
  {
    id: "5",
    title: "Edge AI Chips Enable Real-Time Processing on Smartphones",
    excerpt: "New generation of AI processors brings desktop-class performance to mobile devices, revolutionizing mobile computing.",
    content: `Leading semiconductor manufacturers have announced a breakthrough in edge AI processing with chips that bring desktop-class AI performance to smartphones and IoT devices.

# Performance Leap

The new chips deliver:
- 10x faster inference speeds
- 50% reduction in power consumption
- Support for models with up to 100B parameters
- Real-time processing for video and audio

# Applications

This technology enables:
- **Photography**: Professional-grade computational photography
- **Translation**: Real-time language translation without internet
- **Healthcare**: On-device medical diagnostics
- **Privacy**: Sensitive data processing without cloud dependency

The future of mobile computing is here.`,
    author: "Lisa Wang",
    publishedAt: "2025-10-06T13:20:00Z",
    readTime: 5,
    category: "hardware",
    tags: ["Mobile", "AI Chips", "Edge Computing", "Hardware"],
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80",
  },
  {
    id: "6",
    title: "Open Source AI Models Challenge Proprietary Giants",
    excerpt: "Community-driven AI development produces models that rival commercial offerings, democratizing access to advanced AI.",
    content: `The open-source AI community has achieved a major milestone with the release of several models that match or exceed the performance of proprietary alternatives.

# The Open Source Advantage

Community-developed models offer:
- Full transparency and auditability
- Customization for specific use cases
- No vendor lock-in
- Collaborative improvement

# Leading Projects

Notable open-source AI initiatives include:
- **LLaMA 4**: Meta's latest foundation model
- **Mistral Large**: European AI excellence
- **Stable Diffusion XL 2.0**: Next-gen image generation
- **Whisper v3**: Advanced speech recognition

# Impact on Industry

This democratization of AI technology is enabling startups and researchers to innovate without massive computational budgets.`,
    author: "Alex Kumar",
    publishedAt: "2025-10-05T15:00:00Z",
    readTime: 6,
    category: "software",
    tags: ["Open Source", "AI", "Machine Learning", "Community"],
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80",
  },
  {
    id: "7",
    title: "Web Assembly Transforms Browser Gaming Performance",
    excerpt: "WASM 3.0 enables near-native game performance in browsers, blurring lines between native and web applications.",
    content: `The release of WebAssembly 3.0 marks a turning point for web-based applications, particularly gaming, bringing near-native performance to browser environments.

# Technical Advancements

WASM 3.0 introduces:
- SIMD instructions for parallel processing
- Threading support for multi-core utilization
- Direct GPU access for graphics-intensive applications
- Reduced memory overhead

# Gaming Revolution

Major game engines now support WASM:
- Unity WebGL exports with 90% native performance
- Unreal Engine web builds
- Browser-based AAA gaming experiences

# Beyond Gaming

The technology also benefits:
- Video editing applications
- 3D modeling tools
- Scientific visualization
- Data analysis platforms

The browser is becoming the ultimate application platform.`,
    author: "David Thompson",
    publishedAt: "2025-10-04T10:30:00Z",
    readTime: 7,
    category: "software",
    tags: ["WebAssembly", "Gaming", "Web Development", "Performance"],
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80",
  },
  {
    id: "8",
    title: "Blockchain Scalability Solved with New Layer-2 Protocol",
    excerpt: "Innovative protocol achieves 100,000 transactions per second while maintaining decentralization and security.",
    content: `A breakthrough in blockchain technology promises to solve the long-standing scalability trilemma with a novel Layer-2 protocol.

# The Scalability Solution

The new protocol achieves:
- 100,000+ transactions per second
- Sub-second finality
- Minimal transaction fees
- Full decentralization

# Technical Innovation

Key features include:
- Zero-knowledge proof aggregation
- Recursive SNARK verification
- Parallel transaction processing
- Efficient state management

# Real-World Impact

This advancement enables:
- Mainstream payment applications
- High-frequency trading on-chain
- Gaming and metaverse applications
- Enterprise blockchain adoption

The technology is already being integrated into major blockchain networks.`,
    author: "Rachel Martinez",
    publishedAt: "2025-10-03T09:00:00Z",
    readTime: 8,
    category: "blockchain",
    tags: ["Blockchain", "Cryptocurrency", "Scalability", "Layer-2"],
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
    featured: true,
  },
];

export const allTags = Array.from(
  new Set(mockArticles.flatMap((article) => article.tags))
).sort();
