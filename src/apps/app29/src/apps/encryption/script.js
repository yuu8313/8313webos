class SecureEncryption {
    static getRandomIV() {
        return CryptoJS.lib.WordArray.random(16);
    }

    static async encrypt(text, key, method) {
        if (!text || !key) return '';
        
        try {
            const salt = CryptoJS.lib.WordArray.random(128/8);
            const iv = this.getRandomIV();
            const derivedKey = CryptoJS.PBKDF2(key, salt, {
                keySize: 256/32,
                iterations: 10000
            });

            let encrypted;
            switch(method) {
                case 'lz-string':
                    const compressed = LZString.compressToBase64(text);
                    encrypted = CryptoJS.AES.encrypt(compressed, derivedKey, {
                        iv: iv,
                        mode: CryptoJS.mode.CBC,
                        padding: CryptoJS.pad.Pkcs7
                    });
                    break;
                case 'aes':
                    encrypted = CryptoJS.AES.encrypt(text, derivedKey, {
                        iv: iv,
                        mode: CryptoJS.mode.CBC,
                        padding: CryptoJS.pad.Pkcs7
                    });
                    break;
                case 'tripledes':
                    encrypted = CryptoJS.TripleDES.encrypt(text, derivedKey, {
                        iv: iv,
                        mode: CryptoJS.mode.CBC,
                        padding: CryptoJS.pad.Pkcs7
                    });
                    break;
                case 'rabbit':
                    encrypted = CryptoJS.Rabbit.encrypt(text, derivedKey, {
                        iv: iv
                    });
                    break;
                case 'rc4':
                    encrypted = CryptoJS.RC4.encrypt(text, derivedKey);
                    break;
                default:
                    throw new Error('不正な暗号化方式');
            }

            const encryptedMessage = salt.toString() + 
                                  iv.toString() + 
                                  encrypted.toString();
            
            localStorage.setItem('privacy-os-pw', CryptoJS.SHA3(key).toString());
            
            return encryptedMessage;
        } catch (error) {
            console.error('Encryption error:', error);
            throw new Error('暗号化に失敗しました');
        }
    }

    static async decrypt(encryptedMessage, key, method) {
        if (!encryptedMessage || !key) return '';
        
        try {
            const salt = CryptoJS.enc.Hex.parse(encryptedMessage.substr(0, 32));
            const iv = CryptoJS.enc.Hex.parse(encryptedMessage.substr(32, 32));
            const encrypted = encryptedMessage.substring(64);

            const derivedKey = CryptoJS.PBKDF2(key, salt, {
                keySize: 256/32,
                iterations: 10000
            });

            let decrypted;
            switch(method) {
                case 'lz-string':
                    const decryptedCompressed = CryptoJS.AES.decrypt(encrypted, derivedKey, {
                        iv: iv,
                        mode: CryptoJS.mode.CBC,
                        padding: CryptoJS.pad.Pkcs7
                    }).toString(CryptoJS.enc.Utf8);
                    decrypted = LZString.decompressFromBase64(decryptedCompressed);
                    break;
                case 'aes':
                    decrypted = CryptoJS.AES.decrypt(encrypted, derivedKey, {
                        iv: iv,
                        mode: CryptoJS.mode.CBC,
                        padding: CryptoJS.pad.Pkcs7
                    }).toString(CryptoJS.enc.Utf8);
                    break;
                case 'tripledes':
                    decrypted = CryptoJS.TripleDES.decrypt(encrypted, derivedKey, {
                        iv: iv,
                        mode: CryptoJS.mode.CBC,
                        padding: CryptoJS.pad.Pkcs7
                    }).toString(CryptoJS.enc.Utf8);
                    break;
                case 'rabbit':
                    decrypted = CryptoJS.Rabbit.decrypt(encrypted, derivedKey, {
                        iv: iv
                    }).toString(CryptoJS.enc.Utf8);
                    break;
                case 'rc4':
                    decrypted = CryptoJS.RC4.decrypt(encrypted, derivedKey).toString(CryptoJS.enc.Utf8);
                    break;
                default:
                    throw new Error('不正な復号化方式');
            }

            if (!decrypted) {
                throw new Error('復号化に失敗しました');
            }

            return decrypted;
        } catch (error) {
            console.error('Decryption error:', error);
            throw new Error('復号化に失敗しました');
        }
    }
}

function updateKeyStrength(key) {
    const strength = calculatePasswordStrength(key);
    const strengthBar = document.getElementById('keyStrength');
    const securityLevel = document.getElementById('securityLevel');
    
    strengthBar.style.width = `${strength}%`;
    
    if (strength < 30) {
        strengthBar.style.background = 'var(--error-color)';
        securityLevel.textContent = 'キーの強度: 弱い';
        securityLevel.style.color = 'var(--error-color)';
    } else if (strength < 70) {
        strengthBar.style.background = 'var(--accent-color)';
        securityLevel.textContent = 'キーの強度: 中程度';
        securityLevel.style.color = 'var(--accent-color)';
    } else {
        strengthBar.style.background = 'var(--success-color)';
        securityLevel.textContent = 'キーの強度: 強い';
        securityLevel.style.color = 'var(--success-color)';
    }
}

function calculatePasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    
    return Math.min(100, strength);
}

document.getElementById('encryptionKey').addEventListener('input', (e) => {
    updateKeyStrength(e.target.value);
});

async function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    try {
        await navigator.clipboard.writeText(element.value);
        showNotification('コピーしました！');
    } catch (err) {
        showNotification('コピーに失敗しました', true);
    }
}

function showNotification(message, isError = false) {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification ${isError ? 'error' : ''}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

async function encrypt() {
    const text = document.getElementById('plainText').value;
    const key = document.getElementById('encryptionKey').value;
    const method = document.getElementById('encryptionMethod').value;

    if (!text || !key) {
        showNotification('テキストとキーを入力してください', true);
        return;
    }

    try {
        const encrypted = await SecureEncryption.encrypt(text, key, method);
        document.getElementById('cipherText').value = encrypted;
        showNotification('暗号化が完了しました');
    } catch (error) {
        showNotification(error.message, true);
    }
}

async function decrypt() {
    const text = document.getElementById('cipherTextToDecrypt').value;
    const key = document.getElementById('decryptionKey').value;
    const method = document.getElementById('decryptionMethod').value;

    if (!text || !key) {
        showNotification('テキストとキーを入力してください', true);
        return;
    }

    try {
        const decrypted = await SecureEncryption.decrypt(text, key, method);
        document.getElementById('decryptedText').value = decrypted;
        showNotification('復号化が完了しました');
    } catch (error) {
        showNotification(error.message, true);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const encryptionKey = document.getElementById('encryptionKey');
    if (encryptionKey.value) {
        updateKeyStrength(encryptionKey.value);
    }
});