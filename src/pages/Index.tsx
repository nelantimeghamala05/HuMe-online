import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/CartDrawer";
import { ProductCard } from "@/components/ProductCard";
import { AIShoppingAssistant } from "@/components/AIShoppingAssistant";
import { SmartSearch } from "@/components/SmartSearch";
import { ProductUploadDialog } from "@/components/ProductUploadDialog";
import { DeliveryAddressDialog } from "@/components/DeliveryAddressDialog";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";
import { Loader2, ShoppingBag, Heart, LogOut, LogIn } from "lucide-react";
const Index = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

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
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts(20);
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">HuME</h1>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <ProductUploadDialog />
                <DeliveryAddressDialog userId={user.id} />
                <Button variant="outline" size="icon" onClick={() => navigate("/wishlist")}>
                  <Heart className="h-5 w-5" />
                </Button>
                <CartDrawer />
                <Button variant="ghost" size="icon" onClick={handleSignOut}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <>
                <CartDrawer />
                <Button variant="outline" onClick={() => navigate("/auth")}>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-hero text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6 animate-fade-in">
            Discover Amazing Products
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Shop the latest collection of premium products curated just for you
          </p>
          <Button size="lg" variant="secondary" className="gap-2">
            <ShoppingBag className="h-5 w-5" />
            Start Shopping
          </Button>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-16">
        {!loading && products.length > 0 && <SmartSearch products={products} onSearchResults={setFilteredProducts} />}
        
        {loading ? <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div> : products.length === 0 ? <div className="text-center py-20">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-6">
              Start by creating your first product! Tell me what you'd like to add to your store.
            </p>
          </div> : <>
            <h2 className="text-3xl font-bold mb-8">
              {filteredProducts.length === products.length ? 'Featured Products' : 'Search Results'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => <ProductCard key={product.node.id} product={product} />)}
            </div>
          </>}
      </section>

      {/* AI Shopping Assistant */}
      {products.length > 0 && <AIShoppingAssistant products={products} />}

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground mt-20 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2025 HuMe. All rights reserved.</p>
        </div>
      </footer>
    </div>;
};
export default Index;