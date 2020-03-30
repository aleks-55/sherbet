let username = "";
let mymonth = '';

let start_year = (new Date).getFullYear();
let end_year = 2010;

// {2020: {visible: false, domOb: div.year}, 2019: {visible: false, domOb: div.year}}
let years = {};

click_to_post = function() {};

// база нужных публикаций
let pubDB = { 'countPub': 0 };

function init() {
    document.getElementById("month_selector").value = (new Date).getMonth() + 1;

    // нажатие на кнопку "Новый поиск"
    document.getElementById("refresh_btn").onclick = function() {
        document.getElementById("mainBox").innerHTML = '';
        document.getElementById("description").innerHTML = '';
        // but_1.disabled = false;
        // показываем форму
        document.getElementById("mainForm").classList.remove('visible_off');
        document.getElementById("refresh_btn").classList.remove('visible_on');
        
        years = initYears();
        pubDB = { 'countPub': 0 };
        username = '';
    }

    // "отправка" формы
    document.getElementById("mainForm").onsubmit = function() {
        // получаем username
        let tmp_inputUser = document.getElementById("inputUser").value;
        if (t = tmp_inputUser.match(/^https:\/\/www.instagram.com\/([a-z0-9_.]+)\/{0,1}$/)) {
            username = t[1];
        } else {
            if (tmp_inputUser.match(/^[a-z0-9_.]+$/)) {
                username = tmp_inputUser;
            }
            else {
                alert("Неправильно введен username или ссылка на страницу пользователя.");
                // чтоб не перезагружалась страница
                return false;
            }
        }

        // получаем номер месяца
        mymonth = document.getElementById("month_selector").value;
        // делаем кн. неактивной
        // this.disabled = true;
        // скрываем всю форму
        this.classList.add('visible_off');
        
        document.getElementById("waitingBox").classList.add('visible_on');

        startSherbet("https://www.instagram.com/" + username + "/");

        // чтоб не перезагружалась страница
        return false;
    };

    years = initYears();

    // нажатие на кнопку НАВЕРХ
    document.getElementById('back-top').onclick = function() {
        window.scrollTo(0, 0);
    }

    // отображение кнопки НАВЕРХ
    window.addEventListener('scroll', function() {
        if (pageYOffset > 200) {
            document.getElementById('back-top').classList.add('visible');
        } else {
            document.getElementById('back-top').classList.remove('visible');
        }
    });
}

