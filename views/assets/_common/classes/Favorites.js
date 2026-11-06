import HttpClientBase from "./HttpClientBase.js";

export default class Favorites extends HttpClientBase {
    #id;
    #user_id;
    #product_id;

    constructor({ id = null, user_id = null, product_id = null } = {}) {
        super();
        this.id = id;
        this.user_id = user_id;
        this.product_id = product_id;
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

    get product_id() {
        return this.#product_id;
    }

    set product_id(value) {
        this.#product_id = value === null ? null : Number(value);
        if (this.#product_id !== null && (!Number.isInteger(this.#product_id) || this.#product_id < 1)) {
            throw new RangeError("O ID do produto deve ser um inteiro positivo");
        }
    }

    toJSON() {
        return {
            id: this.id,
            user_id: this.user_id,
            product_id: this.product_id
        };
    }
}