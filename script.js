$(document).ready(() => {
    let wsStatus = document.getElementsByClassName('ws-status')[0];
    let $tags = $('.tags');

    let $tag = tag => $('<li />')
        .addClass('tag')
        .attr('id', 'tag-' + tag.id)
        .append(
            $('<div />').addClass('name')
            .append($('<span />').addClass('fname').append(tag.first_name))
            .append($('<span />').addClass('lname').append(tag.last_name))
        )
        .append($('<div />').addClass('uid').append(tag.uid))
        .addClass(tag.present_status === 1 ? 'present' : 'absent');

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
        .then(json => json.data.forEach(tag => $tags.append($tag(tag))));
});