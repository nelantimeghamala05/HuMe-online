import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/CartDrawer";
import { ProductCard } from "@/components/ProductCard";
import { AIShoppingAssistant } from "@/components/AIShoppingAssistant";
import { SmartSearch } from "@/components/SmartSearch";
import { ProductUploadDialog } from "@/components/ProductUploadDialog";
import { DeliveryAddressDialog } from "@/components/DeliveryAddressDialog";
import { ProductFilters, type FilterOptions } from "@/components/ProductFilters";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";
import { Loader2, ShoppingBag, Heart, LogOut, LogIn, Info, Mail } from "lucide-react";
const Index = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ShopifyProduct[]>([]);
  const [displayProducts, setDisplayProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [maxPrice, setMaxPrice] = useState(1000);

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
        setDisplayProducts(data);
        
        // Calculate max price
        const prices = data.map(p => parseFloat(p.node.priceRange.minVariantPrice.amount));
        const max = Math.max(...prices, 1000);
        setMaxPrice(Math.ceil(max / 10) * 10);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleFilterChange = (filters: FilterOptions) => {
    let filtered = [...filteredProducts];
    
    // Apply price filter
    filtered = filtered.filter(product => {
      const price = parseFloat(product.node.priceRange.minVariantPrice.amount);
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });
    
    // Apply sorting
    filtered.sort((a, b) => {
      const priceA = parseFloat(a.node.priceRange.minVariantPrice.amount);
      const priceB = parseFloat(b.node.priceRange.minVariantPrice.amount);
      
      switch (filters.sortBy) {
        case "price-low":
          return priceA - priceB;
        case "price-high":
          return priceB - priceA;
        case "popular":
          // In real app, this would use actual popularity metrics
          return 0;
        case "newest":
        default:
          return 0;
      }
    });
    
    setDisplayProducts(filtered);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2">
                <ShoppingBag className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold">HuMe Store</h1>
              </Link>
              <nav className="hidden md:flex items-center gap-4">
                <Link to="/about">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Info className="h-4 w-4" />
                    About
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Mail className="h-4 w-4" />
                    Contact
                  </Button>
                </Link>
              </nav>
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
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-hero text-primary-foreground py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-artistic opacity-20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <p className="text-sm uppercase tracking-widest mb-4 opacity-90">Handmade Art & Creative Décor</p>
          <h2 className="text-6xl md:text-7xl font-bold mb-6 animate-fade-in">
            Where Art Meets Emotion
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
            Discover unique handmade artworks, digital prints, and creative home décor pieces crafted with passion by Husna & Meghana
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" variant="secondary" className="gap-2 shadow-artistic">
              <ShoppingBag className="h-5 w-5" />
              Shop Now
            </Button>
            <Link to="/about">
              <Button size="lg" variant="outline" className="gap-2 border-primary-foreground/30 hover:bg-primary-foreground/10">
                <Info className="h-5 w-5" />
                Our Story
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-16">
        {!loading && products.length > 0 && (
          <div className="mb-8 space-y-6">
            <SmartSearch products={products} onSearchResults={setFilteredProducts} />
            <ProductFilters onFilterChange={handleFilterChange} maxPrice={maxPrice} />
          </div>
        )}
        
        {loading ? <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div> : products.length === 0 ? <div className="text-center py-20">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No artworks yet</h3>
            <p className="text-muted-foreground mb-6">
              Your creative collection is waiting to be filled! Upload your first artwork to get started.
            </p>
            {user && <ProductUploadDialog />}
          </div> : <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">
                {displayProducts.length === products.length ? 'Featured Artworks' : `${displayProducts.length} Artworks`}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayProducts.map(product => <ProductCard key={product.node.id} product={product} />)}
            </div>
            {displayProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No artworks match your filters. Try adjusting your search.</p>
              </div>
            )}
          </>}
      </section>

      {/* AI Shopping Assistant */}
      {products.length > 0 && <AIShoppingAssistant products={products} />}

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground mt-20 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h3 className="font-bold text-lg mb-2">HuMe Store</h3>
              <p className="text-sm opacity-90">Where Art Meets Emotion</p>
            </div>
            <div className="flex gap-6">
              <Link to="/about" className="text-sm hover:underline opacity-90 hover:opacity-100">
                About Us
              </Link>
              <Link to="/contact" className="text-sm hover:underline opacity-90 hover:opacity-100">
                Contact
              </Link>
            </div>
          </div>
          <div className="text-center mt-8 pt-8 border-t border-primary-foreground/20">
            <p className="text-sm opacity-75">© 2025 HuMe Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;