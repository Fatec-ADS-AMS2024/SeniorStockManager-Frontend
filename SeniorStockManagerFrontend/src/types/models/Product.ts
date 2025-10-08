import { YesNo } from "../enums/YesNo";

export default interface Product {
    id: number;
    description: string;
    genericName:string;
    minimumStock: number;
    currentStock: number;
    stockValue?: number;
    unitPrice: number;  
    averageCost?: number;
    lastPurchasePrice?: number;
    HighCost: YesNo;
    ExpirationControlled: YesNo; 
}
  