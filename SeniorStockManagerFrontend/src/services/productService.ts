import Product from "../types/models/Product";
import GenericService from "./genericService";

export default class ProductService extends GenericService<Product> {

    constructor() {
        super('Product');
    }
}