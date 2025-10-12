import { Link } from "react-router-dom";
import { Article } from "@/types/article";
import { Clock, TrendingUp } from "lucide-react";

interface RelatedArticlesWidgetProps {
  articles: Article[];
}

const RelatedArticlesWidget = ({ articles }: RelatedArticlesWidgetProps) => {
  if (articles.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <TrendingUp className="h-5 w-5 mr-2 text-primary" />
        相關文章
      </h3>
      <div className="space-y-4">
        {articles.map((article) => (
          <Link
            key={article.id}
            to={`/article/${article.id}`}
            className="group block"
          >
            <div className="flex gap-3">
              <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                  {article.title}
                </h4>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  {article.readTime} 分鐘
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedArticlesWidget;
