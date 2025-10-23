import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { fetchProductByHandle, type ShopifyProduct } from "@/lib/shopify";
import { Loader2, Heart, ShoppingBag, ArrowLeft } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";

const Wishlist = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { wishlist } = useWishlist(user?.id);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    const loadWishlistProducts = async () => {
      if (wishlist.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const productPromises = wishlist.map((item) =>
          fetchProductByHandle(item.product_handle)
        );
        const loadedProducts = await Promise.all(productPromises);
        setProducts(loadedProducts.filter(Boolean));
      } catch (error) {
        console.error("Error loading wishlist products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadWishlistProducts();
    }
  }, [wishlist, user]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary fill-primary" />
              <h1 className="text-2xl font-bold">My Wishlist</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="container mx-auto px-4 py-16">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : wishlist.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground mb-6">
              Start adding products you love!
            </p>
            <Button onClick={() => navigate("/")} className="gap-2">
              <ShoppingBag className="h-5 w-5" />
              Browse Products
            </Button>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground mb-8">
              {wishlist.length} {wishlist.length === 1 ? "item" : "items"} in your wishlist
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.node.id} product={product} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Wishlist;
