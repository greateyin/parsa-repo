import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/30 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent" />
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                TechNews
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              探索科技世界的最新動態，深入報導人工智慧、硬體創新、軟體開發等領域。
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">分類</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/category/ai"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  人工智慧
                </Link>
              </li>
              <li>
                <Link
                  to="/category/hardware"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  硬體科技
                </Link>
              </li>
              <li>
                <Link
                  to="/category/software"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  軟體開發
                </Link>
              </li>
              <li>
                <Link
                  to="/category/security"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  網路安全
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">資源</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/tags"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  標籤雲
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  搜尋文章
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">關注我們</h3>
            <div className="flex space-x-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-md bg-muted hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-md bg-muted hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-md bg-muted hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:contact@technews.com"
                className="p-2 rounded-md bg-muted hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} TechNews. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
