import Manufacturer from '@/types/models/Manufacturer';
import generateGenericMethods from '@/utils/serviceUtils';

const genericMethods = generateGenericMethods<Manufacturer>('Manufacturer');

const ManufacturerService = {
  ...genericMethods,
};

export default ManufacturerService;
