const fs = require('fs'),
    convert = require('xml-js'),
    moment = require('moment'),
    hostFront = 'http://main.com',
    untrackedUrlsList = [],
    options = { compact: true, ignoreComment: true, spaces: 2};

    //main page need added default in site map(in all avaliableLanguages site)
    const appUrls = [
        'create-travel/',
        'faq/',
        'login/',
        'sign-up/',
        'create-travel/',
    ];
    //default en = '/'
    const availableLanguages = [
        'ua',
        'ru'
    ];
/* 
    Method create list of urls 
*/
const setUrlsList = () => {
    if(appUrls) {
        appUrls.forEach(url => {
            untrackedUrlsList.push(`${hostFront}/${url}`);
            availableLanguages.forEach(lang => untrackedUrlsList.push(`${hostFront}/${lang}/${url}`));
        });
        filterUniqueURLs();
    };
}

/* 
    Method to Filter/Unique already existing URLs and new urls we fetched from DB
*/
const filterUniqueURLs = () => {
    fs.readFile('sitemap.xml', (err, data) => {
        if (data) {
            const existingSitemapList = JSON.parse(convert.xml2json(data, options));
            let existingSitemapURLStringList = [];
            if (existingSitemapList.urlset && existingSitemapList.urlset.url && existingSitemapList.urlset.url.length) {
                existingSitemapURLStringList = existingSitemapList.urlset.url.map(ele => ele.loc._text);
            };
            //save only core site;
            existingSitemapList.urlset.url = existingSitemapList.urlset.url.slice(0, 3);
            
            untrackedUrlsList.forEach(ele => {
                existingSitemapList.urlset.url.push({
                    loc: {
                        _text: ele,
                    },
                    changefreq: {
                        _text: 'monthly'
                    },
                    priority: {
                        _text: 0.8
                    },
                    lastmod: {
                        _text: moment(new Date()).format('YYYY-MM-DD')
                    }
                });
            });
            createSitemapFile(existingSitemapList);
        }
    });
}

/* 
    Method to convert JSON format data into XML format
*/
const createSitemapFile = (list) => {
    const finalXML = convert.json2xml(list, options); // to convert json text to xml text
    saveNewSitemap(finalXML);
}

/* 
    Method to Update sitemap.xml file content
*/
const saveNewSitemap = (xmltext) => {
    fs.writeFile('sitemap.xml', xmltext, (err) => {
        if (err) {
            return console.log(err);
        }

        console.log("Sitemap updated and save");
    });
}

setUrlsList();