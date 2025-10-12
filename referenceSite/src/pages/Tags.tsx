import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { mockArticles, allTags } from "@/data/mockArticles";
import { Search, Tag as TagIcon } from "lucide-react";

const Tags = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate tag frequencies
  const tagFrequency = mockArticles.reduce((acc, article) => {
    article.tags.forEach((tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  // Filter tags based on search
  const filteredTags = allTags.filter((tag) =>
    tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get max frequency for scaling
  const maxFrequency = Math.max(...Object.values(tagFrequency));

  // Calculate font size based on frequency
  const getFontSize = (tag: string) => {
    const frequency = tagFrequency[tag] || 1;
    const scale = frequency / maxFrequency;
    const minSize = 0.875; // text-sm
    const maxSize = 2.5; // text-4xl
    return minSize + scale * (maxSize - minSize);
  };

  // Calculate opacity based on frequency
  const getOpacity = (tag: string) => {
    const frequency = tagFrequency[tag] || 1;
    const scale = frequency / maxFrequency;
    return 0.6 + scale * 0.4;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6">
              <TagIcon className="h-4 w-4" />
              <span className="text-sm font-medium">探索主題</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">標籤雲</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              探索我們報導的各種科技主題，點擊標籤查看相關文章
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-12 animate-scale-in">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="搜尋標籤..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-full"
            />
          </div>

          {/* Tag Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 animate-fade-in">
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {allTags.length}
              </div>
              <div className="text-sm text-muted-foreground">總標籤數</div>
            </div>
            <div className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-accent mb-2">
                {mockArticles.length}
              </div>
              <div className="text-sm text-muted-foreground">文章總數</div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {Math.max(...Object.values(tagFrequency))}
              </div>
              <div className="text-sm text-muted-foreground">最熱門標籤</div>
            </div>
            <div className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-accent mb-2">
                {filteredTags.length}
              </div>
              <div className="text-sm text-muted-foreground">搜尋結果</div>
            </div>
          </div>

          {/* Tag Cloud */}
          <div className="bg-muted/30 rounded-2xl p-8 md:p-12 min-h-[400px] flex flex-wrap justify-center items-center gap-4 animate-scale-in">
            {filteredTags.length > 0 ? (
              filteredTags.map((tag) => (
                <Link
                  key={tag}
                  to={`/search?tag=${encodeURIComponent(tag)}`}
                  className="group"
                >
                  <Badge
                    variant="secondary"
                    className="transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer"
                    style={{
                      fontSize: `${getFontSize(tag)}rem`,
                      opacity: getOpacity(tag),
                      padding: "0.5rem 1rem",
                    }}
                  >
                    <span className="group-hover:text-primary transition-colors">
                      #{tag}
                    </span>
                    <span className="ml-2 text-xs opacity-60">
                      ({tagFrequency[tag]})
                    </span>
                  </Badge>
                </Link>
              ))
            ) : (
              <div className="text-center py-12">
                <TagIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">找不到相關標籤</h3>
                <p className="text-muted-foreground">
                  試試搜尋其他關鍵字
                </p>
              </div>
            )}
          </div>

          {/* Popular Tags List */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">熱門標籤</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(tagFrequency)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 6)
                .map(([tag, count]) => (
                  <Link
                    key={tag}
                    to={`/search?tag=${encodeURIComponent(tag)}`}
                    className="group"
                  >
                    <div className="bg-card border border-border rounded-xl p-4 hover:shadow-lg hover:border-primary transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-lg group-hover:text-primary transition-colors">
                            #{tag}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {count} 篇文章
                          </div>
                        </div>
                        <TagIcon className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Tags;
