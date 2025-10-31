import UnitOfMeasure from '@/types/models/UnitOfMeasure';
import generateGenericMethods from '@/utils/serviceUtils';

const genericMethods = generateGenericMethods<UnitOfMeasure>('UnitOfMeasure');

const UnitOfMeasureService = {
  ...genericMethods,
};

export default UnitOfMeasureService;
