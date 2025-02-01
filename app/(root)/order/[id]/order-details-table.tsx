'use client';

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Order } from "@/types";
import Image from "next/image";
import Link from "next/link";

const OrderDetailsTable = ({ order }: {order: Order}) => {
    const {
        id,
        shippingAddress,
        orderitems,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        paymentMethod,
        isDelivered,
        isPaid,
        paidAt,
        deliveredAt
    } = order;


    return ( 
        <>
            <h1 className="py-4 text-2xl">Order { formatId(id)}</h1>
            <div className="grid md:grid-cols-3 gap-5">
                <div className="col-span-2 space-4-y overflow-x-auto">
                    <Card>
                        <CardContent className="p-4 gap-4">
                            <h2 className="text-xl pb-4">Payment Method</h2>
                            <p className="mb-2">{paymentMethod}</p>
                            { isPaid ? (
                                <Badge variant='secondary'>
                                    Paid at { formatDateTime(paidAt!).dateTime}
                                </Badge>
                            ) : (
                                <Badge variant='destructive'>Not Paid</Badge>
                            )}
                        </CardContent>
                    </Card>
                    <Card className="my-2">
                        <CardContent className="p-4 gap-4">
                            <h2 className="text-xl pb-4">Shipping Address</h2>
                            <p>{shippingAddress.fullName}</p>
                            <p className="mb-2">
                                { shippingAddress.streetAddress}, { shippingAddress.city }{' '}
                                { shippingAddress.postalCode}, { shippingAddress.country }
                            </p>
                            { isPaid ? (
                                <Badge variant='secondary'>
                                    Delivered on { formatDateTime(deliveredAt!).dateTime}
                                </Badge>
                            ) : (
                                <Badge variant='destructive'>
                                    Not Delivered
                                </Badge>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 gap-4">
                            <h2 className="text-xl pb-4">Order Items</h2>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Item</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Price</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orderitems.map((item) => (
                                        <TableRow key={item.productId}>
                                            <TableCell>
                                            <Link href={`/product/{item.slug}`} className="flex items-center">
                                                <Image src={item.image} width={50} height={50} alt={item.name} />
                                                <span className="px-2">{ item.name }</span>
                                            </Link>
                                            </TableCell>
                                            <TableCell><span className="px-2">{ item.qty }</span></TableCell>
                                            <TableCell className="text-right">${ item.price }</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card>
                        <CardContent className="p-4 gap-4 space-y-4">
                            <h2 className="text-xl pb-4">Order Summary</h2>
                            <div className="flex justify-between">
                                <span>Items</span>
                                <span>{formatCurrency(itemsPrice)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span>{formatCurrency(taxPrice)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>{formatCurrency(shippingPrice)}</span>
                            </div>
        
                            <div className="flex justify-between">
                                <span>Total</span>
                                <span>{formatCurrency(totalPrice)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
     );
}
 
export default OrderDetailsTable;