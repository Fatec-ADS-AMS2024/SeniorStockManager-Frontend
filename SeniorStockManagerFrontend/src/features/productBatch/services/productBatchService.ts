import ProductBatch from '@/types/models/ProductBatch';
import generateGenericMethods from '@/utils/serviceUtils';

const genericMethods = generateGenericMethods<ProductBatch>('ProductBatch');

const ProductBatchService = {
  ...genericMethods,
};

export default ProductBatchService;