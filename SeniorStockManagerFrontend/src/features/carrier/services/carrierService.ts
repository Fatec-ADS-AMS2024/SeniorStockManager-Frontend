import Carrier from '@/types/models/Carrier';
import GenericService from '@/services/genericService';

export default class CarrierService extends GenericService<Carrier> {
  constructor() {
    super('Carrier');
  }
}
