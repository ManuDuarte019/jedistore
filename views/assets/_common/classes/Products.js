import HttpClientBase from "./HttpClientBase.js";

export default class Products extends HttpClientBase {
    #id;
    #category_id;
    #sku;
    #name;
    #slug;
    #price;
    #image;
    #description;
    #stock;
    #is_active; 
    #created_at;

    constructor({ id = null, category_id = null, sku = "", name = "", slug = "" , price = 0, image = null, description = "", stock = 0, is_active = 1, created_at = null } = {}) {
        super();
        this.#id = id;
        this.#category_id = category_id;
        this.#sku = sku;
        this.#name = name;
        this.#slug = slug;
        this.#price = price;
        this.#image = image;
        this.#description = description;
        this.#stock = stock;
        this.#is_active = is_active;
        this.#created_at = created_at;
    }

    get id() {
        return this.#id;
    }

    get category_id() {
        return this.#category_id;
    }

    get sku() {
        return this.#sku;
    }

    get name() {
        return this.#name;
    }

    get slug() {
        return this.#slug;
    }

    get price() {
        return this.#price;
    }

    get image() {
        return this.#image;
    }

    get description() {
        return this.#description;
    }

    get stock() {
        return this.#stock;
    }

    get is_active() {
        return this.#is_active;
    }

    get created_at() {
        return this.#created_at;
    }

    set id(value) {
        this.#id = value === null ? null : Number(value);
    }

    set category_id(value) {
        this.#category_id = value === null ? null : Number(value);
    }

    set sku(value) {
        this.#sku = value;
    }

    set name(value) {
         if (typeof value !== "string" || value.trim() === "") {
            throw new TypeError("O nome é obrigatório");
        }
        this.#name = value.trim();
    }

    set slug(value) {
        this.#slug = value;
    }

    set price(value) {
        const number = Number(value);
        if (!Number.isFinite(number) || number < 0) {
            throw new RangeError("O preço deve ser um número não negativo");
        }
        this.#price = number;
    }

    set image(value) {
        this.#image = value;
    }

    set description(value) {
        this.#description = value;
    }

    set stock(value) {
        const number = Number(value);
        if (!Number.isFinite(number) || number < 0) {
            throw new RangeError("O estoque deve ser um número não negativo");
        }
        this.#stock = number;
    }

    set is_active(value) {
        const number = Number(value);
        if (!Number.isFinite(number) || number < 0 || number > 1) {
            throw new RangeError("O status deve ser 0 ou 1");
        }
        this.#is_active = number;
    }

    set created_at(value) {
        const date = new Date(value);
        if (!(date instanceof Date) || isNaN(date.getTime())) {
            throw new TypeError("O campo created_at deve ser uma data válida");
        }
        this.#created_at = date;
    }

    toJSON() {
        return {
            id: this.#id,
            category_id: this.#category_id,
            sku: this.#sku,
            name: this.#name,
            slug: this.#slug,
            price: this.#price,
            image: this.#image,
            description: this.#description,
            stock: this.#stock,
            is_active: this.#is_active,
            created_at: this.#created_at
        };
    }

    async list() {
        return this.get("/products/list");
    }

    async create(data) {
        return this.postForm("/products", data);
    }

    async update(id, data) {
        return this.putForm(`/products/${id}`, { ...data, productId: id });
    }

    async remove(id) {
        return this.delete(`/products/${id}`);
    }
}
