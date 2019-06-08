(() => {
    let wsStatus = document.getElementsByClassName('ws-status')[0];
    let tags = document.getElementsByClassName('tags')[0];
    let logs = document.getElementsByClassName('logs')[0];

    let tagElement = tag => {
        let el = document.createElement('li');
        el.classList.add('tag');

        el.classList.add('tag-' + tag.id);
        el.classList.add(tag.present_status === 1 ? 'present' : 'absent');
        
        let name = document.createElement('div');
        name.classList.add('name');

        let fname = document.createElement('span');
        fname.classList.add('fname');
        fname.innerHTML = tag.first_name;

        let lname = document.createElement('span');
        lname.classList.add('lname');
        lname.innerHTML = tag.last_name;
        
        name.append(fname);
        name.append(lname);

        el.append(name);

        return el;
    };

    let logElement = log => {
        let el = document.createElement('tr');
        el.classList.add('log');

        let name = document.createElement('td');
        let time = document.createElement('td');
        let dir  = document.createElement('td');

        name.innerHTML = (log.first_name || '') + ' ' + log.last_name;
        time.innerHTML = new Date(Date.parse(log.time)).toLocaleString();
        dir.innerHTML = log.direction === 1 ? "IN" : "OUT";

        el.append(name);
        el.append(time);
        el.append(dir);

        return el;
    };

    let loadTags = () => {
        fetch('http://' + config.wiattendServerUrl + '/tags')
        .then(res => res.json())
        .then(json => json.data.forEach(tag => tags.append(tagElement(tag))));
    };

    let loadLogs = () => {
        let _logs = logs.getElementsByClassName('log');

        while(_logs.length > 0) {
            _logs[0].parentNode.removeChild(_logs[0]);
        }

        fetch('http://' + config.wiattendServerUrl + '/logs')
        .then(res => res.json())
        .then(json => json.data.forEach(log => logs.append(logElement(log))));
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

            let loggedTag = tags.getElementsByClassName('tag-' + tag.id)[0];

            loggedTag.classList.remove('present');
            loggedTag.classList.remove('absent');
            loggedTag.classList.add(tag.next_direction === 1 ? 'present' : 'absent');
            loggedTag.classList.add('animated');
            loggedTag.classList.add(config.tagAnimateCssEffect);

            loadLogs();
            
            setTimeout(() => {
                loggedTag.classList.remove('animated');
                loggedTag.classList.remove(config.tagAnimateCssEffect);
            }, 1500);
        }
    };

    loadTags();
    loadLogs();
})();