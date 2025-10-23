import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { MapPin, Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface DeliveryAddress {
  id: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

interface DeliveryAddressDialogProps {
  userId: string | undefined;
}

export const DeliveryAddressDialog = ({ userId }: DeliveryAddressDialogProps) => {
  const [open, setOpen] = useState(false);
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "US",
    is_default: false,
  });

  useEffect(() => {
    if (open && userId) {
      loadAddresses();
    }
  }, [open, userId]);

  const loadAddresses = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from("delivery_addresses")
      .select("*")
      .eq("user_id", userId)
      .order("is_default", { ascending: false });

    if (error) {
      console.error("Error loading addresses:", error);
    } else {
      setAddresses(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      toast.error("Please sign in to add addresses");
      return;
    }

    setLoading(true);

    // If setting as default, update other addresses
    if (formData.is_default) {
      await supabase
        .from("delivery_addresses")
        .update({ is_default: false })
        .eq("user_id", userId);
    }

    const { error } = await supabase.from("delivery_addresses").insert({
      ...formData,
      user_id: userId,
    });

    setLoading(false);

    if (error) {
      toast.error("Failed to add address");
    } else {
      toast.success("Address added successfully");
      setFormData({
        full_name: "",
        phone: "",
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "US",
        is_default: false,
      });
      loadAddresses();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("delivery_addresses")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete address");
    } else {
      toast.success("Address deleted");
      loadAddresses();
    }
  };

  const setAsDefault = async (id: string) => {
    if (!userId) return;

    // Update all addresses to not default
    await supabase
      .from("delivery_addresses")
      .update({ is_default: false })
      .eq("user_id", userId);

    // Set selected as default
    const { error } = await supabase
      .from("delivery_addresses")
      .update({ is_default: true })
      .eq("id", id);

    if (error) {
      toast.error("Failed to set default address");
    } else {
      toast.success("Default address updated");
      loadAddresses();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <MapPin className="h-4 w-4" />
          Delivery Addresses
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Delivery Addresses</DialogTitle>
          <DialogDescription>
            Manage your delivery addresses
          </DialogDescription>
        </DialogHeader>

        {/* Existing Addresses */}
        {addresses.length > 0 && (
          <div className="space-y-3 mb-6">
            <h3 className="font-semibold">Saved Addresses</h3>
            {addresses.map((address) => (
              <Card key={address.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-semibold">{address.full_name}</p>
                        {address.is_default && (
                          <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{address.phone}</p>
                      <p className="text-sm text-muted-foreground">
                        {address.address_line1}
                        {address.address_line2 && `, ${address.address_line2}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {address.city}, {address.state} {address.postal_code}
                      </p>
                      <p className="text-sm text-muted-foreground">{address.country}</p>
                    </div>
                    <div className="flex gap-2">
                      {!address.is_default && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAsDefault(address.id)}
                        >
                          Set Default
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(address.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add New Address Form */}
        <div className="border-t pt-6">
          <h3 className="font-semibold mb-4">Add New Address</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name*</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone*</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address_line1">Address Line 1*</Label>
              <Input
                id="address_line1"
                value={formData.address_line1}
                onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address_line2">Address Line 2</Label>
              <Input
                id="address_line2"
                value={formData.address_line2}
                onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City*</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State*</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal_code">Postal Code*</Label>
                <Input
                  id="postal_code"
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_default"
                checked={formData.is_default}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_default: checked as boolean })
                }
              />
              <Label htmlFor="is_default" className="cursor-pointer">
                Set as default address
              </Label>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              {loading ? "Adding..." : "Add Address"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
