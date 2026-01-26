import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type WishlistItem = {
  id: number;
  name: string;
  price: number;
  image: string;
};

export default function WishlistTab({ wishlist }: { wishlist: WishlistItem[] }) {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-2">찜한상품</h1>
      <p className="text-gray-600 mb-6">총 {wishlist.length}개 상품</p>

      <div className="space-y-4">
        {wishlist.map((item) => (
          <Card key={item.id} className="p-4 bg-gray-50">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-full sm:w-24 h-48 sm:h-24 object-cover rounded-lg"
              />
              <div className="flex-1 w-full">
                <h3 className="font-bold mb-1">{item.name}</h3>
                <p className="text-xl md:text-2xl font-bold text-blue-600">
                  {item.price.toLocaleString()}원
                </p>
              </div>
              <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                <Button className="whitespace-nowrap flex-1 sm:flex-none">장바구니</Button>
                <Button variant="outline" className="whitespace-nowrap flex-1 sm:flex-none">
                  삭제
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
