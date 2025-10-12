import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { mockArticles, allTags } from "@/data/mockArticles";
import { Tag as TagIcon } from "lucide-react";

const TagCloudWidget = () => {
  // Calculate tag frequencies
  const tagFrequency = mockArticles.reduce((acc, article) => {
    article.tags.forEach((tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  // Get max frequency for scaling
  const maxFrequency = Math.max(...Object.values(tagFrequency));

  // Show top 15 tags
  const topTags = allTags
    .sort((a, b) => (tagFrequency[b] || 0) - (tagFrequency[a] || 0))
    .slice(0, 15);

  // Calculate font size based on frequency
  const getFontSize = (tag: string) => {
    const frequency = tagFrequency[tag] || 1;
    const scale = frequency / maxFrequency;
    const minSize = 0.75; // smaller for widget
    const maxSize = 1.25; // smaller for widget
    return minSize + scale * (maxSize - minSize);
  };

  // Calculate opacity based on frequency
  const getOpacity = (tag: string) => {
    const frequency = tagFrequency[tag] || 1;
    const scale = frequency / maxFrequency;
    return 0.6 + scale * 0.4;
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <TagIcon className="h-5 w-5 mr-2 text-primary" />
        熱門標籤
      </h3>
      <div className="flex flex-wrap gap-2">
        {topTags.map((tag) => (
          <Link
            key={tag}
            to={`/search?tag=${encodeURIComponent(tag)}`}
            className="group"
          >
            <Badge
              variant="secondary"
              className="transition-all duration-300 hover:scale-110 hover:shadow-md cursor-pointer"
              style={{
                fontSize: `${getFontSize(tag)}rem`,
                opacity: getOpacity(tag),
              }}
            >
              <span className="group-hover:text-primary transition-colors">
                #{tag}
              </span>
            </Badge>
          </Link>
        ))}
      </div>
      <Link
        to="/tags"
        className="block mt-4 text-sm text-primary hover:underline text-center"
      >
        查看所有標籤 →
      </Link>
    </div>
  );
};

export default TagCloudWidget;
