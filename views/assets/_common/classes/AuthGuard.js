import SessionStorage from "./SessionStorage.js";

export default class AuthGuard {
    constructor({ loginPath = "../public/login.html", scope = "default" } = {}) {
        this.loginPath = loginPath;
        this.storage = new SessionStorage(scope);
    }

    requireSession() {
        if (!this.storage.getToken()) {
            window.location.replace(this.loginPath);
            return false;
        }
        return true;
    }

    logout(path = this.loginPath) {
        this.storage.clearSession();
        window.location.replace(path);
    }
}
