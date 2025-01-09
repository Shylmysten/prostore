'use client'
import { Cart, CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";

const AddToCard = ({ cart, item }: { cart?: Cart; item: CartItem }) => {
    const router = useRouter();
    const { toast } = useToast();

    const handleAddToCart = async () => {
        const response = await addItemToCart(item);

        if(!response?.success) {
            toast({
                variant: 'destructive',
                description: response?.message,
            })
            return;
        }

        // handle success add to cart
        toast({
            description: response?.message,
            action: (
                <ToastAction className="bg-primary text-white hover:bg-gray-800" altText="Go To Cart" onClick={ () => router.push('/cart') }>
                    Go To Cart
                </ToastAction>
            )
        })
    }

    const handleRemoveFromCart = async () => {
        const response = await removeItemFromCart(item.productId);

        toast({
            variant: response?.success ? 'default' : 'destructive',
            description: response?.message,
        })
    }

    // Check if item is in cart
    const itemExists = cart && cart.items.find((x) => x.productId === item.productId);

    return (
        itemExists ? (
            <div>
                <Button type='button' variant='outline' onClick={handleRemoveFromCart}>
                    <Minus className="h-4 w-4" />
                </Button>
                <span className="px-2">{itemExists.qty}</span>
                <Button type='button' variant='outline' onClick={handleAddToCart}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
        ) : (
            <Button className="w-full" type="button" onClick={handleAddToCart}>
                <Plus /> Add To Cart
            </Button>
        )
    );
}
 
export default AddToCard;