function startSherbet(urlUserPage) {
    // id канала из страницы пользователя
    let chId = "";
    // на каком посте закончился посл. из сделанных запроров request_big_count_post
    let after = '';
    // по сколько постов запрашивать? в request_big_count_post
    let countPost = 100;
    // берется из js-файла
    let query_hash = 'e769aa130647d2354c40ea6a439bfc08';

    // STEP 1 -------------------------------------
    // получим страницу пользователя (канала)
    let xhr = new XMLHttpRequest();
    xhr.open('GET', urlUserPage);
    xhr.send();

    xhr.onload = function() {
        if (xhr.status != 200) {
            // обработать ошибку
            alert("Ошибка при запросе страницы пользователя.\nОтвет сервера: " + xhr.status);
            document.getElementById("refresh_btn").classList.add('visible_on');
            return;
        }
    
        // преобразуем ответ в DOM-объект
        let doc  = new DOMParser().parseFromString(xhr.responseText, 'text/html');
        // и получим url на js-файл в котором лежит query_hash
        let script;
        // script = doc.querySelectorAll("script[src]"); 
        // let url_js = "";
        // for (let i = 0; i < script.length; i++) {
        //     if (script[i].src.match("ProfilePageContainer.js")) {
        //         url_js = "https://www.instagram.com" + script[i].outerHTML.split('src="')[1].split('"')[0];
        //         break;
        //     }
        // }

        // теперь извлечем id канала из страницы пользователя
        script = doc.querySelectorAll("script"); 
        for (let i = 0; i < script.length; i++) {
            if (script[i].innerHTML.match(/^window._sharedData = /)) {
                let prefix = "window._sharedData = ";
                let jsonUserPage = JSON.parse(script[i].innerHTML.substr(prefix.length, script[i].innerHTML.length - prefix.length - 1))
                chId = jsonUserPage["entry_data"]["ProfilePage"][0]["graphql"]["user"]["id"];
                break;
            }
        }
        //return chId;

        // поставим title на нашу страницу-скрипт
        document.title = doc.title.split(' • ')[0] + ' • ' + document.title;

        document.getElementById("description").innerHTML = "На странице пользователя <strong>" + username + "</strong> " + 
                                getCountPubAll(xhr.responseText) +
                                " публикаций.<br />Ищем все " + getMonthRusPrilog(mymonth) + " публикации.";

        // step2(url_js);
        // step 3
        request_big_count_post();
    }

    xhr.onerror = function(){
        alert('Ошибка соединения.\nВозникла при выполнении Serbet step 1\n(при загрузке страницы пользователя)');
    }

    // STEP 2 -------------------------------------
    // загрузим js-файл и получим query_hash
    // function step2(urlJs) {
    //     let xhr_query_hash = new XMLHttpRequest();
    //     xhr_query_hash.open('GET', urlJs);
    //     xhr_query_hash.send();

    //     xhr_query_hash.onload = function() {
    //         if (xhr_query_hash.status != 200) {
    //             // обработать ошибку
    //             alert("Ошибка при загрузке дополнительного файла. Ответ сервера: " + xhr_query_hash.status);
    //             document.getElementById("refresh_btn").classList.add('visible_on');
    //             return;
    //         }
    //         if (t = xhr_query_hash.responseText.match(/s.pagination},queryId:"([A-Za-z0-9_-]+)"/)) {
    //             query_hash = t[1];
    //         } else {
    //             alert('Ошибка.\nВ дополнительном файле не найден query_hash (queryId)');
    //             document.getElementById("refresh_btn").classList.add('visible_on');
    //             return;
    //         }
    //         //return query_hash;

    //         request_big_count_post();
    //     }

    //     xhr_query_hash.onerror = function(){
    //         alert('Ошибка соединения.\nВозникла при выполнении Serbet step 2\n(при загрузке дополнительного файла)');
    //     }
    // }

    // STEP 3 -------------------------------------
    // делаем запросы постов
    function request_big_count_post() {
        let jsonVariables = '{"id":"' + chId + '","first":' + countPost + ',"after":"' + after + '"}';
        let urlRequest = 'https://www.instagram.com/graphql/query/?query_hash=' + query_hash +
        '&variables=' + encodeURIComponent(jsonVariables);

        let xhrJson = new XMLHttpRequest();
        xhrJson.open('GET', urlRequest);
        xhrJson.send();

        xhrJson.onload = function() {
            if (xhrJson.status != 200) {
                // обработать ошибку
                alert("Ошибка. Ответ сервера: " + xhrJson.status);
                return;
            }
    
            let jsonResponse = JSON.parse(xhrJson.response);
            let publications = jsonResponse["data"]["user"]["edge_owner_to_timeline_media"]["edges"];
            for(let i = 0; i < publications.length; i++) {
                parsePub(publications[i]["node"]);
            }
    
            // отображать года, в к-х загрузильсь нужные посты
            refresh_visible_years();

            let has_next_page = jsonResponse["data"]["user"]["edge_owner_to_timeline_media"]["page_info"]["has_next_page"];
            if (has_next_page) {
                after = jsonResponse["data"]["user"]["edge_owner_to_timeline_media"]["page_info"]["end_cursor"];

                request_big_count_post();
            } else {
                document.getElementById("waitingBox").classList.remove('visible_on');
                document.getElementById("refresh_btn").classList.add('visible_on');

                if (pubDB.countPub == 0) {
                    document.getElementById("description").innerHTML += "<br />Ничего не найдено."
                } else {
                    document.getElementById("description").innerHTML += "<br />Найдено " + pubDB.countPub + " публикаций."
                }
            }
        }

        xhrJson.onerror = function(){
            alert('Ошибка соединения.\nВозникла при выполнении Serbet step 3');
        }
    }
}

