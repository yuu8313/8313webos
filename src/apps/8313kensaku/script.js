document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        });
    });

    // Search functionality
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    function performSearch() { //タブ機能
        const query = encodeURIComponent(searchInput.value);
        const activeTab = document.querySelector('.tab-content.active');
        const selectedService = activeTab.querySelector('select').value;
        let searchUrl = '';

        switch (activeTab.id) {
            case 'search-engines':
                searchUrl = getSearchEngineUrl(selectedService, query);
                break;
            case 'music':
                searchUrl = getMusicServiceUrl(selectedService, query);
                break;
            case 'shopping':
                searchUrl = getShoppingServiceUrl(selectedService, query);
                break;
            case 'sns':
                searchUrl = getSnsServiceUrl(selectedService, query);
                break;
            case 'image':
                searchUrl = getImageServiceUrl(selectedService, query);
                break;
            case 'video':
                searchUrl = getVideoServiceUrl(selectedService, query);
                break;
            case 'discussion':
                searchUrl = getDiscussionServiceUrl(selectedService, query);
                break;
            case 'dictionary':
                searchUrl = getDictionaryServiceUrl(selectedService, query);
                break;
            case 'academic':
                searchUrl = getAcademicServiceUrl(selectedService, query);
             case 'travel':
                searchUrl = gettravelServiceUrl(selectedService, query);
                break;
            case 'ai':
                searchUrl = getAiServiceUrl(selectedService, query);
                break;
        }

        if (searchUrl) {
            window.open(searchUrl, '_blank');
        }
    }

    function getSearchEngineUrl(engine, query) {　//検索エンジン
        const advancedOptions = getAdvancedSearchOptions();
        query = applyAdvancedOptions(query, advancedOptions);

        switch (engine) {
            case 'google':
                return `https://www.google.com/search?q=${query}`;
            case 'bing':
                return `https://www.bing.com/search?q=${query}`;
            case 'yahoo':
                return `https://search.yahoo.co.jp/search?p=${query}`;
            case 'duckduckgo':
                return `https://duckduckgo.com/?q=${query}`;
            case 'brave':
                return `https://search.brave.com/search?q=${query}`;
            case 'excite':
                return `https://websearch.excite.co.jp/?q=${query}&search-submit-btn=検索`;
        }
    }

    function getMusicServiceUrl(service, query) {   //音楽検索
        switch (service) {
            case 'spotify':
                return `https://open.spotify.com/search/${query}`;
            case 'apple-music':
                return `https://music.apple.com/search?term=${query}`;
            case 'amazon-music':
                return `https://music.amazon.com/search/${query}`;
        }
    }

    function getShoppingServiceUrl(service, query) {    //ECサイト
        switch (service) {
            case 'amazon':
                return `https://www.amazon.co.jp/s?k=${query}`;
            case 'yahoo-shopping':
                return `https://shopping.yahoo.co.jp/search?p=${query}`;
            case 'rakuten':
                return `https://search.rakuten.co.jp/search/mall/${query}`;
            case 'mercari':
                return `https://jp.mercari.com/search?keyword=${query}`;
            case 'dmm':
                return `https://www.dmm.com/search/=/searchstr=${query}`;
            case 'alibaba':
                return `https://www.alibaba.com/trade/search?SearchText=${query}`;
        }
    }

    function getSnsServiceUrl(service, query) { //ソーシャルネットワークサービス
        switch (service) {
            case 'twitter':
                return `https://twitter.com/search?q=${query}`;
            case 'instagram':
                return `https://www.instagram.com/explore/tags/${query}/`;
            case 'facebook':
                return `https://www.facebook.com/search/top/?q=${query}`;
            case 'bluesky':
                return `https://bsky.app/search?q=${query}`;
            case 'threads':
                return `https://www.threads.net/search?q=${query}`;
            case 'linkedin':
                return `https://www.linkedin.com/search/results/all/?keywords=${query}`;
        }
    }

    function getImageServiceUrl(service, query) { //画像検索
        switch (service) {
            case 'googleimage':
                return `https://www.google.com/search?q=${query}&tbm=isch`;
            case 'bingimage':
                return `https://www.bing.com/images/search?q=${query}/`;
            case 'yahooimage':
                return `https://search.yahoo.co.jp/image/search?p=${query}`;
            case 'duckduckgoimage':
                return `https://duckduckgo.com/?q=${query}&iax=images&ia=images`;
            case 'braveimage':
                return `https://search.brave.com/images?q=${query}`;
            case 'exciteimage':
                return `https://imagesearch.excite.co.jp/?q=${query}`;
        }
    }

    function getVideoServiceUrl(service, query) {   //動画サイト検索
        switch (service) {
            case 'niconico':
                return `https://www.nicovideo.jp/search/${query}?ref=nicotop_search`;
            case 'youtube':
                return `https://www.youtube.com/results?search_query=${query}`;
            case 'dailymotion':
                return `https://www.dailymotion.com/search/${query}`;
            case 'bilibili':
                return `https://search.bilibili.com/all?keyword=${query}`;
            case 'tiktok':
                return `https://www.tiktok.com/search?q=${query}`;
        }
    }

    function getDiscussionServiceUrl(service, query) {  //ディスカッション検索
        switch (service) {
            case 'reddit':
                return `https://www.reddit.com/search/?q=${query}`;
            case 'quora':
                return `https://jp.quora.com/search?q=${query}`;
        }
    }

    function getDictionaryServiceUrl(service, query) {  //辞書検索
        switch (service) {
            case 'niconico-dic':
                return `https://dic.nicovideo.jp/s/al/t/${query}`;
            case 'goo-dic':
                return `https://dictionary.goo.ne.jp/srch/all/${query}/m0u/`;
            case 'wikipedia':
                return `https://ja.wikipedia.org/wiki/${query}`;
            case 'pixiv-dic':
                return `https://dic.pixiv.net/a/${query}`;
            case 'weblio':
                return `https://ejje.weblio.jp/content/${query}`;
            case 'kotobank':
                return `https://kotobank.jp/word/${query}`;
            case 'wiktionary':
                return `https://ja.wiktionary.org/wiki/${query}`;
        }
    }

    function getAcademicServiceUrl(service, query) {    //論文検索
        switch (service) {
            case 'google-scholar':
                return `https://scholar.google.com/scholar?q=${query}`;
        }
    }

    function gettravelServiceUrl(service, query) {    //翻訳検索
        switch (service) {
            case 'google-Translation?-JA':
                return `https://translate.google.co.jp/?hl=ja&sl=auto&tl=ja&text=${query}&op=translate`;
            case 'google-Translation?-EN':
                return `https://translate.google.co.jp/?hl=ja&sl=auto&tl=en&text=${query}&op=translate`;
            case 'google-Translation?-DE':
                return `https://translate.google.co.jp/?hl=ja&sl=auto&tl=de&text=${query}&op=translate`;
            case 'google-Translation?-FR':
                return `https://translate.google.co.jp/?hl=ja&sl=auto&tl=fr&text=${query}&op=translate`;

            case 'google-Translation?-KR':
                return `https://translate.google.co.jp/?hl=ja&sl=auto&tl=ko&text=${query}&op=translate`;
            case 'google-Translation?-zh-CN':
                return `https://translate.google.co.jp/?hl=ja&sl=auto&tl=zh-CN&text=${query}&op=translate`;
            case 'google-Translation?-zh-TW':
                return `https://translate.google.co.jp/?hl=ja&sl=auto&tl=zh-TW&text=${query}&op=translate`;
        }
    }


    function getAiServiceUrl(service, query) {  //AI
        switch (service) {
            case 'chatgpt':
                return `https://chatgpt.com/?q=${query}`;
            case 'perplexity':
                return `https://www.perplexity.ai/?q=${query}`;
            case 'genspark':
                return `https://www.genspark.ai/search?query=${query}`;
            case 'felo':
                return `https://felo.ai/search/Qw_X6R5gI8UFuHclWzGbT?q=${query}`;
            case 'wolframalpha':
                return `https://www.wolframalpha.com/input?i=${query}&lang=ja`;
        }
    }

    function getAdvancedSearchOptions() {
        return {
            exactMatch: document.getElementById('exact-match').checked ? document.getElementById('exact-match-input').value : '',
            exclude: document.getElementById('exclude').checked ? document.getElementById('exclude-input').value : '',
            orSearch: document.getElementById('or-search').checked ? document.getElementById('or-search-input').value : '',
            wildcard: document.getElementById('wildcard').checked ? document.getElementById('wildcard-input').value : '',
            synonym: document.getElementById('synonym').checked ? document.getElementById('synonym-input').value : '',
            dateRange: document.getElementById('date-range').checked ? {
                start: document.getElementById('date-start').value,
                end: document.getElementById('date-end').value
            } : null,
            fieldSearch: document.getElementById('field-search').checked ? {
                field: document.getElementById('field-select').value,
                value: document.getElementById('field-search-input').value
            } : null,
            filetype: document.getElementById('filetype').checked ? document.getElementById('filetype-select').value : '',
            define: document.getElementById('define').checked ? document.getElementById('define-input').value : ''
        };
    }

    function applyAdvancedOptions(query, options) {
        if (options.exactMatch) query += ` "${options.exactMatch}"`;
        if (options.exclude) query += ` -${options.exclude}`;
        if (options.orSearch) query += ` OR ${options.orSearch}`;
        if (options.wildcard) query += ` ${options.wildcard}`;
        if (options.synonym) query += ` ~${options.synonym}`;
        if (options.dateRange) query += ` after:${options.dateRange.start} before:${options.dateRange.end}`;
        if (options.fieldSearch) query += ` ${options.fieldSearch.field}:${options.fieldSearch.value}`;
        if (options.filetype) query += ` filetype:${options.filetype}`;
        if (options.define) query += ` define:${options.define}`;
        return query;
    }
});
