import {SearchProducts} from "./components/products/search-products";
import {ProductsTable} from "./components/products/products-table";
import {ProductMetrics} from "./components/products/product-metrics";
import {Header} from "./components/shared/header";

export default function App() {
  return (
    <div className="mx-auto min-h-dvh max-w-full justify-center space-y-6 p-4 lg:max-w-4/6">
      <Header />
      <SearchProducts />
      <ProductsTable />
      <ProductMetrics />
    </div>
  );
}
