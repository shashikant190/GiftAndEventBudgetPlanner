import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gift } from 'lucide-react';

interface GiftSuggestionsProps {
  eventType: string;
}

const GIFT_SUGGESTIONS: Record<string, Array<{ item: string; budget: string; occasion: string }>> = {
  Wedding: [
    { item: 'Silver Coin Set', budget: '₹5,000 - ₹10,000', occasion: 'Traditional' },
    { item: 'Kitchen Appliances', budget: '₹10,000 - ₹25,000', occasion: 'Practical' },
    { item: 'Gold Jewelry', budget: '₹25,000+', occasion: 'Premium' },
    { item: 'Home Décor Items', budget: '₹3,000 - ₹8,000', occasion: 'Modern' },
    { item: 'Dinner Set', budget: '₹5,000 - ₹12,000', occasion: 'Classic' }
  ],
  Birthday: [
    { item: 'Personalized Photo Frame', budget: '₹500 - ₹1,500', occasion: 'Sentimental' },
    { item: 'Smartwatch', budget: '₹3,000 - ₹15,000', occasion: 'Tech' },
    { item: 'Gift Hamper', budget: '₹1,000 - ₹5,000', occasion: 'Classic' },
    { item: 'Books', budget: '₹500 - ₹2,000', occasion: 'Thoughtful' },
    { item: 'Perfume', budget: '₹2,000 - ₹8,000', occasion: 'Luxe' }
  ],
  Diwali: [
    { item: 'Dry Fruits & Sweets Box', budget: '₹1,000 - ₹3,000', occasion: 'Traditional' },
    { item: 'Decorative Diyas Set', budget: '₹500 - ₹2,000', occasion: 'Festive' },
    { item: 'Silver Pooja Items', budget: '₹3,000 - ₹10,000', occasion: 'Religious' },
    { item: 'Gift Vouchers', budget: '₹1,000 - ₹5,000', occasion: 'Modern' },
    { item: 'Home Décor', budget: '₹2,000 - ₹8,000', occasion: 'Elegant' }
  ],
  Holi: [
    { item: 'Organic Color Set', budget: '₹300 - ₹1,000', occasion: 'Eco-friendly' },
    { item: 'Sweets & Snacks', budget: '₹500 - ₹2,000', occasion: 'Traditional' },
    { item: 'Festive Attire', budget: '₹1,000 - ₹3,000', occasion: 'Fashionable' },
    { item: 'Gift Hamper', budget: '₹1,500 - ₹4,000', occasion: 'Deluxe' }
  ],
  Housewarming: [
    { item: 'Indoor Plants', budget: '₹500 - ₹2,000', occasion: 'Green' },
    { item: 'Wall Clock', budget: '₹1,000 - ₹3,000', occasion: 'Practical' },
    { item: 'Pooja Thali', budget: '₹2,000 - ₹5,000', occasion: 'Traditional' },
    { item: 'Kitchen Essentials', budget: '₹3,000 - ₹8,000', occasion: 'Useful' },
    { item: 'Decorative Items', budget: '₹2,000 - ₹6,000', occasion: 'Aesthetic' }
  ],
  Default: [
    { item: 'Gift Cards', budget: '₹1,000 - ₹5,000', occasion: 'Versatile' },
    { item: 'Chocolates & Flowers', budget: '₹500 - ₹2,000', occasion: 'Classic' },
    { item: 'Books', budget: '₹500 - ₹2,000', occasion: 'Thoughtful' },
    { item: 'Personalized Gifts', budget: '₹1,000 - ₹3,000', occasion: 'Special' },
    { item: 'Wellness Products', budget: '₹1,500 - ₹5,000', occasion: 'Care' }
  ]
};

export function GiftSuggestions({ eventType }: GiftSuggestionsProps) {
  const suggestions = GIFT_SUGGESTIONS[eventType] || GIFT_SUGGESTIONS.Default;

  return (
    <Card className="shadow-warm">
      <CardHeader>
        <CardTitle>Gift Suggestions</CardTitle>
        <CardDescription>
          Curated gift ideas for {eventType} celebrations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((suggestion, index) => (
            <Card key={index} className="border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Gift className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{suggestion.item}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {suggestion.budget}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {suggestion.occasion}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
