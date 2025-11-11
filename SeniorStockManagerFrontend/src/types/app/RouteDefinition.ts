import { ReactNode } from 'react';

export interface RouteDefinition {
  displayName: string;
  path: string;
  element: ReactNode;
  index?: boolean;
}
