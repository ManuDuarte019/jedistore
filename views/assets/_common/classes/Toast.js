const toastPrototype = {
    root: null,

    ensureRoot() {
        if (this.root && this.root.isConnected) {
            return this.root;
        }

        const existing = document.querySelector("[data-toast-root]");
        if (existing) {
            this.root = existing;
            return this.root;
        }

        const container = document.createElement("div");
        container.setAttribute("data-toast-root", "true");
        container.style.position = "fixed";
        container.style.top = "20px";
        container.style.right = "20px";
        container.style.zIndex = "9999";
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.gap = "12px";
        document.body.appendChild(container);
        this.root = container;
        return this.root;
    },

    extractMessage(payload) {
        if (typeof payload === "string") {
            return payload;
        }

        if (!payload || typeof payload !== "object") {
            return "Operação concluída.";
        }

        if (payload.message) {
            return payload.message;
        }

        if (payload.data) {
            if (typeof payload.data === "string") {
                return payload.data;
            }

            if (typeof payload.data === "object") {
                if (payload.data.message) {
                    return payload.data.message;
                }
                if (payload.data.error) {
                    return payload.data.error;
                }
            }
        }

        if (payload.error) {
            return payload.error;
        }

        return "Resposta inesperada da API.";
    },

    show(message, type = "success", timeout = 3500) {
        const root = this.ensureRoot();
        const toast = document.createElement("div");
        const text = this.extractMessage(message);

        toast.textContent = text;
        toast.setAttribute("role", "status");
        toast.dataset.type = type;
        toast.style.maxWidth = "360px";
        toast.style.padding = "12px 16px";
        toast.style.borderRadius = "10px";
        toast.style.color = "#fff";
        toast.style.fontSize = "0.9rem";
        toast.style.fontWeight = "600";
        toast.style.boxShadow = "0 10px 24px rgba(0,0,0,.2)";
        toast.style.background = type === "error"
            ? "#d9534f"
            : type === "warning"
                ? "#f0ad4e"
                : "#27ae60";

        root.appendChild(toast);

        window.setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transition = "opacity 200ms ease";
            window.setTimeout(() => toast.remove(), 220);
        }, timeout);

        return toast;
    }
};

const responseAdapterPrototype = {
    normalize(payload) {
        if (!payload || typeof payload !== "object") {
            return { type: "success", message: "Operação concluída." };
        }

        const message = toastPrototype.extractMessage.call(this, payload);

        if (payload.type === "error" || payload.status === "error" || payload.code >= 400) {
            return { type: "error", message };
        }

        if (payload.type === "warning" || payload.status === "warning") {
            return { type: "warning", message };
        }

        return { type: "success", message };
    }
};

export const Toast = Object.create(toastPrototype);
export const ApiMessageAdapter = Object.create(responseAdapterPrototype);
export const toastA = Object.create(Toast);
export const toastB = Object.create(Toast);
export const adapterA = Object.create(ApiMessageAdapter);
export const adapterB = Object.create(ApiMessageAdapter);

export default Toast;
