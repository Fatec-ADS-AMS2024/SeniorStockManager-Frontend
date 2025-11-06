export interface TableColumn<T> {
  label: string;
  attribute: keyof T;
  render?: (value: T[keyof T], item: T) => string | number;
}
