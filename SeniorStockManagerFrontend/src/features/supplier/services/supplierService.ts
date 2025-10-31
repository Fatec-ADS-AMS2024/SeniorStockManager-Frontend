import Supplier from '@/types/models/Supplier';
import GenericService from '@/services/genericService';

export default class SupplierService extends GenericService<Supplier> {
  constructor() {
    super('Supplier');
  }
}
