import axios from "axios";
import ServiceResult from "../types/services/ServiceResult";

export default abstract class GenericService<T extends { id: number }> {
    protected readonly baseUrl: string;

    constructor(modelName: string) {
        this.baseUrl = `https://localhost:7053/api/v1/${modelName}/`;
    }

    async getAll(): Promise<ServiceResult<T[]>> {
        try {
            const res = await axios.get(this.baseUrl);
            return new ServiceResult<T[]>(res.status, "Registros encontrados", res.data);
        } catch (error) {
            const { code, message } = this.handleError(error);
            return new ServiceResult<T[]>(code, message);
        }
    }

    async getById(id: number): Promise<ServiceResult<T>> {
        try {
            this.validateId(id);
            const res = await axios.get(this.baseUrl + id);

            return new ServiceResult<T>(res.status, "Registro encontrado", res.data);
        } catch (error) {
            const { code, message } = this.handleError(error);
            return new ServiceResult<T>(code, message);
        }
    }

    async create(model: T): Promise<ServiceResult<T>> {
        try {
            if (!model) throw new Error("Os dados não foram informados");
        // REMOVE o ID manualmente se vier undefined
            const { id, ...rest } = model;
            const res = await axios.post(this.baseUrl, rest);
            return new ServiceResult<T>(res.status, "Registro criado com sucesso", res.data);
        } catch (error) {
            const { code, message } = this.handleError(error);
            return new ServiceResult<T>(code, message);
        }
    }

    async update(id: number, model: T): Promise<ServiceResult<T>> {
        try {
            this.validateModel(model);

            const res = await axios.put(this.baseUrl + id, model);
            return new ServiceResult<T>(res.status, "Alteração realizada com sucesso", res.data);
        } catch (error) {
            const { code, message } = this.handleError(error);
            return new ServiceResult<T>(code, message);
        }
    }

    async delete(id: number): Promise<ServiceResult<string>> {
        try {
            this.validateId(id);
            const res = await axios.delete(this.baseUrl + id);

            return new ServiceResult<string>(res.status, "Exclusão realizada com sucesso", res.data);
        } catch (error) {
            const { code, message } = this.handleError(error);
            return new ServiceResult<string>(code, message);
        }
    }

    protected validateId(id: number): void {
        if (!id) throw new Error("Id não fornecido");

        if (!Number.isInteger(id) || id <= 0) {
            throw new Error("Id inválido: deve ser um inteiro positivo");
        }
    }

    protected validateModel(model: T): void {
        if (!model) throw new Error("Os dados não foram informados");
        this.validateId(model.id);
    }

    protected handleError(error: unknown): { code: number, message: string } {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                return {
                    code: error.response.status,
                    message: "Erro no servidor",
                };
            } else if (error.request) {
                // Sem resposta
                return {
                    code: 400,
                    message: "Erro na requisição: o servidor não respondeu.",
                };
            } else {
                // Erro na configuração da requisição
                return {
                    code: 400,
                    message: `Erro na configuração da requisição: ${error.message}`,
                };
            }
        } else if (error instanceof Error) {
            // Erro genérico
            return {
                code: 400,
                message: `Erro: ${error.message}`,
            };
        } else {
            // Erro desconhecido
            return {
                code: 400,
                message: "Erro desconhecido.",
            };
        }
    }
}