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

    // При запуске взять все знаения из hash
    let inputParams = getParameters();
    if (! checkParams(inputParams)) {
        alert('Неверно заданы параметры в адресной строке.')
    }

    // получаем username
    username = inputParams.user;

    // поставим title на нашу страницу-скрипт
    document.title = decodeURI(inputParams.title) + ' • ' + document.title;

    document.getElementById('_username').innerHTML = 
        '<a href="https://www.instagram.com/' + username + '/" target="_blank" >@' + username + '</a>';
    document.getElementById('countPubAll').innerHTML = inputParams.countPostAll;

    // нажатие на кнопку "Новый поиск"
    document.getElementById("refresh_btn").onclick = function() {
        document.getElementById("mainBox").innerHTML = '';
        document.getElementById("description").classList.remove('visible_on');
        // показываем форму
        document.getElementById("mainForm").classList.remove('visible_off');
        document.getElementById("refresh_btn").classList.remove('visible_on');
        
        years = initYears();
        pubDB = { 'countPub': 0 };
        count_all_get_posts = 0;
    }

    // "отправка" формы
    document.querySelector('#mainForm > button').onclick = function() {
        // получаем номер месяца
        mymonth = document.getElementById("month_selector").value;

        // скрываем всю форму
        document.getElementById("mainForm").classList.add('visible_off');
        // показываем крутящуюся шестеренку
        document.getElementById("waitingBox").classList.add('visible_on');

        // готовим блок description
        document.getElementById('mountRusPrilog').innerHTML = getMonthRusPrilog(mymonth);
        document.getElementById("_countPub").innerHTML = pubDB.countPub;
        document.getElementById('description').classList.add('visible_on');

        // id канала из страницы пользователя
        let chId = inputParams.chId;
        // на каком посте закончился посл. из сделанных запроров requestPosts
        let after = '';
        // по сколько постов запрашивать? в requestPosts
        let countPost = 50;
        // берется из js-файла
        //let query_hash = 'e769aa130647d2354c40ea6a439bfc08'; // с начала 2020
        let query_hash = '003056d32c2554def87228bc3fd9668a'; // с 07.02.2021

        requestPosts(chId, after, countPost, query_hash);
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

init();
