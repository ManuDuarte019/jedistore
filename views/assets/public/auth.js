import Users from "../_common/classes/Users.js";
import FormController from "../_common/classes/FormController.js";
import SessionStorage from "../_common/classes/SessionStorage.js";
import Toast, { ApiMessageAdapter } from "../_common/classes/Toast.js";

const form = document.querySelector("[data-auth-form]");
if (form) {
    const formController = new FormController(form);
    const feedback = form.querySelector("[data-feedback]");
    const submit = form.querySelector("button[type=submit]");
    const users = new Users();
    const isAdminLogin = new URLSearchParams(window.location.search).get("admin") === "1";
    const storage = new SessionStorage(isAdminLogin ? "admin" : "default");
    const toast = Object.create(Toast);
    const messageAdapter = Object.create(ApiMessageAdapter);

    if (isAdminLogin) {
        const heading = form.querySelector("h2");
        const registerLink = form.querySelector("[data-register-link]");
        const adminEntry = form.querySelector("[data-admin-entry]");
        const userLoginLink = form.querySelector("[data-user-login-link]");

        if (heading) heading.textContent = "Acesso administrativo";
        submit.textContent = "Entrar no painel";
        if (registerLink) registerLink.hidden = true;
        if (adminEntry) adminEntry.hidden = true;
        if (userLoginLink) userLoginLink.hidden = false;
    }

    const showFeedback = (message, type = "error") => {
        feedback.textContent = message;
        feedback.dataset.type = type;
        feedback.hidden = false;
    };

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!formController.validate()) return;

        submit.disabled = true;
        feedback.hidden = true;
        try {
            const action = isAdminLogin ? "loginAdminFromForm" : form.dataset.authForm;
            const result = await users[action](formController.serialize());
            if (form.dataset.authForm !== "register") {
                const token = result?.data?.token;
                if (!token) {
                    showFeedback("O servidor não retornou uma sessão válida.");
                    toast.show("O servidor não retornou uma sessão válida.", "error");
                    return;
                }
                storage.saveSession(token, result.data);
                toast.show(result?.message || "Login realizado com sucesso.", "success");
                const successPath = isAdminLogin ? "../admin/index.html" : form.dataset.successPath;
                window.location.assign(successPath);
            } else {
                showFeedback(result?.message || "Cadastro realizado com sucesso.", "success");
                toast.show(result?.message || "Cadastro realizado com sucesso.", "success");
                formController.clear();
                window.setTimeout(() => {
                    window.location.assign(form.dataset.successPath);
                }, 800);
            }
        } catch (error) {
            const payload = error?.payload || error;
            const normalized = messageAdapter.normalize(payload);
            const message = normalized.message || error.message || "Não foi possível concluir a operação.";
            showFeedback(message);
            toast.show(message, normalized.type || "error");
        } finally {
            submit.disabled = false;
        }
    });
}
