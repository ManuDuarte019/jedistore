import HttpClientBase from "./HttpClientBase.js";

export default class ProductsCategories extends HttpClientBase {
    #id;
    #name;
    #slug;

    constructor({ id = null, name = "", slug = "" } = {}) {
        super();
        this.#id = id === null ? null : Number(id);
        this.#name = name;
        this.#slug = slug;
    }

    get id() {
        return this.#id;
    }

    set id(value) {
        this.#id = value === null ? null : Number(value);
    }

    get name() {
        return this.#name;
    }

    set name(value) {
        if (typeof value !== "string" || value.trim() === "") {
            throw new TypeError("O nome é obrigatório");
        }
        this.#name = value.trim();
    }

    get slug() {
        return this.#slug;
    }

    set slug(value) {
        if (typeof value !== "string" || value.trim() === "") {
            throw new TypeError("O slug é obrigatório");
        }
        this.#slug = value.trim();
    }

    toJSON() {
        return { id: this.id, 
                 name: this.name, 
                 slug: this.slug 
                };
    }

    static fromPayload(payload) {
        const category = new ProductsCategories();
        category.id = payload.id ?? null;
        category.name = payload.name;
        category.slug = payload.slug;
        return category;
    }

    async list() {
        return this.get("/products-categories/list");
    }

    async getById(id) {
        return this.get(`/products-categories/list/${id}`);
    }

    async create(data) {
        return this.postForm("/products-categories", data);
    }

    async update(id, data) {
        return this.putForm(`/products-categories/${id}`, { ...data, categoryId: id });
    }

    async remove(id) {
        return this.delete(`/products-categories/${id}`);
    }
}