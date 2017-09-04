function attachRatingEvent() {
    function createOptions($target) {
        const nameStr = $.trim($target.find('a').text()) ||
            $.trim($target.find('a').attr('alt'));

        const nameYear = TitleParser.parse(nameStr)
        const options = {
            name: nameYear.name,
            year: nameYear.year,
            type: "movie"
        };
        return options;
    }
    listHandle(createOptions, '.rarbag h3, .img');

}
function attachRatingEvent4Dytt() {
    function createOptions($target) {
        const nameStr = $.trim($target.find('a').text());

        const nameReg = /《([^》]+)》/;
        const yearReg = /^\d{4}/;
        const options = {
            name: nameStr.match(nameReg)[1],
            year: nameStr.match(yearReg)[0],
            type: "movie"
        };
        return options;
    }
    listHandle(createOptions, '.dytt h3');
}
function listHandle(createOptions, tag) {
    const modules = [new DoubanInfo(), new IMDBInfo()];
    const common = new Common(modules, createOptions, 'movie');

    common.listHandle(
        /.*/i,
        tag
    );
}
