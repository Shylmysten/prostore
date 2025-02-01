'use client'

import { Check, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { createOrder } from "@/lib/actions/order.actions";

const PlaceOrderForm = () => {
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const response = await createOrder();

        if(response.redirectTo) {
            router.push(response.redirectTo);
        }
    }

    const PlaceOrderButton = () => {
        const { pending } = useFormStatus();
        return (
            <Button disabled={pending} type="submit" className="w-full">
                {pending ? (
                    <Loader className="w-4 h-4 animate-spin"/>
                ) : (
                    <Check className="w-4 h-4"/>
                )}{ ' '} Place Order
            </Button>
        )
    }

    return ( 
        <form className="w-full" onSubmit={handleSubmit}>
            <PlaceOrderButton/>
        </form> 
    );
}
 
export default PlaceOrderForm;