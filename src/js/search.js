const searchBar = document.getElementById('search-bar');

        searchBar.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchBar.value.trim();

                // URLの場合は新しいタブで開く
                if (isValidUrl(query)) {
                    const url = query.startsWith('http') ? query : `https://${query}`;
                    window.open(url, '_blank');
                } else {
                    // Google検索を新しいタブで実行
                    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                    window.open(searchUrl, '_blank');
                }
            }
        });

        // URLが有効かチェック
        function isValidUrl(string) {
            // ドメイン形式の文字列に限定する（「.」が含まれているかを確認）
            const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/;
            return urlPattern.test(string);
        }

        // フォーカス時に全選択
        searchBar.addEventListener('focus', () => {
            searchBar.select();
        });
