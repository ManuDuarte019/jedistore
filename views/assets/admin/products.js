import Products from "../_common/classes/Products.js";
import AuthGuard from "../_common/classes/AuthGuard.js";
import FormController from "../_common/classes/FormController.js";

const page = document.querySelector("[data-products-page]");
if (page) {
    const guard = new AuthGuard({ loginPath: "../public/login.html?admin=1", scope: "admin" });
    if (guard.requireSession()) {
        const api = new Products();
        api.setAuthToken(guard.storage.getToken());
        const form = page.querySelector("[data-product-form]");
        const formController = new FormController(form);
        const tbody = page.querySelector("[data-products-list]");
        const feedback = page.querySelector("[data-feedback]");
        const submit = form.querySelector("button[type=submit]");
        let editingId = null;

        const showFeedback = (message, type = "error") => {
            feedback.textContent = message;
            feedback.dataset.type = type;
            feedback.hidden = false;
        };

        const render = (products) => {
            tbody.textContent = "";
            if (!products.length) {
                tbody.innerHTML = '<tr><td colspan="5">Nenhum produto cadastrado.</td></tr>';
                return;
            }
            products.forEach((product) => {
                const row = document.createElement("tr");
                row.innerHTML = `<td>${product.name || "-"}</td><td>${product.sku || "-"}</td><td>${product.category_name || product.category_id || "-"}</td><td>R$ ${Number(product.price || 0).toFixed(2).replace(".", ",")}</td><td>${product.stock ?? 0} <button type="button" data-edit="${product.id}">Editar</button> <button type="button" data-delete="${product.id}">Excluir</button></td>`;
                tbody.appendChild(row);
            });
        };

        const load = async () => {
            tbody.innerHTML = '<tr><td colspan="5">Carregando produtos...</td></tr>';
            try {
                const result = await api.list();
                render(Array.isArray(result?.data) ? result.data : []);
            } catch (error) {
                tbody.innerHTML = '<tr><td colspan="5">Não foi possível carregar os produtos.</td></tr>';
                showFeedback(error.message);
            }
        };

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            if (!formController.validate()) return;
            submit.disabled = true;
            try {
                const data = formController.serialize();
                if (editingId) {
                    await api.update(editingId, data);
                    showFeedback("Produto atualizado com sucesso.", "success");
                } else {
                    await api.create(data);
                    showFeedback("Produto cadastrado com sucesso.", "success");
                }
                editingId = null;
                formController.clear();
                await load();
            } catch (error) {
                showFeedback(error.message || "Não foi possível salvar o produto.");
            } finally {
                submit.disabled = false;
            }
        });

        tbody.addEventListener("click", async (event) => {
            const deleteButton = event.target.closest("[data-delete]");
            const editButton = event.target.closest("[data-edit]");
            if (deleteButton) {
                if (!window.confirm("Deseja excluir este produto permanentemente? Produtos vinculados a pedidos não podem ser excluídos.")) return;
                try {
                    await api.remove(deleteButton.dataset.delete);
                    showFeedback("Produto excluído do banco com sucesso.", "success");
                    await load();
                } catch (error) {
                    showFeedback(error.message);
                }
            }
            if (editButton) {
                try {
                    const result = await api.get(`/products/list/${editButton.dataset.edit}`);
                    const product = result?.data;
                    if (!product) return;
                    editingId = product.id;
                    Object.entries(product).forEach(([key, value]) => {
                        const input = form.elements.namedItem(key);
                        if (input) input.value = value ?? "";
                    });
                    form.querySelector("input[name=name]").focus();
                } catch (error) {
                    showFeedback(error.message);
                }
            }
        });

        document.querySelectorAll("[data-logout]").forEach((button) => {
            button.addEventListener("click", () => guard.logout());
        });
        load();
    }
}
