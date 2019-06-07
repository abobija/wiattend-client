(() => {
    let wsStatus = document.getElementsByClassName('ws-status')[0];
    let $tags = $('.tags');

    let tagElement = tag => {
        let el = document.createElement('li');
        el.classList.add('tag');

        el.id = 'tag-' + tag.id;
        el.classList.add(tag.present_status === 1 ? 'present' : 'absent');
        
        let name = document.createElement('div');
        name.classList.add('name');

        let fname = document.createElement('span');
        fname.classList.add('fname');
        fname.innerHTML = tag.first_name;

        let lname = document.createElement('span');
        lname.classList.add('lname');
        lname.innerHTML = tag.last_name;
        
        name.appendChild(fname);
        name.appendChild(lname);

        el.appendChild(name);

        let uid = document.createElement('div');
        uid.classList.add('uid');
        uid.innerHTML = tag.uid;

        el.appendChild(uid);

        return el;
    };

    let ws = new WebSocket('ws://' + config.wiattendServerUrl);

    ws.onopen = () => {
        wsStatus.classList.remove('closed');
        wsStatus.classList.add('opened');
        wsStatus.getElementsByClassName('title')[0].innerHTML = config.wiattendServerUrl + ' Connected';
    };

    ws.onclose = () => {
        wsStatus.classList.remove('opened');
        wsStatus.classList.add('closed');
        wsStatus.getElementsByClassName('title')[0].innerHTML = config.wiattendServerUrl + ' Disconnected';
    };

    ws.onmessage = e => {
        let msg = JSON.parse(e.data);

        if(msg.event === 'logged') {
            let tag = msg.data;

            let $loggedTag = $tags.find('[id="tag-' + tag.id + '"]')
                .removeClass('present').removeClass('absent')
                .addClass(tag.next_direction === 1 ? 'present' : 'absent')
                .addClass('animated ' + config.tagAnimateCssEffect);
            
            setTimeout(() => $loggedTag.removeClass('animated')
                .removeClass(config.tagAnimateCssEffect), 1500);
        }
    };

    fetch('http://' + config.wiattendServerUrl + '/tags')
        .then(res => res.json())
        .then(json => json.data.forEach(tag => $tags.append(tagElement(tag))));
})();