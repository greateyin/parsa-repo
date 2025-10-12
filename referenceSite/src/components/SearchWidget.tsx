import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const SearchWidget = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Search className="h-5 w-5 mr-2 text-primary" />
        搜尋文章
      </h3>
      <form onSubmit={handleSearch} className="space-y-3">
        <Input
          type="text"
          placeholder="輸入關鍵字..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
        <Button type="submit" className="w-full">
          <Search className="h-4 w-4 mr-2" />
          搜尋
        </Button>
      </form>
    </div>
  );
};

export default SearchWidget;
