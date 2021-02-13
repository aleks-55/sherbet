let username = "";
let mymonth = '';

let start_year = (new Date).getFullYear();
let end_year = 2010;

// Содержимое years:
// {2020: {visible: false, domOb: div.year}, 2019: {visible: false, domOb: div.year}}
let years = {};

click_to_post = function() {};

// база нужных публикаций
let pubDB = { 'countPub': 0 };

// данные О СКОЛЬКИХ публикациях получили (в requestPosts)
let count_all_get_posts = 0;

function init() {
    document.getElementById("month_selector").value = (new Date).getMonth() + 1;

    // При запуске подставить значение hash в строку inputUser
    document.getElementById("inputUser").value = (! location.hash) ? '' : location.hash.substring(1);

    // нажатие на кнопку "Новый поиск"
    document.getElementById("refresh_btn").onclick = function() {
        document.getElementById("mainBox").innerHTML = '';
        document.getElementById("description").classList.remove('visible_on');
        // показываем форму
        document.getElementById("mainForm").classList.remove('visible_off');
        document.getElementById("refresh_btn").classList.remove('visible_on');
        
        years = initYears();
        pubDB = { 'countPub': 0 };
        username = '';
        location.hash = '';
        document.title = "Sherbet"
        count_all_get_posts = 0;
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
                console.log("Неправильно введен username или ссылка на страницу пользователя.");
                alert("Неправильно введен username или ссылка на страницу пользователя.");
                // чтоб не перезагружалась страница
                return false;
            }
        }

        // получаем номер месяца
        mymonth = document.getElementById("month_selector").value;
        // скрываем всю форму
        this.classList.add('visible_off');

        location.hash = username;
        
        // показываем крутящуюся шестеренку
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
    // на каком посте закончился посл. из сделанных запроров requestPosts
    let after = '';
    // по сколько постов запрашивать? в requestPosts
    let countPost = 50;
    // берется из js-файла
    //let query_hash = 'e769aa130647d2354c40ea6a439bfc08'; // с начала 2020
    let query_hash = '003056d32c2554def87228bc3fd9668a'; // с 07.02.2021

    // получим страницу пользователя (канала)
    let xhrUserPage = new XMLHttpRequest();
    xhrUserPage.open('GET', urlUserPage);
    xhrUserPage.send();

    xhrUserPage.onerror = function(){
        finishSherbet('Ошибка соединения.\nВозникла при загрузке страницы пользователя');
    }

    xhrUserPage.onload = function() {
        if (xhrUserPage.status != 200) {
            // обработать ошибку
            finishSherbet("Ошибка при запросе страницы пользователя.\nОтвет сервера: " + xhrUserPage.status);
            return;
        }
    
        // преобразуем ответ в DOM-объект
        let doc  = new DOMParser().parseFromString(xhrUserPage.responseText, 'text/html');

        // теперь извлечем id канала из страницы пользователя
        let jsonUserPage;
        try {
            let json_str = getScript(doc, 'window._sharedData = ({.+});');
            json_str = json_str ? json_str[1] : 0;
            jsonUserPage = JSON.parse(json_str);
            chId = jsonUserPage.entry_data.ProfilePage[0].graphql.user.id;
        } catch {
            finishSherbet('Ошибка: не смогли извлечь id канала из страниы пользователя.');
            return;
        }

        // поставим title на нашу страницу-скрипт
        document.title = doc.title.split(' • ')[0] + ' • ' + document.title;

        // готовим блок description
        document.getElementById('_username').innerHTML = 
            '<a href="' + urlUserPage + '" target="_blank" >' + username + '</a>';
        document.getElementById('countPubAll').innerHTML = 
            jsonUserPage.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.count;
        document.getElementById('mountRusPrilog').innerHTML = getMonthRusPrilog(mymonth);
        document.getElementById("_countPub").innerHTML = pubDB.countPub;
        document.getElementById('description').classList.add('visible_on');

        requestPosts(chId, after, countPost, query_hash);
    }
}

init();
