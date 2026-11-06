import HttpClientBase from "./HttpClientBase.js";

export default class OrderStatuses extends HttpClientBase {
    #id;
    #name;

    constructor({ id = null, name = "" } = {}) {
        super();
        this.#id = id === null ? null : Number(id);
        this.#name = name;
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
        if (typeof value !== "string" || value.trim() === "" || value.trim().length > 50) {
            throw new TypeError("O nome do status é obrigatório e deve ter até 50 caracteres");
        }
        this.#name = value.trim();
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name
        };
    }

    async list() {
        return this.get("/order-statuses/list");
    }

    async getById(id) {
        return this.get(`/order-statuses/list/${id}`);
    }

    async create(data) {
        return this.postForm("/order-statuses/create", data);
    }

    async update(id, data) {
        return this.putForm(`/order-statuses/update/${id}`, data);
    }

    async remove(id) {
        return this.delete(`/order-statuses/delete/${id}`);
    }
}