import Position from '@/types/models/Position';
import generateGenericMethods from '@/utils/serviceUtils';

// Usa o 'generateGenericMethods' para criar o CRUD básico.
// O argumento 'Position' será usado como o endpoint da API (ex: /api/v1/Position)
const genericMethods = generateGenericMethods<Position>('Position');

const PositionService = {
  ...genericMethods,
  // Se precisar de algum método específico além do CRUD, adicione aqui.
};

export default PositionService;