import Supplier from '@/types/models/Supplier';
import generateGenericMethods from '@/utils/serviceUtils';

const genericMethods = generateGenericMethods<Supplier>('Supplier');

const SupplierService = {
  ...genericMethods,
};

export default SupplierService;
