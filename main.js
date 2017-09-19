"use strict";

const rarbgURL = 'https://rarbg.is/download.php?';
const dyttURL = 'http://www.dytt8.net';
const rarbgHosts = [
    {host: 'https://rarbgmirror.com', response: 9999},
    {host: 'https://rarbg.is', response: 9999},
    {host: 'https://rarbg.to', response: 9999}
    //{host: 'https://rarbgunblock.com', response: 9999},
    //{host: 'http://rarbgs.com', response: 9999},
    //{host: 'http://rarbg4-to.unblocked.lol', response: 9999},
    //{host: 'https://rarbg.unblocked.bet', response: 9999},
    //{host: 'http://rarbg-to.pbproxy.red', response: 9999},
    //{host: 'https://rarbg.unblocked.cool', response: 9999},
    //{host: 'https://rarbg.unblockall.org', response: 9999}
];
var rarbgResponsed = false;
var currentRarbgHost = null;

function getValidRarbgHost(success) {
    console.log(rarbgHosts);
    for (const item of rarbgHosts) {
        //const url = item.host + '/index8.php';
        const url = item.host;
        const start_time = new Date().getTime();
        getAsyncHTML(url,
        (data) => {
            if (rarbgResponsed) {
                return;
            }
            const request_time = new Date().getTime() - start_time;
            item.response = request_time;
            // sort with response time, next time with start with lower response
            rarbgHosts.sort((a, b) => a.response - b.response);
            console.log(item.host, 'responsed', request_time);
            rarbgResponsed = true;
            currentRarbgHost = item.host;
            success();
        },
        (error) => {
            console.log(item.host, error);
        })
    }
}

function getAsyncHTML(url, resolve, reject) {
    $.ajax(url).done(resolve).fail(reject);
}

function getRecommend(success, error) {
    const url = currentRarbgHost + "/torrents.php?category=movies";
    console.log(url);
    getAsyncHTML(url, success, error);
}

function recommendResolve(dataSet) {
    console.log('recommendResolve');
    const newData = dataSet.replace(/<img((?!over_opt).)*(?:>|\/>)/gi,'');
    const jqData = $(newData);

    const $td = jqData.find('td .lista').has('a[href^="/torrent/"] img');

    for (const td of $td) {
        const a = $(td).find('a').eq(0);
        const img = $(td).find('img').eq(0);
        img.attr('src', 'https://' + img.attr('src'));

        const id = $(a).attr('href').match(/\/torrent\/(.*)/)[1];
        const title = $(a).attr('title');

        const downloadURL = rarbgURL + 'id=' + id + '&f=' + title + '-[rarbg.to].torrent';

        const itemHTML = `<div class="img" >
                            <a href="${downloadURL}" alt="${title}" data-balloon="${title}" data-balloon-pos="up">
                                <img src="${img.attr('src')}" border="0" alt="${title}">
                            </a>
                        </div>`;

        $('.recommend').append($(itemHTML));
    }
}

function getTop100(success, error) {
    const url = currentRarbgHost + "/top100.php?category[]=14&category[]=15&category[]=16&category[]=17&category[]=21&category[]=22&category[]=42&category[]=44&category[]=45&category[]=46&category[]=47&category[]=48";
    console.log(url);
    getAsyncHTML(url, success, error);
}

function top100Resolve(dataSet) {
    console.log('top100Resolve');
    const newData = dataSet.replace(/<img.*?(?:>|\/>)/gi,'');
    const jqData = $(newData);

    const trArr = jqData.find('tr.lista2');
    for (const tr of trArr) {
        const tdArr = $(tr).find('td');

        const $a = $(tdArr[1]).find('a').eq(0);
        const title = $a.attr('title');
        const detail = $(tdArr[1]).find('span').eq(1).text();
        const size = $(tdArr[3]).text();

        const id = $a.attr('href').match(/\/torrent\/(.*)/)[1];
        const downloadURL = rarbgURL + 'id=' + id + '&f=' + title + '-[rarbg.to].torrent';

        const itemHTML = `<div class="item">
                            <div class="title">
                                <h3>
                                    <a href="${downloadURL}" alt="${title}">
                                        ${title}
                                    </a>
                                </h3>
                                <span class="size">${size}</span>
                            </div>
                            <div class="detail">
                                ${detail}
                            </div>
                        </div>`;

        $('.top100').append($(itemHTML));
    }
}

function getDyttItem(url) {
    return new Promise(function(resolve, reject) {
        getAsyncHTML(url, resolve, reject);
    });
}
function dyttItemResolve(data) {
    // Remove all images
    const newData = data.replace(/<img.*?(?:>|\/>)/gi,'');
    const jqData = $(newData);

    const title = jqData.find('.bd3r .co_area2 .title_all').text();

    const tempA = jqData.find('a[href^="ftp"]');
    // 转换成迅雷url格式
    const downloadURL = ThunderEncode(tempA.attr('href'));

    const itemHTML = `<div class="item">
                            <div class="title">
                                <h3>
                                    <a href="${downloadURL}" alt="${title}">
                                        ${title}
                                    </a>
                                </h3>
                                <span class="size"></span>
                            </div>
                            <div class="detail"></div>
                        </div>`;

    $('.dytt').append($(itemHTML));
}
function dyttResolve(data) {
    const newData = data.replace('<img', '<noimg');
    const areaArr = $(newData).find('.co_area2');
    for (const area of areaArr) {
        const title = $(area).find('.title_all').text();
        if (title === '最新发布170部影视') {
            const aArr = $(area).find('a');
            // 第一个元素是‘IMDB评分8分以上影片200部' 去掉
            aArr.splice(0, 1);

            for (const a of aArr) {
                setTimeout(function () {
                    const url = dyttURL + a.pathname;
                    getDyttItem(url)
                        .then(dyttItemResolve)
                        .catch(reject);

                }, 500);
            }
        }
    }
}

function getDytt(success, error) {
    const url = "http://www.dytt8.net/";
    getAsyncHTML(url, success, error);
}

function reject(reason) {
    console.log(reason);
}

document.addEventListener('DOMContentLoaded', function() {
    // tab section related
    (function() {
        [].slice.call(document.querySelectorAll('.tabs')).forEach(function(el) {
            new CBPFWTabs(el);
        });
    })();
    // append img logo div
    const imgURL = chrome.extension.getURL("icon.png");
    $('.codrops-logo').append(`<img src="${imgURL}"/>`);

    // 电影天堂
    new Promise((success, error) => getDytt(
        success, error))
        .then(dyttResolve)
        .then(attachRatingEvent4Dytt)
        .catch(reject);
    getValidRarbgHost(() => {
        // rarbg今日推荐
        new Promise((success, error) => getRecommend(
            success, error))
            .then(recommendResolve)
            .catch(reject);
        // rarbg最受欢迎top100
        new Promise((success, error) => getTop100(
            success, error))
            .then(top100Resolve)
            .then(attachRatingEvent)
            .catch(reject);
    })
});
