import HttpClientBase from "./HttpClientBase.js";

export default class Subscriptions extends HttpClientBase {
    static STATUSES = ["ACTIVE", "CANCELLED", "EXPIRED"];

    #id;
    #user_id;
    #plan_name;
    #monthly_price;
    #start_date;
    #status;

    constructor({ id = null, user_id = null, plan_name = "", monthly_price = 0, start_date = "", status = "ACTIVE" } = {}) {
        super();
        this.id = id;
        this.user_id = user_id;
        this.plan_name = plan_name;
        this.monthly_price = monthly_price;
        this.start_date = start_date;
        this.status = status;
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

    get plan_name() {
        return this.#plan_name;
    }

    set plan_name(value) {
        if (typeof value !== "string" || value.trim() === "" || value.trim().length > 100) {
            throw new TypeError("O nome do plano é obrigatório e deve ter até 100 caracteres");
        }
        this.#plan_name = value.trim();
    }

    get monthly_price() {
        return this.#monthly_price;
    }

    set monthly_price(value) {
        const number = Number(value);
        if (!Number.isFinite(number) || number < 0) {
            throw new RangeError("O preço mensal deve ser um número não negativo");
        }
        this.#monthly_price = number;
    }

    get start_date() {
        return this.#start_date;
    }

    set start_date(value) {
        if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00`))) {
            throw new TypeError("A data inicial deve estar no formato AAAA-MM-DD");
        }
        this.#start_date = value;
    }

    get status() {
        return this.#status;
    }

    set status(value) {
        if (!Subscriptions.STATUSES.includes(value)) {
            throw new TypeError(`O status deve ser: ${Subscriptions.STATUSES.join(", ")}`);
        }
        this.#status = value;
    }

    toJSON() {
        return {
            id: this.id,
            user_id: this.user_id,
            plan_name: this.plan_name,
            monthly_price: this.monthly_price,
            start_date: this.start_date,
            status: this.status
        };
    }
}