import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import { Button } from "@/components/ui/button";
import { mockArticles, categories } from "@/data/mockArticles";
import { TrendingUp, Sparkles } from "lucide-react";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const featuredArticles = mockArticles.filter((article) => article.featured);
  const regularArticles = mockArticles.filter((article) => !article.featured);

  const displayedArticles = selectedCategory
    ? regularArticles.filter((article) => article.category === selectedCategory)
    : regularArticles;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-background py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center space-x-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">探索科技前沿</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                TechNews
              </h1>
              <p className="text-xl text-muted-foreground">
                深入報導人工智慧、硬體創新、軟體開發與網路安全最新動態
              </p>
            </div>

            {/* Featured Articles */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {featuredArticles.slice(0, 2).map((article) => (
                <ArticleCard key={article.id} article={article} featured />
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold flex items-center">
              <TrendingUp className="h-8 w-8 mr-3 text-primary" />
              熱門分類
            </h2>
          </div>

          <div className="flex flex-wrap gap-3 mb-12">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className="rounded-full"
            >
              全部
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.slug ? "default" : "outline"
                }
                onClick={() => setSelectedCategory(category.slug)}
                className="rounded-full"
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Article Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedArticles.map((article, index) => (
              <div
                key={article.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ArticleCard article={article} />
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="rounded-full">
              載入更多文章
            </Button>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary to-accent py-16 mt-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              探索更多科技內容
            </h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              瀏覽我們的標籤雲，發現您感興趣的科技主題，或使用搜尋功能找到特定文章
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="rounded-full"
              >
                <Link to="/tags">瀏覽標籤雲</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="rounded-full bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                <Link to="/search">搜尋文章</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
