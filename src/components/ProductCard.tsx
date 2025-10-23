import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart, Heart } from "lucide-react";
import type { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { useWishlist } from "@/hooks/useWishlist";
import { toast } from "sonner";

interface ProductCardProps {
  product: ShopifyProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore(state => state.addItem);
  const [user, setUser] = useState<any>(null);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist(user?.id);
  const { node } = product;

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error("Please sign in to use wishlist");
      return;
    }

    const inWishlist = isInWishlist(node.id);
    
    if (inWishlist) {
      await removeFromWishlist(node.id);
    } else {
      await addToWishlist(node.id, node.handle);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const firstVariant = node.variants.edges[0]?.node;
    if (!firstVariant) return;

    const cartItem = {
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions || []
    };
    
    addItem(cartItem);
    toast.success('Added to cart!', {
      position: 'top-center',
    });
  };

  const price = parseFloat(node.priceRange.minVariantPrice.amount);
  const imageUrl = node.images.edges[0]?.node.url;
  const inWishlist = isInWishlist(node.id);

  return (
    <Link to={`/product/${node.handle}`}>
      <Card className="group overflow-hidden hover:shadow-hover transition-all duration-300 h-full">
        <CardContent className="p-0 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 bg-background/80 hover:bg-background"
            onClick={handleWishlistToggle}
          >
            <Heart
              className={`h-5 w-5 ${inWishlist ? "fill-primary text-primary" : ""}`}
            />
          </Button>
          <div className="aspect-square overflow-hidden bg-muted">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={node.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-muted-foreground">No image</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-3 p-4">
          <div className="w-full">
            <h3 className="font-semibold text-lg line-clamp-1">{node.title}</h3>
            <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
              {node.description}
            </p>
          </div>
          <div className="flex items-center justify-between w-full">
            <span className="text-xl font-bold">
              ${price.toFixed(2)}
            </span>
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
