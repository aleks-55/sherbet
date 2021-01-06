function finishSherbet(log) {
    if (log) {
        console.log(log);
        alert(log);
    }
    document.getElementById("waitingBox").classList.remove('visible_on');
    document.getElementById("refresh_btn").classList.add('visible_on');
}

function parsePub(pub){
    let d = new Date(pub.taken_at_timestamp * 1000);
    let month = d.getMonth() + 1;
    let year = d.getFullYear();

    // если месяц публ-и не соответствует заданному месяцу
    if (mymonth != month) { return; }

    // create HTML ///////////////////////////////////////////////
    let wrapper = document.createElement('div');
    wrapper.classList.add('wrapper');
    let a = document.createElement('a');
    a.href = 'https://www.instagram.com/p/' + pub.shortcode + '/';
    a.target = '_blank';
    a.title = 'Открыть в Instagram'
    a.classList.add('link_to_instagram');
    let img = document.createElement('img');
    img.src = pub.thumbnail_src;
    img.title = timeConverter(pub.taken_at_timestamp);
    img.classList.add('img_preview');
    img.onclick = click_to_post;
    // pubDB.countPub - текущее кол-во постов в базе, 
    // совпадает с индексом поста в ней
    img.dataset.id_post = pubDB.countPub;

    wrapper.append(img);
    wrapper.append(a);

    if (pub.is_video){
        let video = document.createElement('div');
        video.classList.add('video');
        wrapper.prepend(video);
    }

    if (pub.__typename == 'GraphSidecar'){
        let sidecar = document.createElement('div');
        sidecar.classList.add('sidecar');
        wrapper.prepend(sidecar);
    }
    // end create HTML ///////////////////////////////////////////

    years[year].domOb.append(wrapper);
    years[year].visible = true;

    pubDB[pubDB.countPub] = pub;
    pubDB.countPub++;
}

function refresh_visible_years() {
    for (let i = start_year; i >= end_year; i--) {
        if (years[i].visible) {
            years[i].domOb.classList.add('visible');
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
}

function getMonthRus(num_month) {
    num_month = parseInt(num_month);

    switch (num_month) {
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
        default: return "неизвестный месяц";
    }
}

function getMonthRusPrilog(num_month) {
    num_month = parseInt(num_month);

    switch (num_month) {
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

    let _mainBox = document.getElementById("mainBox");
    for (let i = start_year; i >= end_year; i--) {
        let t = createYear(i);
        if (t) {
            _mainBox.append(t);
            tmp_years[i] = {'visible': false, 'domOb': t}
        }
    }

    function createYear(year) {
        let y = document.createElement('div');
        y.classList.add('year');
        let h = document.createElement('h3');
        h.innerHTML = year;
        y.append(h);
        return y;
    }

    return tmp_years;
}

// Функция ищет в скриптах, переданного ей документа, шаблон.
// Первый же найденный результат передается в виде массива (Array)
function getScript(_document, pattern) {
    var elem = _document.scripts;
    if (!elem[0]) { return; }  // end execution if not found

    for (var i = 0, len = elem.length; i < len ; i++) {
        var m = elem[i].textContent.match(pattern);
        if(m) { return m; }
    }
}
