import ProductGroup from '@/types/models/ProductGroup';
import generateGenericMethods from '@/utils/serviceUtils';

const genericMethods = generateGenericMethods<ProductGroup>('ProductGroup');

const ProductGroupService = {
  ...genericMethods,
};

export default ProductGroupService;
