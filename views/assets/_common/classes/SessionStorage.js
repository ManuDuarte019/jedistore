export default class SessionStorage {
    #tokenKey;
    #userKey;

    constructor(scope = "default") {
        const suffix = scope === "default" ? "" : `_${scope}`;
        this.#tokenKey = `running_power${suffix}_token`;
        this.#userKey = `running_power${suffix}_user`;
    }

    saveSession(token, user = null) {
        localStorage.setItem(this.#tokenKey, token);
        if (user) {
            localStorage.setItem(this.#userKey, JSON.stringify(user));
        }
    }

    getToken() {
        return localStorage.getItem(this.#tokenKey);
    }

    getUser() {
        try {
            return JSON.parse(localStorage.getItem(this.#userKey) || "null");
        } catch {
            return null;
        }
    }

    clearSession() {
        localStorage.removeItem(this.#tokenKey);
        localStorage.removeItem(this.#userKey);
    }
}
