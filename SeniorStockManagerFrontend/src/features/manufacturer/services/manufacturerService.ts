import Manufacturer from '@/types/models/Manufacturer';
import GenericService from '@/services/genericService';

export default class ManufacturerService extends GenericService<Manufacturer> {
  constructor() {
    super('Manufacturer');
  }
}
