import { createEnumHelpers } from '@/utils/enumUtils';
import { Enum, EnumLabels } from '../app/Enum';

// Declaração do enum e seus valores
// A chave deve ser escrita em SNAKE_CASE maiúscula
const YesNo: Enum = {
  YES: 1,
  NO: 2,
} as const;

type YesNo = (typeof YesNo)[keyof typeof YesNo];

// Definição dos rótulos
const labels: EnumLabels = {
  [YesNo.YES]: 'Sim',
  [YesNo.NO]: 'Não',
};

// Criação das funções auxiliares para esse enum
const { getEnumLabel, getEnumOptions } = createEnumHelpers(YesNo, labels);

// Exportação das partes necessárias
// ATENÇÃO: as funções auxiliares devem ser exportadas com nomes diferentes para evitar conflito com outros enums
export {
  YesNo,
  getEnumLabel as getYesNoLabel,
  getEnumOptions as getYesNoOptions,
};
