import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";

export interface FilterOptions {
  priceRange: [number, number];
  sortBy: "newest" | "price-low" | "price-high" | "popular";
}

interface ProductFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  maxPrice: number;
}

export const ProductFilters = ({ onFilterChange, maxPrice }: ProductFiltersProps) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);
  const [sortBy, setSortBy] = useState<FilterOptions["sortBy"]>("newest");

  const handleApplyFilters = () => {
    onFilterChange({ priceRange, sortBy });
  };

  const handleSortChange = (value: FilterOptions["sortBy"]) => {
    setSortBy(value);
    onFilterChange({ priceRange, sortBy: value });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      {/* Sort Dropdown */}
      <div className="flex items-center gap-2 flex-1">
        <Label htmlFor="sort" className="whitespace-nowrap">Sort by:</Label>
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger id="sort" className="w-full sm:w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filter Button */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filter Products</SheetTitle>
            <SheetDescription>
              Refine your search by price range
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            {/* Price Range */}
            <div className="space-y-4">
              <Label>Price Range</Label>
              <div className="pt-2">
                <Slider
                  min={0}
                  max={maxPrice}
                  step={10}
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>${priceRange[0].toFixed(0)}</span>
                <span>${priceRange[1].toFixed(0)}</span>
              </div>
            </div>

            <Button onClick={handleApplyFilters} className="w-full">
              Apply Filters
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
