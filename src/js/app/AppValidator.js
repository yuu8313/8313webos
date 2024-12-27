/**
 * AppValidator.js - アプリケーション設定の検証を担当
 */
class AppValidator {
    static validateConfig(config) {
        // 必須フィールドの存在チェック
        const requiredFields = ['name', 'version', 'main', 'files'];
        for (const field of requiredFields) {
            if (!config[field]) {
                console.error(`必須フィールド ${field} が見つかりません`);
                return false;
            }
        }

        // filesが配列であることを確認
        if (!Array.isArray(config.files)) {
            console.error('files フィールドは配列である必要があります');
            return false;
        }

        // メインファイルがfilesに含まれていることを確認
        if (!config.files.includes(config.main)) {
            console.error('メインファイルが files リストに含まれていません');
            return false;
        }

        // バージョン形式の検証
        const versionRegex = /^\d+\.\d+\.\d+$/;
        if (!versionRegex.test(config.version)) {
            console.error('不正なバージョン形式です');
            return false;
        }

        return true;
    }
}