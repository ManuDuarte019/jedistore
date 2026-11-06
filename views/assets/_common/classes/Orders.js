import HttpClientBase from "./HttpClientBase.js";

export default class Orders extends HttpClientBase {
    #id;
    #user_id;
    #address_id;
    #current_status_id;
    #status_name;
    #subtotal;
    #grandtotal;
    #shipping_total;
    #created_at;

    constructor({ id = null, user_id = null, address_id = null, current_status_id = null, status_name = "", subtotal = 0, grandtotal = 0, grand_total = null, shipping_total = 0, created_at = null } = {}) {
        super();
        this.id = id;
        this.user_id = user_id;
        this.address_id = address_id;
        this.current_status_id = current_status_id;
        this.status_name = status_name;
        this.subtotal = subtotal;
        this.grandtotal = grand_total ?? grandtotal;
        this.shipping_total = shipping_total;
        this.created_at = created_at;
    }

    get id() {
        return this.#id;
    }

    get user_id() {
        return this.#user_id;
    }

    get address_id() {
        return this.#address_id;
    }   

    get current_status_id() {
        return this.#current_status_id;
    }

    get status_name() {
        return this.#status_name;
    }

    get subtotal() {
        return this.#subtotal;
    }

    get grandtotal() {
        return this.#grandtotal;
    }

    get shipping_total() {
        return this.#shipping_total;
    }

    get created_at() {
        return this.#created_at;
    }

    set id(value) {
        this.#id = value === null ? null : Number(value);
    }

    set user_id(value) {
        this.#user_id = value === null ? null : Number(value);
    }

    set address_id(value) {
        this.#address_id = value === null ? null : Number(value);
    }

    set current_status_id(value) {
        this.#current_status_id = value === null ? null : Number(value);
    }

    set status_name(value) {
        this.#status_name = typeof value === "string" ? value : "";
    }

    set subtotal(value) {
        this.#subtotal = value === null ? null : Number(value);
    }

    set grandtotal(value) {
        this.#grandtotal = value === null ? null : Number(value);
    }

    set shipping_total(value) {
        this.#shipping_total = value === null ? null : Number(value);
    }

    set created_at(value) {
        const date = new Date(value);
        if (!(date instanceof Date) || isNaN(date.getTime())) {
            throw new TypeError("O campo created_at deve ser uma data válida");
        }
        this.#created_at = date;
    }

    toJSON() {
        return { id: this.id,
                 user_id: this.user_id,
                 address_id: this.address_id,
                 current_status_id: this.current_status_id,
                 status_name: this.status_name,
                 subtotal: this.subtotal,
                 grandtotal: this.grandtotal,
                 shipping_total: this.shipping_total,
                 created_at: this.created_at };
    }

    static fromPayload(payload) {
        return new Orders(payload);
    }

    async list() {
        return this.get("/orders/list");
    }

    async getById(id) {
        return this.get(`/orders/list/${id}`);
    }

    async create(data) {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (key === "items" && Array.isArray(value)) {
                value.forEach((item, index) => {
                    Object.entries(item).forEach(([itemKey, itemValue]) => {
                        formData.append(`items[${index}][${itemKey}]`, itemValue);
                    });
                });
                return;
            }

            if (value !== null && value !== undefined) {
                formData.append(key, value);
            }
        });

        return this.postForm("/orders/create", formData);
    }

    async update(id, data) {
        return this.putForm("/orders/update", { ...data, orderId: id });
    }

    async remove(id) {
        return this.delete(`/orders/delete/${id}`);
    }
}