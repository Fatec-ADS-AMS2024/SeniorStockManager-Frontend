import ProductGroup from "@/types/models/ProductGroup";
import GenericService from "./genericService";

export default class ProductGroupService extends GenericService<ProductGroup> {

    constructor() {
        super('ProductGroup');
    }
}
