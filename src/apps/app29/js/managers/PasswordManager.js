class PasswordManager {
    static checkPassword() {
        return localStorage.getItem('privacyOS') !== null;
    }

    static validatePassword(input) {
        return input === localStorage.getItem('privacyOS');
    }

    static setPassword(password) {
        localStorage.setItem('privacyOS', password);
    }
}