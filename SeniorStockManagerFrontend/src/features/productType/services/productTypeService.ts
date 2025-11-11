import ProductType from '@/types/models/ProductType';
import generateGenericMethods from '@/utils/serviceUtils';

const genericMethods = generateGenericMethods<ProductType>('ProductType');

const ProductTypeService = {
  ...genericMethods,
};

export default ProductTypeService;
