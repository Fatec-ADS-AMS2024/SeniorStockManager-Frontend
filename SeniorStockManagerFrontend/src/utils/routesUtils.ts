import { RouteDefinition } from '@/types/app/RouteDefinition';

/**
 * Cria e valida um objeto de rotas.
 * - Esta função utilitária garante que todos os valores de rota estejam em conformidade com o tipo `RouteDefinition`,
 * ao mesmo tempo em que infere automaticamente as chaves de string literal do objeto criado. Isso fornece
 * IntelliSense completo para as chaves das rotas e suas propriedades.
 */
export function createRoutes<T extends Record<string, RouteDefinition>>(
  routes: T
): T {
  return routes;
}
