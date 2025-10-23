import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface WishlistItem {
  id: string;
  product_id: string;
  product_handle: string;
}

export const useWishlist = (userId: string | undefined) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadWishlist();
    } else {
      setWishlist([]);
      setLoading(false);
    }
  }, [userId]);

  const loadWishlist = async () => {
    if (!userId) return;
    
    const { data, error } = await supabase
      .from("wishlists")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error loading wishlist:", error);
    } else {
      setWishlist(data || []);
    }
    setLoading(false);
  };

  const addToWishlist = async (productId: string, productHandle: string) => {
    if (!userId) {
      toast.error("Please sign in to add items to your wishlist");
      return false;
    }

    const { error } = await supabase.from("wishlists").insert({
      user_id: userId,
      product_id: productId,
      product_handle: productHandle,
    });

    if (error) {
      toast.error("Failed to add to wishlist");
      return false;
    }

    toast.success("Added to wishlist");
    loadWishlist();
    return true;
  };

  const removeFromWishlist = async (productId: string) => {
    if (!userId) return false;

    const { error } = await supabase
      .from("wishlists")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", productId);

    if (error) {
      toast.error("Failed to remove from wishlist");
      return false;
    }

    toast.success("Removed from wishlist");
    loadWishlist();
    return true;
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.product_id === productId);
  };

  return {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };
};
