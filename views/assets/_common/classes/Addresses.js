import HttpClientBase from "./HttpClientBase.js";

export default class Addresses extends HttpClientBase {
    #id;
    #user_id;
    #zipcode;

    constructor({ id = null, user_id = null, zipcode = "" } = {}) {
        super();
        this.#id = id === null ? null : Number(id);
        this.#user_id = user_id === null ? null : Number(user_id);
        this.#zipcode = zipcode;
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

    get user_id() {
        return this.#user_id;
    }

    set user_id(value) {
        this.#user_id = value === null ? null : Number(value);
        if (this.#user_id !== null && (!Number.isInteger(this.#user_id) || this.#user_id < 1)) {
            throw new RangeError("O ID do usuário deve ser um inteiro positivo");
        }
    }

    get zipcode() {
        return this.#zipcode;
    }

    set zipcode(value) {
        if (typeof value !== "string" || value.trim() === "" || value.trim().length > 10) {
            throw new TypeError("O CEP é obrigatório e deve ter até 10 caracteres");
        }
        this.#zipcode = value.trim();
    }

    toJSON() {
        return {
            id: this.id,
            user_id: this.user_id,
            zipcode: this.zipcode
        };
    }

    async list() {
        return this.get("/addresses/list");
    }

    async create(data) {
        return this.postForm("/addresses/register", data);
    }

    async update(data) {
        return this.putForm("/addresses/update", data);
    }
}