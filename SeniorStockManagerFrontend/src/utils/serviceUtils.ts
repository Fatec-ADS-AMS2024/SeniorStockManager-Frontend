import { api } from '@/features/api';
import { ApiResponse } from '@/features/api';
import ServiceResult from '@/types/app/ServiceResult';
import { isAxiosError } from 'axios';

export default function generateGenericMethods<T extends { id: number }>(
  modelName: string
) {
  const modelEndpoint = `${modelName}/`;

  const getAll = async (): Promise<ServiceResult<T[]>> => {
    try {
      const res = await api.get<T[]>(modelEndpoint);
      return {
        success: res.data.success,
        message: res.data.message,
        data: res.data.data,
      };
    } catch (error) {
      return handleServiceError(error);
    }
  };

  const getById = async (id: number): Promise<ServiceResult<T>> => {
    try {
      const res = await api.get<T>(modelEndpoint + id);
      return {
        success: res.data.success,
        message: res.data.message,
        data: res.data.data,
      };
    } catch (error) {
      return handleServiceError(error);
    }
  };

  const create = async (model: T): Promise<ServiceResult<T>> => {
    try {
      const res = await api.post<T>(modelEndpoint, model);
      return {
        success: res.data.success,
        message: res.data.message,
        data: res.data.data,
      };
    } catch (error) {
      return handleServiceError(error);
    }
  };

  const update = async (id: number, model: T): Promise<ServiceResult<T>> => {
    try {
      const res = await api.put<T>(modelEndpoint + id, model);
      return {
        success: res.data.success,
        message: res.data.message,
        data: res.data.data,
      };
    } catch (error) {
      return handleServiceError(error);
    }
  };

  const deleteById = async (id: number): Promise<ServiceResult<undefined>> => {
    try {
      await api.delete(modelEndpoint + id);
      return { success: true, message: 'Excluído com sucesso' };
    } catch (error) {
      return handleServiceError(error);
    }
  };

  return {
    getAll,
    getById,
    create,
    update,
    deleteById,
  };
}

export function handleServiceError<T>(error: unknown): ServiceResult<T> {
  if (!isAxiosError(error) || !error.response) {
    return {
      success: false,
      message: 'Erro desconhecido',
    };
  }

  if (error.status === 401) {
    return {
      success: false,
      message: 'Não autorizado',
    };
  }

  const responseData = error.response.data as ApiResponse<T>;

  if (responseData.errors && responseData.errors.length > 0) {
    return {
      success: false,
      message: responseData.message || 'Erro de validação',
      errors: responseData.errors,
      data: responseData.data,
    };
  }

  return {
    success: false,
    message: responseData.message,
    data: responseData.data,
  };
}
