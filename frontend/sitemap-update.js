const fs = require('fs'),
    convert = require('xml-js'),
    moment = require('moment'),
    hostFront = 'http://ec2-3-17-207-35.us-east-2.compute.amazonaws.com:4000',
    untrackedUrlsList = [],
    options = { compact: true, ignoreComment: true, spaces: 2},
    appUrls = [
        'create-travel/',
        'faq/',
    ],
    availableLanguages = [
        '/',
        '/ua/',
        '/ru/'
    ];

    const setUrlsList = () => {
        if(appUrls) {
            appUrls.forEach(url => {
                availableLanguages.forEach(lang => untrackedUrlsList.push(`${hostFront}${lang}${url}`));
            });
        };
        setNewURLs();
    }

    const setNewURLs = () => {
        fs.readFile('sitemap.xml', (err, data) => {
            if (data) {
                const existingSitemapList = JSON.parse(convert.xml2json(data, options));
                existingSitemapList.urlset.url = [];
                setMainUrl(existingSitemapList.urlset.url);
                
                const unicUrlsList = untrackedUrlsList.reverse().filter((e, i, untrackedUrlsList) => untrackedUrlsList.indexOf(e, i+1) === -1).reverse();

                unicUrlsList.forEach(ele => {
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
            } else if(err) {
                console.log('Error when filter unique urls: ', err)
            }
        });
    }


    const setMainUrl = (url) => {
        availableLanguages.map(langName =>  {
            url.push({
                loc: {
                    _text: hostFront + langName
                },
                changefreq: {
                    _text: 'hourly'
                },
                priority: {
                    _text: 1
                },
                lastmod: {
                    _text: moment(new Date()).format('YYYY-MM-DD')
                }
            })
        });
    }


    const createSitemapFile = (list) => {
        const finalXML = convert.json2xml(list, options);
        saveNewSitemap(finalXML);
    }


    const saveNewSitemap = (xmltext) => {
        fs.writeFile('sitemap.xml', xmltext, (err) => {
            if (err) {
                return console.log(err);
            }

            console.log("Sitemap updated and save");
        });
    }

setUrlsList();