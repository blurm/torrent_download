const rarbgURL = 'https://rarbg.is/download.php?'

function getSyncHTML(url) {
    return $.ajax({
        url: url,
        async: false
    }).responseText;
}

function getAsyncHTML(url, resolve, reject) {
    $.ajax(url).done(resolve).fail(reject);
}


function getRecommend(success, error) {
    const url = "https://rarbg.is/torrents.php?category=movies";
    getAsyncHTML(url, success, error);
}

function recommendResolve(dataSet) {
    $('.recommend').empty();
    const $td = $(dataSet).find('td .lista').has('a[href^="/torrent/"] img');

    for (const td of $td) {
        const a = $(td).find('a').eq(0);
        const img = $(td).find('img').eq(0);
        img.attr('src', 'https://' + img.attr('src'));

        const id = $(a).attr('href').match(/\/torrent\/(.*)/)[1];
        const title = $(a).attr('title');

        let downloadURL = rarbgURL + 'id=' + id + '&f=' + title + '-[rarbg.to].torrent'

        let itemHTML = `<div class="img">
                            <a href="${downloadURL}" alt="${title}">
                                <img src="${img.attr('src')}" border="0" alt="${title}">
                            </a>
                        </div>`;

        $('.recommend').append($(itemHTML));
    }
}

function reject(reason) {
    console.log(reason);
}

function top100Resolve(dataSet) {
    $('.top100').empty();
    const trArr = $(dataSet).find('tr.lista2');
    for (const tr of trArr) {
        const tdArr = $(tr).find('td');

        const $a = $(tdArr[1]).find('a').eq(0);
        const title = $a.attr('title');
        const href = $a.attr('href');
        const detail = $(tdArr[1]).find('span').eq(1).text();
        const size = $(tdArr[3]).text();

        const id = $a.attr('href').match(/\/torrent\/(.*)/)[1];
        let downloadURL = rarbgURL + 'id=' + id + '&f=' + title + '-[rarbg.to].torrent'

        let itemHTML = `<div class="item">
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

function getTop100(success, error) {
    const url = 'https://rarbg.is/top100.php?category[]=14&category[]=15&category[]=16&category[]=17&category[]=21&category[]=22&category[]=42&category[]=44&category[]=45&category[]=46&category[]=47&category[]=48';
    getAsyncHTML(url, success, error);
}

function dyttResolve(data) {
    const aArr = $(data).find('.co_content8 b a')
    const dyttURL = 'http://www.dytt8.net';
    for (const a of aArr) {
        const href = $(a).attr('href');
        const itemURL = dyttURL + href;
        const $itemHTML = $(getSyncHTML(itemURL));
        const tempA = $itemHTML.find('a[href^="ftp"]');

        const title = $(a).text();
        const downloadURL = tempA.attr('href');


        let itemHTML = `<div class="item">
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

}

function getDytt(success, error) {
    const url = "http://www.dytt8.net/html/gndy/dyzz/index.html";
    getAsyncHTML(url, success, error);
}


document.addEventListener('DOMContentLoaded', function() {
    // tab section related
    (function() {
        [].slice.call( document.querySelectorAll( '.tabs' ) ).forEach( function( el ) {
            new CBPFWTabs( el );
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
    // rarbg今日推荐
    new Promise((success, error) => getRecommend(
        success, error))
        .then(recommendResolve)
        .catch(reject);
    // rarbg最受欢迎top100
    new Promise((success, error) => getTop100(
        success, error))
        .then(top100Resolve)
        .then(attachRatingEvent())
        .catch(reject);
});
