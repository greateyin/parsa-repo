import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import SearchWidget from "@/components/SearchWidget";
import TagCloudWidget from "@/components/TagCloudWidget";
import RelatedArticlesWidget from "@/components/RelatedArticlesWidget";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockArticles } from "@/data/mockArticles";
import {
  Clock,
  User,
  Calendar,
  Share2,
  ArrowLeft,
  BookmarkPlus,
} from "lucide-react";
import { toast } from "sonner";

const Article = () => {
  const { id } = useParams();
  const article = mockArticles.find((a) => a.id === id);

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">文章不存在</h1>
          <Button asChild>
            <Link to="/">返回首頁</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const relatedArticles = mockArticles
    .filter(
      (a) =>
        a.id !== article.id &&
        (a.category === article.category ||
          a.tags.some((tag) => article.tags.includes(tag)))
    )
    .slice(0, 3);

  const formattedDate = new Date(article.publishedAt).toLocaleDateString(
    "zh-TW",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("文章連結已複製到剪貼簿");
  };

  const handleBookmark = () => {
    toast.success("文章已加入書籤");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Back Button */}
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" asChild className="group">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              返回首頁
            </Link>
          </Button>
        </div>

        {/* Two Column Layout */}
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_320px] gap-8">
            {/* Main Content */}
            <article className="min-w-0">
              <div className="mb-8">
                <Badge className="mb-4">{article.category.toUpperCase()}</Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight animate-fade-in">
                  {article.title}
                </h1>

            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
              <span className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                {article.author}
              </span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {formattedDate}
              </span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {article.readTime} 分鐘閱讀
              </span>
            </div>

            <div className="flex gap-2 mb-8">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="group"
              >
                <Share2 className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                分享
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBookmark}
                className="group"
              >
                <BookmarkPlus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                收藏
              </Button>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative h-[400px] rounded-2xl overflow-hidden mb-12 animate-scale-in">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none mb-12 animate-fade-in">
            <div className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {article.excerpt}
            </div>
            <div
              className="leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: article.content
                  .split("\n")
                  .map((line) => {
                    if (line.startsWith("# ")) {
                      return `<h1 class="text-3xl font-bold mt-8 mb-4">${line.slice(2)}</h1>`;
                    } else if (line.startsWith("## ")) {
                      return `<h2 class="text-2xl font-bold mt-6 mb-3">${line.slice(3)}</h2>`;
                    } else if (line.startsWith("- ")) {
                      return `<li class="ml-4">${line.slice(2)}</li>`;
                    } else if (line.trim() === "") {
                      return "<br />";
                    }
                    return `<p class="mb-4">${line}</p>`;
                  })
                  .join(""),
              }}
            />
          </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-12">
                {article.tags.map((tag) => (
                  <Link key={tag} to={`/search?tag=${encodeURIComponent(tag)}`}>
                    <Badge
                      variant="secondary"
                      className="hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                    >
                      #{tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="sticky top-4 space-y-6">
                <SearchWidget />
                <RelatedArticlesWidget articles={relatedArticles} />
                <TagCloudWidget />
              </div>
            </aside>
          </div>
        </div>

        {/* More Related Articles */}
        {relatedArticles.length > 3 && (
          <section className="bg-muted/30 py-16 mt-20">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-8">更多相關文章</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedArticles.slice(3, 6).map((relatedArticle) => (
                  <ArticleCard
                    key={relatedArticle.id}
                    article={relatedArticle}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Article;
