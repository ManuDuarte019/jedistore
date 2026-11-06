export default class HttpClientBase {
    #baseUrl;
    #defaultHeaders;

    constructor(baseUrl = "http://localhost/jedi_pw/api") {
        this.#baseUrl = baseUrl;
        this.#defaultHeaders = {
            "Content-Type": "application/json"
        };
    }

    setAuthToken(token) {
        this.#defaultHeaders["Authorization"] = `Bearer ${token}`;
    }

    clearAuthToken() {
        delete this.#defaultHeaders["Authorization"];
    }

    toFormData(data = {}) {
        if (data instanceof FormData) {
            return data;
        }

        if (typeof HTMLFormElement !== "undefined" && data instanceof HTMLFormElement) {
            return new FormData(data);
        }

        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });
        return formData;
    }

    toUrlSearchParams(data = {}) {
        if (data instanceof URLSearchParams) {
            return data;
        }

        if (typeof HTMLFormElement !== "undefined" && data instanceof HTMLFormElement) {
            return new URLSearchParams(new FormData(data));
        }

        if (data instanceof FormData) {
            return new URLSearchParams(data);
        }

        return new URLSearchParams(Object.entries(data));
    }

    #buildUrl(endpoint, params = {}) {
        let url = `${this.#baseUrl}${endpoint}`;

        const queryParams = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
            if (url.includes(`/:${key}`)) {
                url = url.replace(`:${key}`, value);
            } else {
                queryParams.append(key, value);
            }
        }

        const queryString = queryParams.toString();
        if (queryString) {
            url += `?${queryString}`;
        }

        return url;
    }

    async #fetchWithConfig(endpoint, config, params = {}) {
        const { _isFormData, ...fetchConfig } = config;

        try {
            const url = this.#buildUrl(endpoint, params);

            const headers = { ...this.#defaultHeaders, ...fetchConfig.headers };
            if (_isFormData) {
                delete headers["Content-Type"];
            }

            const response = await fetch(url, {
                ...fetchConfig,
                headers
            });

            const contentType = response.headers.get("content-type") || "";
            const payload = contentType.includes("application/json")
                ? await response.json()
                : await response.text();

            if (!response.ok) {
                const message = typeof payload === "object" && payload?.message
                    ? payload.message
                    : `Erro HTTP ${response.status}`;
                const error = new Error(message);
                error.status = response.status;
                error.payload = payload;
                throw error;
            }

            return payload;
        } catch (error) {
            if (error.status !== undefined) {
                throw error;
            }

            const requestError = new Error("Não foi possível conectar ao serviço.");
            requestError.status = 0;
            requestError.cause = error;
            throw requestError;
        }
    }

    async get(endpoint, params = {}, headers = {}) {
        return this.#fetchWithConfig(endpoint, {
            method: "GET",
            headers
        }, params);
    }

    async post(endpoint, data = {}, params = {}) {
        const isFormData = data instanceof FormData;

        return this.#fetchWithConfig(endpoint, {
            method: "POST",
            body: isFormData ? data : JSON.stringify(data),
            _isFormData: isFormData
        }, params);
    }

    async postForm(endpoint, data = {}, params = {}) {
        return this.post(endpoint, this.toFormData(data), params);
    }

    async put(endpoint, data = {}, params = {}) {
        const isFormData = data instanceof FormData;

        return this.#fetchWithConfig(endpoint, {
            method: "PUT",
            body: isFormData ? data : JSON.stringify(data),
            _isFormData: isFormData
        }, params);
    }

    async putForm(endpoint, data = {}, params = {}) {
        const body = this.toUrlSearchParams(data);
        return this.#fetchWithConfig(endpoint, {
            method: "PUT",
            body: body.toString(),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }, params);
    }

    async delete(endpoint, params = {}) {
        return this.#fetchWithConfig(endpoint, {
            method: "DELETE"
        }, params);
    }
}