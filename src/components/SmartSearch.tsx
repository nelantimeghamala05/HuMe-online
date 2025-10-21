import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { ShopifyProduct } from "@/lib/shopify";
import { toast } from "sonner";

interface SmartSearchProps {
  products: ShopifyProduct[];
  onSearchResults: (results: ShopifyProduct[]) => void;
}

export const SmartSearch = ({ products, onSearchResults }: SmartSearchProps) => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isSearching) return;

    setIsSearching(true);

    try {
      const { data, error } = await supabase.functions.invoke("smart-search", {
        body: { query, products },
      });

      if (error) throw error;

      const matchedProducts = products.filter(p =>
        data.productIds?.includes(p.node.id)
      );

      onSearchResults(matchedProducts);
      
      if (matchedProducts.length === 0) {
        toast.info("No products found matching your search");
      } else {
        toast.success(`Found ${matchedProducts.length} products`);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    onSearchResults(products);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto mb-8">
      <div className="relative">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try: 'affordable products' or 'something for a gift'..."
          className="pr-24 pl-10"
        />
        <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
            >
              Clear
            </Button>
          )}
          <Button type="submit" size="sm" disabled={isSearching || !query.trim()}>
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        ✨ AI-powered natural language search
      </p>
    </form>
  );
};
