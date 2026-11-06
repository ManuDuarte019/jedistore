import HttpClientBase from "./HttpClientBase.js";

export default class UserTypes extends HttpClientBase {
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
            throw new TypeError("O nome do tipo é obrigatório e deve ter até 50 caracteres");
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
        return this.get("/user-types/list");
    }

    async getById(id) {
        return this.get(`/user-types/list/${id}`);
    }

    async create(data) {
        return this.postForm("/user-types", data);
    }

    async update(id, data) {
        return this.putForm(`/user-types/${id}`, { ...data, typeId: id });
    }

    async remove(id) {
        return this.delete(`/user-types/${id}`);
    }
}