import Carrier from '@/types/models/Carrier';
import generateGenericMethods from '@/utils/serviceUtils';

const genericMethods = generateGenericMethods<Carrier>('Carrier');

const CarrierService = {
  ...genericMethods,
};

export default CarrierService;
