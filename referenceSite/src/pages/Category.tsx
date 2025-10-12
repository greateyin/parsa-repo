import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import { Button } from "@/components/ui/button";
import { mockArticles, categories } from "@/data/mockArticles";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Category = () => {
  const { slug } = useParams();
  const category = categories.find((c) => c.slug === slug);
  const categoryArticles = mockArticles.filter((a) => a.category === slug);

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">分類不存在</h1>
          <Button asChild>
            <Link to="/">返回首頁</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <Button variant="ghost" asChild className="mb-8 group">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            返回首頁
          </Link>
        </Button>

        <div className="mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            {category.description}
          </p>
        </div>

        {categoryArticles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryArticles.map((article, index) => (
              <div
                key={article.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold mb-2">暫無文章</h3>
            <p className="text-muted-foreground mb-6">
              此分類目前沒有文章
            </p>
            <Button asChild>
              <Link to="/">瀏覽所有文章</Link>
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Category;
