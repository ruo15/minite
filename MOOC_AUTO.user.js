// ==UserScript==
// @name         MOOC_AUTO
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  play mooc videos
// @author       Rika
// @match        http://tsinghua.xuetangx.com/courses/*
// @grant        none
// ==/UserScript==


let video;
let code = setInterval(function () {
    const a_tags = $('a[href^="' + location.pathname.split('courseware')[0] + 'courseware/"]');
    if (a_tags.length === 0) return;
    // const now_a_tag = $('a[href="' + location.pathname + '"]');

    if ((video = $('video')).length === 0) {
        if ($('.seq_video').length === 0) {
            for (let i = 0; i < a_tags.length; i++)
                if (a_tags[i].href === location.toString()) {
                    $(a_tags[i + 1]).click();
                    break;
                }
            return;
        }
        else
            return;
    }
    clearInterval(code);
    console.log(video);
    $('.xt_video_player_quality ul li').click()
    video[0].playbackRate = 10;
    video[0].autoplay = true;
    video[0].oncanplay = function () {
        const play_btn = $('.xt_video_player_play_btn');
        if (!play_btn.hasClass('xt_video_player_play_btn_pause'))
            play_btn.click();

    };
    video[0].onended = function () {
        const next_button = $('li.next a');
        if (!next_button.hasClass('disabled'))
            next_button.click();
        else {
            for (let i = 0; i < a_tags.length; i++)
                if (a_tags[i].href === location.toString()) {
                    $(a_tags[i + 1]).click();
                    break;
                }
        }
    };
}, 1000);