let current_post = {post_id: 0, sidecar_id: 0}

click_to_post = function() {
    let id_post = parseInt(this.dataset.id_post);
    view_observer(id_post, 0);
}

function view_observer(post_id, sidecar_id) {
    console.log('view post_id: ' + post_id + ', sidecar_id: ' + sidecar_id)

    let observer = document.querySelector('.observer');
    observer.classList.remove('hidden')

    let pub = pubDB[post_id];

    if ( ! pub ) return;

    if (pub.__typename == 'GraphSidecar') {
        let s = pub.edge_sidecar_to_children.edges[sidecar_id];
        if (s) { 
            s = s.node; 
        } else {
            return;
        }

        if (s.is_video) {
            document.querySelector('img.media').classList.add('hidden');
            let video = document.querySelector('video.media');
            video.src = s.video_url;
            video.classList.remove('hidden')
        } else {
            // document.querySelector('video.media').classList.add('hidden');
            hide_video();
            let img = document.querySelector('img.media');
            img.src = s.display_url;
            img.classList.remove('hidden')
        }

        let sidecar_title = document.querySelector('.sidecar_title');
        sidecar_title.classList.remove('hidden');
        sidecar_title.innerHTML = sidecar_id + 1 + ' из ' + pub.edge_sidecar_to_children.edges.length;

        // скрыть/показать кнопки
        if (pub.edge_sidecar_to_children.edges[sidecar_id - 1]) {
            document.querySelector('.sidecar_previous').classList.remove('hidden_btn');
        } else {
            document.querySelector('.sidecar_previous').classList.add('hidden_btn');
        }

        if (pub.edge_sidecar_to_children.edges[sidecar_id + 1]) {
            document.querySelector('.sidecar_next').classList.remove('hidden_btn');
        } else {
            document.querySelector('.sidecar_next').classList.add('hidden_btn');
        }
        // -------------------

    } else {
        // если ошибочно нажали вверх/вниз
        if (sidecar_id != 0) { return }

        if (pub.is_video) {
            document.querySelector('img.media').classList.add('hidden');
            let video = document.querySelector('video.media');
            video.src = pub.video_url;
            video.classList.remove('hidden');
        } else {
            // document.querySelector('video.media').classList.add('hidden');
            hide_video();
            let img = document.querySelector('img.media');
            img.src = pub.display_url;
            img.classList.remove('hidden');
        }

        document.querySelector('.sidecar_previous').classList.add('hidden_btn');
        document.querySelector('.sidecar_next').classList.add('hidden_btn');
        document.querySelector('.sidecar_title').classList.add('hidden');
    }

    // скрыть/показать кнопки
    if (pubDB[post_id - 1]) {
        document.querySelector('.previous').classList.remove('hidden_btn');
    } else {
        document.querySelector('.previous').classList.add('hidden_btn');
    }

    if (pubDB[post_id + 1]) {
        document.querySelector('.next').classList.remove('hidden_btn');
    } else {
        document.querySelector('.next').classList.add('hidden_btn');
    }
    // -------------------

    // показываем дату публикации
    document.querySelector('.observer_date').innerHTML = timeConverter(pub["taken_at_timestamp"]);

    // -------------------

    current_post.post_id = post_id;
    current_post.sidecar_id = sidecar_id;

    console.log('ok')
}

function init_observer() {
    document.querySelector('.previous').onclick = previous;

    document.querySelector('.next').onclick = next;

    document.querySelector('.sidecar_previous').onclick = sidecar_previous;

    document.querySelector('.sidecar_next').onclick = sidecar_next;

    document.querySelector('.close').onclick = close;
    
    document.querySelector('.observer').onclick = click_to_free_space;

    document.body.addEventListener('keydown', function (e) {
        if (document.querySelector('.observer').classList.value.match('hidden')) { return; }

        switch (e.code) {
            // если нажали Esc
            case 'Escape': { close(); return; }
            // left
            case 'ArrowLeft': { previous(); e.preventDefault(); return; }
            // up
            case 'ArrowUp': { sidecar_next(); e.preventDefault(); return; }
            // right
            case 'ArrowRight': { next(); e.preventDefault(); return; }
            // down
            case 'ArrowDown': { sidecar_previous(); e.preventDefault(); return; }
            // 0 на numpade
            case 'Numpad0':
            // пробел
            case 'Space': { play_pause_video(); e.preventDefault(); return; }
            // F
            case 'KeyF': { fullscreen_video(); return; }
        }

        // console.log(e.keyCode)
    });

    // постоянно убирать фокус с video
    document.querySelector('video.media').onfocus = function() { this.blur(); }
}

function previous() {
    view_observer(current_post.post_id - 1, 0);
}

function next() {
    view_observer(current_post.post_id + 1, 0);
}

function sidecar_previous() {
    view_observer(current_post.post_id, current_post.sidecar_id - 1);
}

function sidecar_next() {
    view_observer(current_post.post_id, current_post.sidecar_id + 1);
}

function close() {
    let observer = document.querySelector('.observer');
    observer.classList.add('hidden')

    hide_video()
}

function click_to_free_space(e) {
    target = e.target;

    if (target.classList.value.match('observer')) {
        close();
    }
}

function play_pause_video() {
    let video = document.querySelector('video.media');
    if ( video.classList.value.match('hidden') ) { return }

    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
}

function fullscreen_video() {
    let video = document.querySelector('video.media');
    if ( video.classList.value.match('hidden') ) { return }

    if (document.fullscreen) {
        document.exitFullscreen();
    } else {
        video.requestFullscreen();
    }
}

function hide_video() {
    let video = document.querySelector('video.media');
    video.classList.add('hidden');

    video.src = '';
}

init_observer()