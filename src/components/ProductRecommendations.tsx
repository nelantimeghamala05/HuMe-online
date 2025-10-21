import { useEffect, useState } from "react";
import { ProductCard } from "./ProductCard";
import { supabase } from "@/integrations/supabase/client";
import type { ShopifyProduct } from "@/lib/shopify";
import { Loader2, Sparkles } from "lucide-react";

interface ProductRecommendationsProps {
  currentProduct: any;
  allProducts: ShopifyProduct[];
}

export const ProductRecommendations = ({
  currentProduct,
  allProducts,
}: ProductRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("product-recommendations", {
          body: {
            currentProduct,
            allProducts,
          },
        });

        if (error) throw error;

        const recommendedProducts = allProducts.filter((p) =>
          data.productIds?.includes(p.node.id)
        );

        setRecommendations(recommendedProducts.slice(0, 4));
      } catch (error) {
        console.error("Error loading recommendations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentProduct && allProducts.length > 0) {
      loadRecommendations();
    }
  }, [currentProduct, allProducts]);

  if (isLoading) {
    return (
      <div className="my-16">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">You Might Also Like</h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="my-16">
      <div className="flex items-center justify-center gap-2 mb-8">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold">AI Recommended Products</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((product) => (
          <ProductCard key={product.node.id} product={product} />
        ))}
      </div>
    </div>
  );
};
