function download_media(post_id, sidecar_id) {
    console.log('Start download post_id: ' + post_id + ', sidecar_id: ' + sidecar_id)

    let pub = pubDB[post_id];

    if ( ! pub ) return;

    let url, is_video;
    // let url, is_video,  taken_at_timestamp;
    // taken_at_timestamp = pub.taken_at_timestamp;

    if (pub.__typename == 'GraphSidecar') {
        let s = pub.edge_sidecar_to_children.edges[sidecar_id];
        if (s) { 
            pub = s.node; 
        } else {
            return;
        }
    } 

    is_video = pub.is_video;

    url = pub.video_url || pub.display_url;

    console.log('url = ' + url);
    // console.log("taken_at_timestamp = " + taken_at_timestamp)
    console.log("is_video = " + is_video)

    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'arraybuffer';

    xhr.onerror = () => {
        console.log('Ошибка соединения.')
        alert('Ошибка соединения.')
    }

    xhr.onload = () => {
        if (xhr.status != 200) {
            // обработать ошибку
            console.log("Ошибка. Ответ сервера: " + xhr.status);
            alert("Ошибка. Ответ сервера: " + xhr.status);
            return;
        }

        // Create a binary string from the returned data, then encode it as a data URL.
        let uInt8Array = new Uint8Array(xhr.response);
        let i = uInt8Array.length;
        let binaryString = new Array(i);
        while (i--) {
            binaryString[i] = String.fromCharCode(uInt8Array[i]);
        }
        let data = binaryString.join('');
        let base64 = window.btoa(data);
        
        let tag_a = document.createElement('a');
        tag_a.href = (is_video) ? 'data:video/mp4;base64,' : 'data:image/jpeg;base64,';
        tag_a.href += base64;
        // tag_a.download = timeConverter('', '') + '-' + username + url.match('(_[0-9]{1,}_n).')[1];
        tag_a.download = username + url.match('(_[0-9]{1,}_n).')[1];
        tag_a.download += (is_video) ? '.mp4' : '.jpg'

        console.log(tag_a);
        tag_a.click();
    }

    xhr.send();
}
