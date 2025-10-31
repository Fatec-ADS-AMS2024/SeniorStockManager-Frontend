import Product from '@/types/models/Product';
import generateGenericMethods from '@/utils/serviceUtils';

const genericMethods = generateGenericMethods<Product>('Product');

const ProductService = {
  ...genericMethods,
};

export default ProductService;
