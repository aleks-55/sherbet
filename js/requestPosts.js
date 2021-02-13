// делаем запросы постов
function requestPosts(chId, after, countPost, query_hash) {
    if (!query_hash) {
        query_hash = '003056d32c2554def87228bc3fd9668a';
    }

    let jsonVariables = '{"id":"' + chId + '","first":' + countPost + ',"after":"' + after + '"}';
    let urlRequest = 'https://www.instagram.com/graphql/query/?query_hash=' + query_hash +
    '&variables=' + encodeURIComponent(jsonVariables);

    let xhrJson = new XMLHttpRequest();
    xhrJson.open('GET', urlRequest);
    xhrJson.send();

    xhrJson.onerror = function(){
        finishSherbet('Ошибка соединения.\nВозникла при очередном запросе постов.');
    }

    xhrJson.onload = function() {
        if (xhrJson.status != 200) {
            // обработать ошибку
            finishSherbet("Ошибка. Ответ сервера: " + xhrJson.status + '\nВозникла при очередном запросе постов.');
            return;
        }

        let jsonResponse;
        try {
            jsonResponse = JSON.parse(xhrJson.response);
        } catch {
            // finishSherbet("Ошибка: ответ сервера не в формате JSON.");
            console.log("Ошибка: ответ сервера не в формате JSON.");
            console.log("Повторим запрос через 6 секунд...");
            setTimeout(requestPosts, 6000, chId, after, countPost, query_hash);
            return;
        }

        let publications = jsonResponse.data.user.edge_owner_to_timeline_media.edges;
        for(let i = 0; i < publications.length; i++) {
            parsePub(publications[i].node);
        }

        count_all_get_posts += publications.length;
        console.log('Получили постов: ' + count_all_get_posts);

        // обновляем в описании число найденных публикаций
        document.getElementById("_countPub").innerHTML = pubDB.countPub;
        // отображать года, в к-х загрузильсь нужные посты
        refresh_visible_years();

        let has_next_page = jsonResponse.data.user.edge_owner_to_timeline_media.page_info.has_next_page;
        if (has_next_page) {
            after = jsonResponse.data.user.edge_owner_to_timeline_media.page_info.end_cursor;

            // requestPosts(chId, after, countPost, query_hash);
            setTimeout(requestPosts, 2000, chId, after, countPost, query_hash);
        } else {
            finishSherbet();
        }
    }
}
