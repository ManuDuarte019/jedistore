import Orders from "../_common/classes/Orders.js";
import SessionStorage from "../_common/classes/SessionStorage.js";

const tableBody = document.querySelector("[data-orders-list]");
if (tableBody) {
    const api = new Orders();
    const storage = new SessionStorage();
    const token = storage.getToken();
    const loading = document.querySelector("[data-orders-loading]");
    const feedback = document.querySelector("[data-orders-feedback]");

    const formatCurrency = (value) => Number(value || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    const formatDate = (value) => {
        if (!value) return "-";
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("pt-BR");
    };

    const render = (orders) => {
        tableBody.replaceChildren();
        if (!orders.length) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");
            cell.colSpan = 6;
            cell.textContent = "Você ainda não possui pedidos.";
            row.appendChild(cell);
            tableBody.appendChild(row);
            return;
        }

        orders.forEach((order) => {
            const row = document.createElement("tr");
            const values = [
                `#${order.id ?? "-"}`,
                order.status_name || `Status ${order.current_status_id ?? "-"}`,
                formatCurrency(order.subtotal),
                formatCurrency(order.shipping_total),
                formatCurrency(order.grandtotal),
                formatDate(order.created_at)
            ];

            values.forEach((value) => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });
            tableBody.appendChild(row);
        });
    };

    const loadOrders = async () => {
        if (!token) {
            loading.hidden = true;
            feedback.textContent = "Entre na sua conta para consultar seus pedidos.";
            feedback.hidden = false;
            tableBody.replaceChildren();
            return;
        }

        api.setAuthToken(token);
        loading.hidden = false;
        feedback.hidden = true;
        try {
            const result = await api.list();
            if (!Array.isArray(result?.data)) {
                throw new Error("A API retornou uma lista de pedidos inválida.");
            }
            render(result.data.map((payload) => Orders.fromPayload(payload)));
        } catch (error) {
            tableBody.replaceChildren();
            feedback.textContent = error.status === 401
                ? "Sua sessão expirou. Entre novamente para consultar seus pedidos."
                : error.message || "Não foi possível carregar os pedidos.";
            feedback.hidden = false;
        } finally {
            loading.hidden = true;
        }
    };

    loadOrders();
}