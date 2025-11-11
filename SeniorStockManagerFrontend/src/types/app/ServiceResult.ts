import { FieldError } from '@/features/api/types';

export default interface ServiceResult<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: FieldError[];
}
