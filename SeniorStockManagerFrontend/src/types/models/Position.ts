// Assumindo que Position tenha campos similares a UnitOfMeasure
// Ajuste os campos conforme necessário (ex: name, description, etc.)
export default interface Position {
  id: number;
  abbreviation: string; // ou 'name', 'code', etc.
  description: string;
}