import sampleData from "@/db/sample-data";
import ProductList from "@/components/shared/product/product-list";

const Homepage = () => {
 const products = sampleData.products;
  return (
    <>
      <ProductList data={products} title="Newest Arrivals" limit={4}/>
    </> 
  );
}
 
export default Homepage;