function parsePub(pub){
    let d = new Date(pub["taken_at_timestamp"] * 1000);
    let month = d.getMonth() + 1;
    let year = d.getFullYear();

    // если год публ-и не соответствует заданному году
    if (mymonth != month) { return; }

    let wrapper = document.createElement('div');
    wrapper.classList.add('wrapper');
    let a = document.createElement('a');
    a.href = 'https://www.instagram.com/p/' + pub['shortcode'] + '/';
    a.target = '_blank';
    a.title = 'Открыть в Instagram'
    a.classList.add('link_to_instagram');
    let img = document.createElement('img');
    img.src = pub['thumbnail_src'];
    img.title = timeConverter(pub["taken_at_timestamp"]);
    img.classList.add('img_preview');
    img.onclick = click_to_post;
    // pubDB.countPub - текущее кол-во постов в базе, 
    // совпадает с индексом поста в ней
    img.dataset.id_post = pubDB.countPub;

    wrapper.append(img);
    wrapper.append(a);

    if (pub['is_video']){
        let video = document.createElement('div');
        video.classList.add('video');
        wrapper.prepend(video);
    }

    if (pub['__typename'] == 'GraphSidecar'){
        let sidecar = document.createElement('div');
        sidecar.classList.add('sidecar');
        wrapper.prepend(sidecar);
    }

    years[year]['domOb'].append(wrapper);

    years[year]['visible'] = true;

    pubDB[pubDB.countPub] = pub;
    pubDB.countPub++;
}

function refresh_visible_years() {
    for (let i = start_year; i >= end_year; i--) {
        if (years[i].visible) {
            if ( ! years[i].domOb.classList.value.match('visible') ) {
                years[i]['domOb'].classList.add('visible');
            }
        }
    }
}

function timeConverter(UNIX_timestamp){
    let a = new Date(UNIX_timestamp * 1000);
    let year = a.getFullYear();
    let month = getMonthRus(a.getMonth() + 1);
    let date = a.getDate();
    let fullDate = date + ' ' + month + ' ' + year;
    return fullDate;

    function getMonthRus(num) {
        switch (num) {
            case 1: return 'января';
            case 2: return "февраля";
            case 3: return "марта";
            case 4: return "апреля";
            case 5: return "мая";
            case 6: return "июня";
            case 7: return "июля";
            case 8: return "августа";
            case 9: return "сентября";
            case 10: return "октября";
            case 11: return "ноября";
            case 12: return "декабря";
        }
    }
}

function getCountPubAll(doc_str) {
    if ( t = doc_str.match(/edge_owner_to_timeline_media":{"count":([0-9]{1,}),"page_info/) )
    {
        return t[1];
    }

    return "неизвестное количество";
}

function getMonthRusPrilog(month) {
    month = parseInt(month);

    switch (month) {
        case 1: return "январские";
        case 2: return "февральские";
        case 3: return "мартовские";
        case 4: return "апрельские";
        case 5: return "майские";
        case 6: return "июньские";
        case 7: return "июльские";
        case 8: return "августовские";
        case 9: return "сентябрьские";
        case 10: return "октябрьские";
        case 11: return "ноябрьские";
        case 12: return "декабрьские";
        default: return "неизвестный месяц";
    }
}

function initYears() {
    let tmp_years = {};

    for (let i = start_year; i >= end_year; i--) {
        let t = createYear(i);
        if (t) {
            document.getElementById("mainBox").append(t);
            tmp_years[i] = {'visible': false, 'domOb': t}
        }
    }
    function createYear(year) {
        let y = document.createElement('div');
        y.classList.add('year');
        // y.id = year;
        let h = document.createElement('h3');
        h.innerHTML = year;
        y.append(h);
        return y;
    }

    return tmp_years;
}

init();
