'use client';

import { useToast } from "@/hooks/use-toast";
import { productDefaultValues } from "@/lib/constants";
import { insertProductSchema, updateProductSchema } from "@/lib/validators";
import { Product } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import slugify from 'slugify';
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

const ProductForm = ({ type, product, productId }: {
    type: 'Create' | 'Update';
    product?: Product;
    productId?: string;
}) => {
    const router = useRouter();
    const { toast } = useToast();
    
    const form = useForm<z.infer<typeof insertProductSchema>>({
        resolver: type === 'Update' ? zodResolver(updateProductSchema) : zodResolver(insertProductSchema),
        defaultValues: product && type === 'Update' ? product : productDefaultValues,
    });


    return ( 
        <Form {...form}>
            <form className="space-y-8">
                <div className="flex flex-col gap-5 md:flex-row">
                    {/* Name */}
                    <FormField 
                        control={form.control}
                        name="name"
                        render={({ field }: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'name'>}) => (
                            <FormItem className="w-full">
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Product Name" { ...field } />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    {/* Slug */}
                    <FormField 
                        control={form.control}
                        name="slug"
                        render={({ field }: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'slug'>}) => (
                            <FormItem className="w-full">
                                <FormLabel>Slug</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input placeholder="Enter Slug" { ...field } />
                                        <Button 
                                        type="button" 
                                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 mt-2"
                                        onClick={() => {
                                            form.setValue('slug', slugify(form.getValues('name'), { lower: true }))
                                        }}
                                        >Generate</Button>
                                    </div>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex flex-col gap-5 md:flex-row">
                    {/* Category */}
                    <FormField 
                        control={form.control}
                        name="category"
                        render={({ field }: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'category'>}) => (
                            <FormItem className="w-full">
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Category" { ...field } />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    {/* Brand */}
                    <FormField 
                        control={form.control}
                        name="brand"
                        render={({ field }: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'brand'>}) => (
                            <FormItem className="w-full">
                                <FormLabel>Brand</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Brand" { ...field } />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex flex-col gap-5 md:flex-row">
                    {/* Price */}
                    <FormField 
                        control={form.control}
                        name="price"
                        render={({ field }: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'price'>}) => (
                            <FormItem className="w-full">
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Product Price" { ...field } />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    {/* Stock */}
                    <FormField 
                        control={form.control}
                        name="stock"
                        render={({ field }: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'stock'>}) => (
                            <FormItem className="w-full">
                                <FormLabel>Stock</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Stock" { ...field } />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <div className="upload-field flex flex-col gap-5 md:flex-row">
                    {/* Images */}
                </div>
                <div className="upload-field">
                    {/* isFeatured */}
                </div>
                <div>
                    {/* Description */}
                    <FormField 
                        control={form.control}
                        name="description"
                        render={({ field }: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'description'>}) => (
                            <FormItem className="w-full">
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Enter Product Description" { ...field } className="resize-none"/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <div>
                    {/* Submit */}
                    <Button type="submit" size='lg' disabled={form.formState.isSubmitting} className="button col-span-2 w-full">
                        { form.formState.isSubmitting ? 'Submitting' : `${type} Product`}
                    </Button>
                </div>
            </form>

        </Form>
     );
}
 

export default ProductForm;