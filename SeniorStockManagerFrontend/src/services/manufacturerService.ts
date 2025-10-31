import Manufacturer from '@/types/models/Manufacturer';
import GenericService from './genericService';

export default class ManufacturerService extends GenericService<Manufacturer> {
  constructor() {
    super('Manufacturer');
  }
}
