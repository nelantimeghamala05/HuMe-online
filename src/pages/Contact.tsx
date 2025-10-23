import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ShoppingBag, Mail, MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send to a backend
    toast.success("Message sent! We'll get back to you soon.", {
      position: "top-center",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
          <h2 className="text-5xl font-bold mb-6">Get in Touch</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We'd love to hear from you. Whether you have questions, collaboration ideas, or just want to say hello!
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Form */}
          <div className="bg-card p-8 rounded-lg shadow-soft">
            <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What's this about?"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more..."
                  rows={5}
                  required
                />
              </div>

              <Button type="submit" className="w-full gap-2">
                <Send className="h-4 w-4" />
                Send Message
              </Button>
            </form>
          </div>

          {/* Info Cards */}
          <div className="space-y-6">
            <div className="bg-gradient-card p-8 rounded-lg shadow-soft">
              <Mail className="h-12 w-12 text-primary mb-4" />
              <h4 className="text-xl font-semibold mb-3">Email Us</h4>
              <p className="text-muted-foreground mb-4">
                Have a question? Drop us an email and we'll respond within 24 hours.
              </p>
              <a 
                href="mailto:hello@humestore.com" 
                className="text-primary hover:underline font-medium"
              >
                hello@humestore.com
              </a>
            </div>

            <div className="bg-gradient-card p-8 rounded-lg shadow-soft">
              <MessageSquare className="h-12 w-12 text-accent mb-4" />
              <h4 className="text-xl font-semibold mb-3">Collaborations</h4>
              <p className="text-muted-foreground mb-4">
                Interested in working together? We're always open to creative partnerships and commissions.
              </p>
              <a 
                href="mailto:collaborate@humestore.com" 
                className="text-primary hover:underline font-medium"
              >
                collaborate@humestore.com
              </a>
            </div>

            <div className="bg-gradient-card p-8 rounded-lg shadow-soft">
              <ShoppingBag className="h-12 w-12 text-primary mb-4" />
              <h4 className="text-xl font-semibold mb-3">Order Support</h4>
              <p className="text-muted-foreground">
                Need help with your order? Check our shipping & returns policy or contact our support team.
              </p>
            </div>
          </div>
        </div>
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

export default Contact;
