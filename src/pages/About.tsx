import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Heart, Palette, Sparkles } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">HuMe Store</h1>
          </Link>
          <Link to="/">
            <Button variant="outline">Back to Store</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-artistic py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6">About HuMe Store</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Where Art Meets Emotion
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-6">Our Story</h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                HuMe Store was born from the creative partnership of <strong className="text-foreground">Husna</strong> and <strong className="text-foreground">Meghana</strong>, 
                two artists who share a deep passion for bringing emotion and beauty into everyday spaces.
              </p>
              <p>
                What started as a shared love for creating art has blossomed into a curated collection of 
                handmade artworks, digital prints, and creative home décor that tells a story in every piece.
              </p>
              <p>
                Each item in our store is carefully crafted or selected to inspire, comfort, and add a touch 
                of artistic warmth to your life. We believe that art isn't just something to look at—it's 
                something to feel, experience, and live with every day.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-card p-6 rounded-lg shadow-soft">
              <Palette className="h-12 w-12 text-primary mb-4" />
              <h4 className="font-semibold mb-2">Handcrafted</h4>
              <p className="text-sm text-muted-foreground">Every piece is made with love and attention to detail</p>
            </div>
            <div className="bg-gradient-card p-6 rounded-lg shadow-soft">
              <Heart className="h-12 w-12 text-accent mb-4" />
              <h4 className="font-semibold mb-2">With Passion</h4>
              <p className="text-sm text-muted-foreground">Art that comes from the heart, for your heart</p>
            </div>
            <div className="bg-gradient-card p-6 rounded-lg shadow-soft">
              <Sparkles className="h-12 w-12 text-primary mb-4" />
              <h4 className="font-semibold mb-2">Unique</h4>
              <p className="text-sm text-muted-foreground">One-of-a-kind pieces you won't find anywhere else</p>
            </div>
            <div className="bg-gradient-card p-6 rounded-lg shadow-soft">
              <ShoppingBag className="h-12 w-12 text-accent mb-4" />
              <h4 className="font-semibold mb-2">For You</h4>
              <p className="text-sm text-muted-foreground">Curated with care for art lovers like you</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-12">What We Believe In</h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div>
              <h4 className="text-xl font-semibold mb-3">Authenticity</h4>
              <p className="text-muted-foreground">
                Every piece is genuinely handmade or carefully curated, never mass-produced.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-3">Connection</h4>
              <p className="text-muted-foreground">
                Art that creates emotional connections and brings joy to your space.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-3">Community</h4>
              <p className="text-muted-foreground">
                Supporting artists and art lovers in a shared creative journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h3 className="text-3xl font-bold mb-6">Ready to Discover Art?</h3>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Explore our collection and find the perfect piece that speaks to your soul.
        </p>
        <Link to="/">
          <Button size="lg" className="gap-2">
            <ShoppingBag className="h-5 w-5" />
            Browse Collection
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2025 HuMe Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
