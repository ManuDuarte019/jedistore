import Faqs from "../_common/classes/Faqs.js";

const faqPage = document.querySelector("[data-faq-page]");

if (faqPage) {
    const renderFaqs = (categories, faqs) => {
        faqPage.textContent = "";

        categories.forEach((category) => {
            const categoryFaqs = faqs.filter((faq) => Number(faq.faqs_category_id) === Number(category.id));
            if (!categoryFaqs.length) return;

            const heading = document.createElement("h2");
            heading.className = "faq-category";
            heading.textContent = category.name;
            faqPage.appendChild(heading);

            categoryFaqs.forEach((faq) => {
                const details = document.createElement("details");
                const summary = document.createElement("summary");
                const answer = document.createElement("p");
                summary.textContent = faq.question;
                answer.textContent = faq.answer;
                details.append(summary, answer);
                faqPage.appendChild(details);
            });
        });

        if (!faqPage.children.length) {
            faqPage.textContent = "Nenhuma pergunta frequente cadastrada.";
        }
    };

    const loadFaqs = async () => {
        faqPage.textContent = "Carregando perguntas frequentes...";
        try {
            const api = new Faqs();
            const [categoriesResult, faqsResult] = await Promise.all([
                api.listCategories(),
                api.list()
            ]);
            const categories = categoriesResult?.data;
            const faqs = faqsResult?.data;
            if (!Array.isArray(categories) || !Array.isArray(faqs)) {
                throw new Error("Resposta inválida da API");
            }
            renderFaqs(categories, faqs);
        } catch (error) {
            faqPage.textContent = error.message || "Não foi possível carregar as perguntas frequentes.";
        }
    };

    loadFaqs();
}