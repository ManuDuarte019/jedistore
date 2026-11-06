import HttpClientBase from "./HttpClientBase.js";

export default class FaqsCategories extends HttpClientBase {
    #id;
    #name;
    #active;

    constructor({ id = null, name = "", active = 1 } = {}) {
        super();
        this.#id = id === null ? null : Number(id);
        this.#name = name;
        this.#active = Number(active);
    }

    get id() {
        return this.#id;
    }

    set id(value) {
        this.#id = value === null ? null : Number(value);
        if (this.#id !== null && (!Number.isInteger(this.#id) || this.#id < 1)) {
            throw new RangeError("O ID deve ser um inteiro positivo");
        }
    }

    get name() {
        return this.#name;
    }

    set name(value) {
        if (typeof value !== "string" || value.trim() === "") {
            throw new TypeError("O nome da categoria é obrigatório");
        }
        this.#name = value.trim();
    }

    get active() {
        return this.#active;
    }

    set active(value) {
        const number = Number(value);
        if (number !== 0 && number !== 1) {
            throw new RangeError("O campo active deve ser 0 ou 1");
        }
        this.#active = number;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            active: this.active
        };
    }

    async list() {
        return this.get("/faqs-categories/list");
    }

    async getById(id) {
        return this.get(`/faqs-categories/list/${id}`);
    }

    async create(data) {
        return this.postForm("/faqs-categories/create", data);
    }

    async update(id, data) {
        return this.putForm(`/faqs-categories/update/${id}`, { ...data, categoryId: id });
    }

    async remove(id) {
        return this.delete(`/faqs-categories/${id}`);
    }
}