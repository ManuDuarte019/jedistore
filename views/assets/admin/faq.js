import Faqs from "../_common/classes/Faqs.js";
import AuthGuard from "../_common/classes/AuthGuard.js";
import FormController from "../_common/classes/FormController.js";

const page = document.querySelector("[data-faq-list]");
if (page) {
    const guard = new AuthGuard({ loginPath: "../public/login.html?admin=1", scope: "admin" });
    if (guard.requireSession()) {
        const api = new Faqs();
        api.setAuthToken(guard.storage.getToken());

        const form = document.querySelector("[data-faq-form]");
        const formController = new FormController(form);
        const formTitle = document.querySelector("[data-faq-form-title]");
        const categorySelect = form.elements.namedItem("faqs_category_id");
        const feedback = document.querySelector("[data-feedback]");
        const loading = document.querySelector("[data-faq-loading]");
        const submit = form.querySelector("button[type=submit]");
        let editingId = null;

        const showFeedback = (message, type = "error") => {
            feedback.textContent = message;
            feedback.dataset.type = type;
            feedback.hidden = false;
        };

        const resetForm = () => {
            editingId = null;
            formController.clear();
            form.hidden = true;
            feedback.hidden = true;
            formTitle.textContent = "Nova pergunta";
        };

        const render = (faqs) => {
            page.textContent = "";
            if (!faqs.length) {
                page.textContent = "Nenhuma pergunta frequente cadastrada.";
                return;
            }

            faqs.forEach((faq) => {
                const article = document.createElement("article");
                const heading = document.createElement("h2");
                const answer = document.createElement("p");
                const category = document.createElement("p");
                const editButton = document.createElement("button");
                const deleteButton = document.createElement("button");

                article.className = "faq-item";
                heading.textContent = faq.question;
                answer.textContent = faq.answer;
                category.textContent = `Categoria: ${faq.category_name || faq.faqs_category_id}`;
                editButton.type = "button";
                editButton.textContent = "Editar";
                editButton.dataset.edit = faq.id;
                deleteButton.type = "button";
                deleteButton.textContent = "Excluir";
                deleteButton.dataset.delete = faq.id;

                article.append(heading, answer, category, editButton, deleteButton);
                page.appendChild(article);
            });
        };

        const load = async () => {
            loading.hidden = false;
            try {
                const [categoriesResult, faqsResult] = await Promise.all([
                    api.listCategories(),
                    api.list()
                ]);
                const categories = categoriesResult?.data;
                const faqs = faqsResult?.data;
                if (!Array.isArray(categories) || !Array.isArray(faqs)) {
                    throw new Error("Resposta inválida da API.");
                }

                categorySelect.replaceChildren();
                categories.forEach((category) => {
                    const option = document.createElement("option");
                    option.value = category.id;
                    option.textContent = category.name;
                    categorySelect.appendChild(option);
                });
                form.querySelector("button[type=submit]").disabled = categories.length === 0;
                if (!categories.length) {
                    showFeedback("Cadastre uma categoria de FAQ antes de criar uma pergunta.");
                }

                render(faqs);
            } catch (error) {
                page.textContent = "Não foi possível carregar as perguntas frequentes.";
                showFeedback(error.message || "Erro ao carregar FAQ.");
            } finally {
                loading.hidden = true;
            }
        };

        document.querySelector("[data-new-faq]").addEventListener("click", () => {
            resetForm();
            formTitle.textContent = "Nova pergunta";
            form.hidden = false;
            form.querySelector("input[name=question]").focus();
        });

        document.querySelector("[data-cancel-faq]").addEventListener("click", resetForm);

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            if (!formController.validate()) return;

            submit.disabled = true;
            feedback.hidden = true;
            try {
                const data = formController.serialize();
                const successMessage = editingId
                    ? "Pergunta atualizada com sucesso."
                    : "Pergunta cadastrada com sucesso.";
                if (editingId) {
                    await api.update(editingId, data);
                } else {
                    await api.create(data);
                }
                resetForm();
                await load();
                feedback.hidden = false;
                feedback.dataset.type = "success";
                feedback.textContent = successMessage;
            } catch (error) {
                showFeedback(error.message || "Não foi possível salvar a pergunta.");
            } finally {
                submit.disabled = false;
            }
        });

        page.addEventListener("click", async (event) => {
            const editButton = event.target.closest("[data-edit]");
            const deleteButton = event.target.closest("[data-delete]");

            if (editButton) {
                try {
                    const result = await api.getById(editButton.dataset.edit);
                    const faq = result?.data;
                    if (!faq) return;
                    editingId = faq.id;
                    form.elements.namedItem("faqs_category_id").value = faq.faqs_category_id;
                    form.elements.namedItem("question").value = faq.question;
                    form.elements.namedItem("answer").value = faq.answer;
                    formTitle.textContent = "Editar pergunta";
                    feedback.hidden = true;
                    form.hidden = false;
                    form.querySelector("input[name=question]").focus();
                } catch (error) {
                    showFeedback(error.message || "Não foi possível carregar a pergunta.");
                }
            }

            if (deleteButton) {
                if (!window.confirm("Deseja remover esta pergunta do FAQ?")) return;
                try {
                    await api.remove(deleteButton.dataset.delete);
                    showFeedback("Pergunta removida com sucesso.", "success");
                    await load();
                } catch (error) {
                    showFeedback(error.message || "Não foi possível remover a pergunta.");
                }
            }
        });

        document.querySelectorAll("[data-logout]").forEach((button) => {
            button.addEventListener("click", () => guard.logout());
        });

        load();
    }
}