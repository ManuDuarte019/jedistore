export default class FormController {
    constructor(form) {
        if (!(form instanceof HTMLFormElement)) {
            throw new TypeError("FormController precisa receber um formulário HTML.");
        }

        this.form = form;
    }

    serialize() {
        const values = {};

        for (const [name, value] of new FormData(this.form)) {
            if (Object.hasOwn(values, name)) {
                values[name] = Array.isArray(values[name])
                    ? [...values[name], value]
                    : [values[name], value];
            } else {
                values[name] = value;
            }
        }

        return values;
    }

    validate() {
        return this.form.reportValidity();
    }

    clear() {
        this.form.reset();
        this.form.querySelectorAll("input, select, textarea").forEach((field) => {
            field.setCustomValidity("");
        });
    }
}
