export const projects = [
  {
    slug: "image-segmentation",
    name: "Satellite Segmentation",
    category: "COMPUTER VISION",
    description:
      "A Huawei internship project exploring six-class satellite segmentation, data-pipeline debugging and test-time augmentation with U-Net.",
    tags: ["Python", "PyTorch", "OpenCV", "U-Net", "Semantic segmentation", "NumPy", "pandas"],
    repo: "BerhanDemiralp/ImageSegmentationProject",
  },
  {
    slug: "coupon-recommendation",
    name: "Coupon Prediction",
    category: "MACHINE LEARNING",
    description:
      "Exploring coupon acceptance through preprocessing, model comparison and threshold optimization.",
    tags: ["Python", "scikit-learn", "Random Forest", "Model evaluation", "Feature Engineering"],
    repo: "BerhanDemiralp/Coupon-Recommendation",
  },
  {
    slug: "iuchat",
    name: "IUCHAT",
    category: "RAG · CAPSTONE PROJECT",
    description:
      "A Turkish-language assistant that answers student questions using official university documents and shows the pages behind its answers.",
    tags: ["Python", "Streamlit", "Supabase", "PostgreSQL", "LLM", "RAG", "Gemini"],
    repo: "BerhanDemiralp/IUCHAT",
  },
  {
    slug: "social-media-app",
    name: "Social Matching App",
    category: "MOBILE · REAL-TIME SYSTEMS",
    description: "A social app connecting scheduled pairings, friendships and persistent conversations.",
    tags: ["Flutter", "NestJS", "Prisma", "PostgreSQL", "Socket.io", "Supabase", "Spec-Driven Development"],
    repo: "BerhanDemiralp/SocialMediaApp",
  },
  {
    slug: "e-carbon",
    name: "Carbon Reporting",
    category: "BACKEND · EMISSIONS REPORTING",
    description: "Traceable emissions records, monthly snapshots and verifiable PDF reports for company facilities.",
    tags: ["C#", ".NET", "EF Core", "PostgreSQL", "MediatR", "QuestPDF"],
    repo: "BerhanDemiralp/e-Carbon",
  },
  {
    slug: "keep-in-touch",
    name: "Veterinary Records",
    category: "MOBILE · TEAM PROTOTYPE",
    description: "A Flutter prototype connecting animal profiles, owners and veterinary visit records.",
    tags: ["Flutter", "Dart", "Team coordination"],
    repo: "BerhanDemiralp/KeepInTouch",
  },
  {
    slug: "naor",
    name: "Action Platformer Game",
    category: "GAME DEVELOPMENT",
    description:
      "An OTK team action platformer, with contributions to inventory, equipment, throwable mechanics and player feedback.",
    tags: ["Unity", "C#", "Version Control", "Teamwork", "Time Management", "Agile"],
    repo: "OTK-LAB/NAOR",
  },
  {
    slug: "inventory-system",
    name: "Inventory Management Tool",
    category: "GAME DEVELOPMENT",
    description: "A ScriptableObject-based Unity inventory connecting item stacks, shop stock, equipment and a tabbed interface.",
    tags: ["Unity", "C#", "ScriptableObjects", "Inventory systems"],
    repo: "BerhanDemiralp/InventorySystem",
  },
  {
    slug: "vertical-slice-architecture",
    name: "Feature Flag API",
    category: "SOFTWARE ARCHITECTURE",
    description: "Feature-focused APIs with runtime flags, Redis caching and persistent storage, organized around individual use cases.",
    tags: ["C#", ".NET Minimal API", "Redis", "SQLite", "Docker", "Feature flags"],
    repo: "BerhanDemiralp/VerticalSliceArchitecture",
  },
];
export type Project = (typeof projects)[number];
