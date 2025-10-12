import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockArticles, categories, allTags } from "@/data/mockArticles";
import { Search as SearchIcon, Filter, X } from "lucide-react";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTag = searchParams.get("tag") || "";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>(initialTag);
  const [sortBy, setSortBy] = useState<string>("date");

  const filteredArticles = useMemo(() => {
    let filtered = [...mockArticles];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.excerpt.toLowerCase().includes(query) ||
          article.content.toLowerCase().includes(query) ||
          article.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (article) => article.category === selectedCategory
      );
    }

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter((article) =>
        article.tags.includes(selectedTag)
      );
    }

    // Sort
    if (sortBy === "date") {
      filtered.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() -
          new Date(a.publishedAt).getTime()
      );
    } else if (sortBy === "title") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    return filtered;
  }, [searchQuery, selectedCategory, selectedTag, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedTag("");
    setSortBy("date");
    setSearchParams({});
  };

  const hasActiveFilters =
    searchQuery || selectedCategory !== "all" || selectedTag;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 animate-fade-in">搜尋文章</h1>

          {/* Search Bar */}
          <div className="relative mb-8 animate-fade-in">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="搜尋文章標題、內容或標籤..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg rounded-full"
            />
          </div>

          {/* Filters */}
          <div className="bg-muted/30 rounded-2xl p-6 mb-8 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                篩選條件
              </h2>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4 mr-2" />
                  清除篩選
                </Button>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">分類</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部分類</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.slug}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">標籤</label>
                <Select value={selectedTag} onValueChange={setSelectedTag}>
                  <SelectTrigger>
                    <SelectValue placeholder="選擇標籤" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">所有標籤</SelectItem>
                    {allTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">排序</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">最新發布</SelectItem>
                    <SelectItem value="title">標題 A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                {searchQuery && (
                  <Badge variant="secondary">搜尋: {searchQuery}</Badge>
                )}
                {selectedCategory !== "all" && (
                  <Badge variant="secondary">
                    分類:{" "}
                    {categories.find((c) => c.slug === selectedCategory)?.name}
                  </Badge>
                )}
                {selectedTag && (
                  <Badge variant="secondary">標籤: {selectedTag}</Badge>
                )}
              </div>
            )}
          </div>

          {/* Results */}
          <div className="mb-6 text-muted-foreground">
            找到 <span className="font-semibold text-foreground">{filteredArticles.length}</span> 篇文章
          </div>

          {filteredArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article, index) => (
                <div
                  key={article.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <SearchIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-2xl font-semibold mb-2">找不到相關文章</h3>
              <p className="text-muted-foreground mb-6">
                試試調整搜尋條件或清除篩選
              </p>
              <Button onClick={clearFilters}>清除所有篩選</Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Search;
