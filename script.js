$(document).ready(() => {
    let $wsStatus = $('.ws-status');
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

    ws.onopen = () => { $wsStatus.removeClass('closed').addClass('opened').find('.title').html('Connected'); };
    ws.onclose = () => { $wsStatus.removeClass('opened').addClass('closed').find('.title').html('Disconnected'); };

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

    $.getJSON('http://' + config.wiattendServerUrl + '/tags', res => {
        res.data.forEach(tag => $tags.append($tag(tag)));
    });
});