class LoginScreen {
    static init() {
        const loginScreen = document.getElementById('login-screen');
        const passwordInput = document.getElementById('password-input');
        const loginButton = document.getElementById('login-button');

        if (!PasswordManager.checkPassword()) {
            passwordInput.placeholder = '新しいパスワードを設定';
            loginButton.textContent = 'パスワードを設定';
        }

        loginButton.addEventListener('click', () => this.handleLogin());
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleLogin();
        });
    }

    static handleLogin() {
        const password = document.getElementById('password-input').value;
        if (!password) return;

        if (!PasswordManager.checkPassword()) {
            PasswordManager.setPassword(password);
            this.hideLoginScreen();
        } else if (PasswordManager.validatePassword(password)) {
            this.hideLoginScreen();
        } else {
            alert('パスワードが違います');
        }
    }

    static hideLoginScreen() {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('password-input').value = '';
    }

    static showLoginScreen() {
        document.getElementById('login-screen').style.display = 'flex';
    }
}