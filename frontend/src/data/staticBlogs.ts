export interface StaticBlog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedDate: string;
  readTime: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    ogImage?: string;
  };
  relatedBlogs?: string[];
}

export const staticBlogs: StaticBlog[] = [
  {
    id: "how-to-source-basmati-rice",
    title: "How to Source and Sample Authentic Basmati Rice: A Practical Guide",
    slug: "how-to-source-basmati-rice",
    excerpt: "A comprehensive guide to sourcing and sampling authentic Basmati rice. Learn how to find reliable exporters, evaluate samples, handle logistics, and avoid common pitfalls in rice import.",
    content: "A comprehensive guide to sourcing and sampling authentic Basmati rice. Learn how to find reliable exporters, evaluate samples, handle logistics, and avoid common pitfalls in rice import.",
    author: "Amber Global Team",
    publishedDate: "2024-12-19",
    readTime: "8 min read",
    category: "Rice Sourcing",
    tags: ["Basmati Rice", "Sourcing", "Sampling", "Quality Control", "Export", "Import"],
    seo: {
      metaTitle: "How to Source and Sample Authentic Basmati Rice: A Practical Guide | Amber Global",
      metaDescription: "A comprehensive guide to sourcing and sampling authentic Basmati rice. Learn how to find reliable exporters, evaluate samples, handle logistics, and avoid common pitfalls in rice import.",
      keywords: ["Basmati rice", "sourcing", "sampling", "authentic Basmati", "GI certification", "rice export", "quality control", "FSSAI", "EU standards", "FDA", "APEDA", "rice importers", "supply chain", "food safety", "rice varieties", "1121 Basmati", "Traditional Basmati", "Pusa Basmati"],
    },
    relatedBlogs: ["private-labeling-basmati-rice", "basmati-rice-export-business"]
  },
  {
    id: "private-labeling-basmati-rice",
    title: "Guide for Private Labeling in Wholesale Basmati Rice in 2025: Building Your Brand Without Owning a Mill",
    slug: "private-labeling-basmati-rice",
    excerpt: "Complete guide to private labeling in wholesale Basmati rice. Learn how to build your brand without owning a mill, step-by-step process, compliance requirements, and market trends for 2025.",
    content: "Complete guide to private labeling in wholesale Basmati rice. Learn how to build your brand without owning a mill, step-by-step process, compliance requirements, and market trends for 2025.",
    author: "Amber Global Team",
    publishedDate: "2024-12-19",
    readTime: "6 min read",
    category: "Private Labeling",
    tags: ["Private Labeling", "Basmati Rice", "Wholesale", "Brand Building", "Rice Export", "Rice Packaging", "Rice Certification"],
    seo: {
      metaTitle: "Guide for Private Labeling in Wholesale Basmati Rice in 2025: Building Your Brand Without Owning a Mill | Amber Global",
      metaDescription: "Complete guide to private labeling in wholesale Basmati rice. Learn how to build your brand without owning a mill, step-by-step process, compliance requirements, and market trends for 2025.",
      keywords: ["private labeling", "Basmati rice", "wholesale", "brand building", "rice export", "private label rice", "rice packaging", "rice certification", "FSSAI", "FDA", "BRC", "ISO 22000", "rice compliance", "rice branding", "rice mill", "rice manufacturing"],
    },
    relatedBlogs: ["how-to-source-basmati-rice", "basmati-rice-export-business"]
  },
  {
    id: "basmati-rice-export-business",
    title: "2025 Guide: How to Start a Compliant Basmati Rice Export Business from India",
    slug: "basmati-rice-export-business",
    excerpt: "Complete 2025 guide to starting a compliant Basmati rice export business from India. Learn about IEC renewal, APEDA registration, FSSAI compliance, digital traceability, and export documentation.",
    content: "Complete 2025 guide to starting a compliant Basmati rice export business from India. Learn about IEC renewal, APEDA registration, FSSAI compliance, digital traceability, and export documentation.",
    author: "Amber Global Team",
    publishedDate: "2024-12-19",
    readTime: "10 min read",
    category: "Export Business",
    tags: ["Basmati Rice Export Business", "IEC Renewal 2025", "APEDA Registration", "FSSAI Compliance", "Rice Export India", "Digital Traceability", "Export Documentation"],
    seo: {
      metaTitle: "2025 Guide: How to Start a Compliant Basmati Rice Export Business from India | Amber Global",
      metaDescription: "Complete 2025 guide to starting a compliant Basmati rice export business from India. Learn about IEC renewal, APEDA registration, FSSAI compliance, digital traceability, and export documentation.",
      keywords: ["Basmati rice export business", "IEC renewal 2025", "APEDA registration", "FSSAI compliance", "rice export India", "digital traceability", "export documentation", "rice export compliance"],
    },
    relatedBlogs: ["how-to-source-basmati-rice", "private-labeling-basmati-rice"]
  },
  {
    id: "organic-spice-export-business",
    title: "2025 Guide: How to Start a Compliant Organic Spice Export Business from India",
    slug: "organic-spice-export-business",
    excerpt: "Complete guide to starting a compliant organic spice export business from India. Learn about NPOP certification, Spices Board registration, digital traceability, and export compliance.",
    content: "Complete guide to starting a compliant organic spice export business from India. Learn about NPOP certification, Spices Board registration, digital traceability, and export compliance.",
    author: "Amber Global Team",
    publishedDate: "2024-12-19",
    readTime: "9 min read",
    category: "Export Business",
    tags: ["Organic Spice Export Business", "NPOP Certification", "Spices Board Registration", "Spice Export India", "Organic Certification", "Digital Traceability", "Export Compliance"],
    seo: {
      metaTitle: "2025 Guide: How to Start a Compliant Organic Spice Export Business from India | Amber Global",
      metaDescription: "Complete guide to starting a compliant organic spice export business from India. Learn about NPOP certification, Spices Board registration, digital traceability, and export compliance.",
      keywords: ["organic spice export business", "NPOP certification", "Spices Board registration", "spice export India", "organic certification", "digital traceability", "export compliance"],
    },
    relatedBlogs: ["private-labeling-spices", "how-to-source-indian-spices"]
  },
  {
    id: "private-labeling-spices",
    title: "2025 Guide to Private Labeling in Spices: Build a Global Brand Without Owning Infrastructure",
    slug: "private-labeling-spices",
    excerpt: "Complete 2025 guide to private labeling in spices. Learn how to build a global spice brand without owning infrastructure, from sourcing to compliance and market entry.",
    content: "Complete 2025 guide to private labeling in spices. Learn how to build a global spice brand without owning infrastructure, from sourcing to compliance and market entry.",
    author: "Amber Global Team",
    publishedDate: "2024-12-19",
    readTime: "7 min read",
    category: "Private Labeling",
    tags: ["Private Labeling Spices", "Spice Private Label", "Spice Branding", "Spice Export Business", "Spice Manufacturing", "Spice Compliance", "Spice Packaging"],
    seo: {
      metaTitle: "2025 Guide to Private Labeling in Spices: Build a Global Brand Without Owning Infrastructure | Amber Global",
      metaDescription: "Complete 2025 guide to private labeling in spices. Learn how to build a global spice brand without owning infrastructure, from sourcing to compliance and market entry.",
      keywords: ["private labeling spices", "spice private label", "spice branding", "spice export business", "spice manufacturing", "spice compliance", "spice packaging"],
    },
    relatedBlogs: ["organic-spice-export-business", "how-to-source-indian-spices"]
  },
  {
    id: "how-to-source-indian-spices",
    title: "How to Source and Sample Authentic Indian Spices: A Practical Guide (2025 Edition)",
    slug: "how-to-source-indian-spices",
    excerpt: "Complete 2025 guide to sourcing and sampling authentic Indian spices. Learn about quality assessment, compliance, traceability, and avoiding common pitfalls in spice import.",
    content: "Complete 2025 guide to sourcing and sampling authentic Indian spices. Learn about quality assessment, compliance, traceability, and avoiding common pitfalls in spice import.",
    author: "Amber Global Team",
    publishedDate: "2024-12-19",
    readTime: "8 min read",
    category: "Spice Sourcing",
    tags: ["Indian Spices Sourcing", "Spice Sampling", "Spice Quality Assessment", "Spice Import Guide", "Spice Compliance", "Spice Traceability", "Authentic Spices"],
    seo: {
      metaTitle: "How to Source and Sample Authentic Indian Spices: A Practical Guide (2025 Edition) | Amber Global",
      metaDescription: "Complete 2025 guide to sourcing and sampling authentic Indian spices. Learn about quality assessment, compliance, traceability, and avoiding common pitfalls in spice import.",
      keywords: ["Indian spices sourcing", "spice sampling", "spice quality assessment", "spice import guide", "spice compliance", "spice traceability", "authentic spices"],
    },
    relatedBlogs: ["organic-spice-export-business", "private-labeling-spices"]
  },
  {
    id: "ginger-powder-sourcing-guide",
    title: "The Ultimate 2025 Guide to Sourcing & Sampling Ginger Powder: A Business Playbook",
    slug: "ginger-powder-sourcing-guide",
    excerpt: "Master the art of sourcing and sampling high-quality ginger powder in 2025. This comprehensive guide covers everything from vetting suppliers and testing for gingerol content to understanding MOQs and pricing benchmarks for your business.",
    content: "Master the art of sourcing and sampling high-quality ginger powder in 2025. This comprehensive guide covers everything from vetting suppliers and testing for gingerol content to understanding MOQs and pricing benchmarks for your business.",
    author: "Amber Global Team",
    publishedDate: "2024-12-19",
    readTime: "6 min read",
    category: "Spice Sourcing",
    tags: ["ginger powder sourcing", "ginger powder sampling", "organic ginger powder", "gingerol content testing", "ginger powder suppliers", "ginger powder MOQ", "ginger powder export"],
    seo: {
      metaTitle: "The Ultimate 2025 Guide to Sourcing & Sampling Ginger Powder: A Business Playbook | Amber Global",
      metaDescription: "Master the art of sourcing and sampling high-quality ginger powder in 2025. This comprehensive guide covers everything from vetting suppliers and testing for gingerol content to understanding MOQs and pricing benchmarks for your business.",
      keywords: ["ginger powder sourcing", "ginger powder sampling", "organic ginger powder", "gingerol content testing", "ginger powder suppliers", "ginger powder MOQ", "ginger powder export"],
    },
    relatedBlogs: ["private-labeling-ginger-powder", "export-organic-ginger-powder"]
  },
  {
    id: "private-labeling-ginger-powder",
    title: "2025 Guide to Private Labeling Ginger Powder: Build a Premium Brand Without Owning a Factory",
    slug: "private-labeling-ginger-powder",
    excerpt: "Complete 2025 guide to private labeling ginger powder. Learn how to build a premium ginger powder brand without owning a factory, from sourcing to compliance and market entry.",
    content: "Complete 2025 guide to private labeling ginger powder. Learn how to build a premium ginger powder brand without owning a factory, from sourcing to compliance and market entry.",
    author: "Amber Global Team",
    publishedDate: "2024-12-19",
    readTime: "5 min read",
    category: "Private Labeling",
    tags: ["private labeling ginger powder", "ginger powder private label", "ginger powder branding", "ginger powder export business", "ginger powder manufacturing", "ginger powder compliance", "ginger powder packaging"],
    seo: {
      metaTitle: "2025 Guide to Private Labeling Ginger Powder: Build a Premium Brand Without Owning a Factory | Amber Global",
      metaDescription: "Complete 2025 guide to private labeling ginger powder. Learn how to build a premium ginger powder brand without owning a factory, from sourcing to compliance and market entry.",
      keywords: ["private labeling ginger powder", "ginger powder private label", "ginger powder branding", "ginger powder export business", "ginger powder manufacturing", "ginger powder compliance", "ginger powder packaging"],
    },
    relatedBlogs: ["ginger-powder-sourcing-guide", "export-organic-ginger-powder"]
  },
  {
    id: "export-organic-ginger-powder",
    title: "2025 Guide: How to Export Organic Ginger Powder from India—Compliance, Documentation, and Success",
    slug: "export-organic-ginger-powder",
    excerpt: "Master the process of exporting organic ginger powder from India. This guide covers mandatory registrations (IEC, CRES), organic certification, essential documentation, and common pitfalls to ensure your business thrives in global markets.",
    content: "Master the process of exporting organic ginger powder from India. This guide covers mandatory registrations (IEC, CRES), organic certification, essential documentation, and common pitfalls to ensure your business thrives in global markets.",
    author: "Amber Global Team",
    publishedDate: "2024-12-19",
    readTime: "7 min read",
    category: "Export Business",
    tags: ["export organic ginger powder India", "ginger powder export business", "organic certification NPOP", "IEC registration", "CRES registration", "ginger powder compliance", "export documentation"],
    seo: {
      metaTitle: "2025 Guide: How to Export Organic Ginger Powder from India—Compliance, Documentation, and Success | Amber Global",
      metaDescription: "Master the process of exporting organic ginger powder from India. This guide covers mandatory registrations (IEC, CRES), organic certification, essential documentation, and common pitfalls to ensure your business thrives in global markets.",
      keywords: ["export organic ginger powder India", "ginger powder export business", "organic certification NPOP", "IEC registration", "CRES registration", "ginger powder compliance", "export documentation"],
    },
    relatedBlogs: ["ginger-powder-sourcing-guide", "private-labeling-ginger-powder"]
  },
  {
    id: "private-labeling-ginger-powder",
    title: "Private Labeling Ginger Powder: Complete Guide to Building Your Brand",
    slug: "private-labeling-ginger-powder",
    excerpt: "Complete guide to private labeling ginger powder. Learn how to build your brand, source quality products, handle compliance, and scale your business with custom packaging and branding.",
    content: "Complete guide to private labeling ginger powder. Learn how to build your brand, source quality products, handle compliance, and scale your business with custom packaging and branding.",
    author: "Amber Global Team",
    publishedDate: "2024-12-19",
    readTime: "7 min read",
    category: "Private Labeling",
    tags: ["Private Labeling", "Ginger Powder", "Branding", "Packaging", "Business Development", "Spice Industry"],
    seo: {
      metaTitle: "Private Labeling Ginger Powder: Complete Guide to Building Your Brand | Amber Global",
      metaDescription: "Complete guide to private labeling ginger powder. Learn how to build your brand, source quality products, handle compliance, and scale your business with custom packaging and branding.",
      keywords: ["private labeling ginger powder", "ginger powder branding", "custom packaging", "ginger powder business", "private label spices", "ginger powder sourcing", "brand building"],
    },
    relatedBlogs: ["export-organic-ginger-powder", "ginger-powder-sourcing-guide"]
  }
];

export const getStaticBlogBySlug = (slug: string): StaticBlog | undefined => {
  return staticBlogs.find(blog => blog.slug === slug);
};

export const getStaticBlogsByCategory = (category: string): StaticBlog[] => {
  return staticBlogs.filter(blog => blog.category === category);
};

export const getRelatedStaticBlogs = (currentSlug: string, limit: number = 3): StaticBlog[] => {
  const currentBlog = getStaticBlogBySlug(currentSlug);
  if (!currentBlog) return [];
  
  const relatedSlugs = currentBlog.relatedBlogs || [];
  const relatedBlogs = relatedSlugs
    .map(slug => getStaticBlogBySlug(slug))
    .filter(Boolean) as StaticBlog[];
  
  return relatedBlogs.slice(0, limit);
};
