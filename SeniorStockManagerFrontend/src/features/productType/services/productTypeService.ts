import ProductType from '@/types/models/ProductType';
import GenericService from '@/services/genericService';

export default class ProductTypeService extends GenericService<ProductType> {
  constructor() {
    super('ProductType');
  }
}
