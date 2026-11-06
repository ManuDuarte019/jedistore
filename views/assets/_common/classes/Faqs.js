import HttpClientBase from "./HttpClientBase.js";

export default class Faqs extends HttpClientBase {
    #id;
    #faqs_category_id;
    #question;
    #answer;
    #active;

    constructor({ id = null, faqs_category_id = null, question = "", answer = "", active = 0 } = {}) {
        super();
        this.#id = id === null ? null : Number(id);
        this.#faqs_category_id = faqs_category_id === null ? null : Number(faqs_category_id);
        this.#question = question;
        this.#answer = answer;
        this.#active = Number(active);
    }

    get id() {
        return this.#id;
    }

    get faqs_category_id() {
        return this.#faqs_category_id;
    }   

    get question() {
        return this.#question;
    }

    get answer() {
        return this.#answer;
    }

    get active() {
        return this.#active;
    }

    set id(value) {
        this.#id = value === null ? null : Number(value);
    }

    set faqs_category_id(value) {
        const number = Number(value);
        if (!Number.isInteger(number) || number < 1) {
            throw new RangeError("A categoria do FAQ deve ser um inteiro positivo");
        }
        this.#faqs_category_id = number;
    }

    set question(value) {
        if (typeof value !== "string" || value.trim() === "") {
            throw new TypeError("A pergunta é obrigatória");
        }
        this.#question = value.trim();
    }

    set answer(value) {
        if (typeof value !== "string" || value.trim() === "") {
            throw new TypeError("A resposta é obrigatória");
        }
        this.#answer = value.trim();
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
            faqs_category_id: this.faqs_category_id,
            question: this.question,
            answer: this.answer,
            active: this.active
        };
    }

    static fromPayload(payload) {
        const faq = new Faqs();
        faq.id = payload.id ?? null;
        faq.faqs_category_id = payload.faqs_category_id;
        faq.question = payload.question;
        faq.answer = payload.answer;
        faq.active = payload.active;
        return faq;
    }

    async listCategories() {
        return this.get("/faqs-categories/list");
    }

    async list() {
        return this.get("/faqs/list");
    }

    async getById(id) {
        return this.get(`/faqs/list/${id}`);
    }

    async create(data) {
        return this.postForm("/faqs/insert", data);
    }

    async update(id, data) {
        return this.putForm(`/faqs/update/${id}`, { ...data, faqId: id });
    }

    async remove(id) {
        return this.delete(`/faqs/${id}`);
    }
}


