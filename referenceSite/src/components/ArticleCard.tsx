import { Link } from "react-router-dom";
import { Clock, User, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Article } from "@/types/article";

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

const ArticleCard = ({ article, featured = false }: ArticleCardProps) => {
  const formattedDate = new Date(article.publishedAt).toLocaleDateString(
    "zh-TW",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  if (featured) {
    return (
      <Link to={`/article/${article.id}`}>
        <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 animate-scale-in">
          <div className="relative h-[400px] overflow-hidden">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <Badge className="mb-3 bg-accent text-accent-foreground">
                {article.category.toUpperCase()}
              </Badge>
              <h2 className="text-3xl font-bold text-white mb-3 group-hover:text-accent transition-colors">
                {article.title}
              </h2>
              <p className="text-gray-200 mb-4 line-clamp-2">
                {article.excerpt}
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-300">
                <span className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {article.author}
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {article.readTime} min read
                </span>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link to={`/article/${article.id}`}>
      <Card className="group h-full overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="relative h-48 overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <Badge className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm">
            {article.category.toUpperCase()}
          </Badge>
        </div>
        <CardContent className="p-5">
          <h3 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-3">
              <span className="flex items-center">
                <User className="h-3 w-3 mr-1" />
                {article.author}
              </span>
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {article.readTime} min
              </span>
            </div>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ArticleCard;
