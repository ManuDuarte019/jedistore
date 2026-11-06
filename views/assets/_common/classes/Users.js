import HttpClientBase from "./HttpClientBase.js";

export default class Users extends HttpClientBase {
    #id;
    #type_id
    #name;
    #email
    #password;
    #cpf;
    #phone;
    #is_active;
    #created_at;
    #photo;

    constructor({ id = null, type_id = null, name = "", email = "", password = "", cpf = "", phone = "", is_active = 0, created_at = null, photo = null } = {}) {
        super();
        this.#id = id;
        this.#type_id = type_id;
        this.#name = name;
        this.#email = email;
        this.#password = password;
        this.#cpf = cpf;
        this.#phone = phone;
        this.#is_active = is_active;
        this.#created_at = created_at;
        this.#photo = photo;
    }

    get id() {
        return this.#id;
    }

    get type_id() {
        return this.#type_id;
    }       

    get name() {    
        return this.#name;
    }       

    get email() {
        return this.#email;
    }

    get password() {
        return this.#password;
    }

    get cpf() {
        return this.#cpf;
    }

    get phone() {
        return this.#phone;
    }

    get is_active() {
        return this.#is_active;
    }   

    get created_at() {
        return this.#created_at;
    }

    get photo() {
        return this.#photo;
    }

    set id(value) {
        this.#id = value === null ? null : Number(value);
    }

    set type_id(value) {
        this.#type_id = value === null ? null : Number(value);
    }

    set name(value) {
        this.#name = value;
         if (typeof value !== "string" || value.trim() === "") {
            throw new TypeError("O nome é obrigatório");
        }
        this.#name = value.trim();
    }

    set email(value) {
        this.#email = value;
         if (typeof value !== "string" || value.trim() === "") {
            throw new TypeError("O email é obrigatório");
        }
        this.#email = value.trim();
    }

    set password(value) {
        this.#password = value;
         if (typeof value !== "string" || value.trim() === "") {
            throw new TypeError("A senha é obrigatória");
        }
        this.#password = value.trim();
    }

    set cpf(value) {
        this.#cpf = value;
         if (typeof value !== "string" || value.trim() === "") {
            throw new TypeError("O CPF é obrigatório");
        }
        this.#cpf = value.trim();
    }

    set phone(value) {
        this.#phone = value;
        if (typeof value !== "string" || value.trim() === "") {
            throw new TypeError("O telefone é obrigatório");
        }
        this.#phone = value.trim();
    }

    set is_active(value) {
        const number = Number(value);
        if (number !== 0 && number !== 1) {
            throw new TypeError("O campo is_active deve ser 0 ou 1");
        }
        this.#is_active = number;
    }

    set created_at(value) {
        const date = new Date(value);
        if (!(date instanceof Date) || isNaN(date.getTime())) {
            throw new TypeError("O campo created_at deve ser uma data válida");
        }
        this.#created_at = date;
    }

    set photo(value) {
        this.#photo = value;
    }

    toJSON() {
        return {
            id: this.#id,
            type_id: this.#type_id,
            name: this.#name,
            email: this.#email,
            cpf: this.#cpf,
            phone: this.#phone,
            is_active: this.#is_active,
            created_at: this.#created_at,
            photo: this.#photo
        };
    }

    async login(email, password) {
        return this.postForm("/users/login", { email, password });
    }

    async loginFromForm(form) {
        return this.postForm("/users/login", form);
    }

    async loginAdmin(email, password) {
        return this.postForm("/users/login-admin", { email, password });
    }

    async loginAdminFromForm(form) {
        return this.postForm("/users/login-admin", form);
    }

    async register(data) {
        return this.postForm("/users/register", data);
    }

    async update(data) {
        return this.put("/users/update", data);
    }

    async updateAdmin(data) {
        return this.put("/users/update-admin", data);
    }
}