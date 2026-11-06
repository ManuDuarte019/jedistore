import HttpClientBase from "./HttpClientBase.js";

export default class Product extends HttpClientBase{
    #id;
    #order_id;
    #product_id;
    #quantity;
    #unit_price;

    constructor({ id = null, order_id = null, product_id = null, quantity = 0, unit_price = 0}) {
        super();
        this.id = id;
        this.order_id = order_id;
        this.product_id = product_id;
        this.quantity = quantity;
        this.unit_price = unit_price;
    }

    get id() {
        return this.#id;
    }

    get order_id() {
        return this.#order_id;
    }

    get product_id() {
        return this.#product_id;
    }

    get quantity() {
        return this.#quantity;
    }

    get unit_price() {
        return this.#unit_price;
    }

    set id(value) {
        this.#id = value === null ? null : Number(value);
    }

    set order_id(value) {
        this.#order_id = value === null ? null : Number(value);
    }

    set product_id(value) {
        this.#product_id = value === null ? null : Number(value);
    }

    set quantity(value) {
        this.#quantity = value === null ? null : Number(value);
    }

    set unit_price(value) {
        this.#unit_price = value === null ? null : Number(value);
    }

    toJSON() {
        return {id: this.id, 
                order_id: this.order_id, 
                product_id: this.product_id,
                quantity: this.quantity,
                unit_price: this.unit_price };
    }
}