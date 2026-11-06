import HttpClientBase from "./HttpClientBase.js";

export default class Payments extends HttpClientBase {
    static METHODS = ["PIX", "BOLETO", "CREDIT_CARD", "DEBIT_CARD"];
    static STATUSES = ["PENDING", "APPROVED", "DECLINED"];

    #id;
    #order_id;
    #method;
    #amount;
    #status;
    #created_at;

    constructor({ id = null, order_id = null, method = "", amount = 0, status = "PENDING", created_at = null } = {}) {
        super();
        this.id = id;
        this.order_id = order_id;
        this.method = method;
        this.amount = amount;
        this.status = status;
        this.created_at = created_at;
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

    get order_id() {
        return this.#order_id;
    }

    set order_id(value) {
        this.#order_id = value === null ? null : Number(value);
        if (this.#order_id !== null && (!Number.isInteger(this.#order_id) || this.#order_id < 1)) {
            throw new RangeError("O ID do pedido deve ser um inteiro positivo");
        }
    }

    get method() {
        return this.#method;
    }

    set method(value) {
        if (!Payments.METHODS.includes(value)) {
            throw new TypeError(`O método deve ser: ${Payments.METHODS.join(", ")}`);
        }
        this.#method = value;
    }

    get amount() {
        return this.#amount;
    }

    set amount(value) {
        const number = Number(value);
        if (!Number.isFinite(number) || number < 0) {
            throw new RangeError("O valor do pagamento deve ser um número não negativo");
        }
        this.#amount = number;
    }

    get status() {
        return this.#status;
    }

    set status(value) {
        if (!Payments.STATUSES.includes(value)) {
            throw new TypeError(`O status deve ser: ${Payments.STATUSES.join(", ")}`);
        }
        this.#status = value;
    }

    get created_at() {
        return this.#created_at;
    }

    set created_at(value) {
        if (value === null) {
            this.#created_at = null;
            return;
        }
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            throw new TypeError("A data de criação deve ser válida");
        }
        this.#created_at = date;
    }

    toJSON() {
        return {
            id: this.id,
            order_id: this.order_id,
            method: this.method,
            amount: this.amount,
            status: this.status,
            created_at: this.created_at
        };
    }
}