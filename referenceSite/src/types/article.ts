export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  readTime: number;
  category: string;
  tags: string[];
  image: string;
  featured?: boolean;
}

export interface ArticleCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
}
