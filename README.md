![Project CI](https://github.com/trip-companion/app/workflows/Project%20CI/badge.svg?branch=master)
[![codecov](https://codecov.io/gh/trip-companion/app/branch/master/graph/badge.svg?token=lIzJjepNeC)](https://codecov.io/gh/trip-companion/app)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=trip-companion_app&metric=alert_status)](https://sonarcloud.io/dashboard?id=trip-companion_app)

## Backend server
###### At least Java 11 requeired to run backend server
##### Actions to start DEV server from root directory:
1. cd backend
2. Run command 'gradlew clean bootRunDev'
### Test credentials
Login: testUser@gmail.com

Password: 12345678

### API Documentation
Swagger documentation is available by path /swagger-ui.html

By default, documentation may be retrieved by url http://localhost:9000/swagger-ui.html

## Frontend
###### Requirements: [Node: 14+](https://nodejs.org/en/), [Angular CLI: 11.0.4+](https://cli.angular.io/)

### Start frontend
```bash

# change directory to our repo
cd frontend

# install the repo with npm
npm install

# run Development server
ng serve

#run dev with ssr
npm run dev:ssr

# production Build with ssr
npm run build:ssr

# run prod Build on server
npm run serve:ssr

```

### Package in production front(Angular): 
```
    "@angular/animations": "11.0.3",
    "@angular/cdk": "^11.1.1",
    "@angular/common": "11.0.3",
    "@angular/compiler": "11.0.3",
    "@angular/core": "11.0.3",
    "@angular/forms": "11.0.3",
    "@angular/material": "^11.1.1",
    "@angular/material-moment-adapter": "^11.1.1",
    "@angular/platform-browser": "11.0.3",
    "@angular/platform-browser-dynamic": "11.0.3",
    "@angular/platform-server": "11.0.3",
    "@angular/router": "11.0.3",
    "@ngrx/effects": "^10.1.2",
    "@ngrx/store": "^10.1.2",
    "@nguniversal/express-engine": "11.0.1",
    "cors": "^2.8.5",
    "express": "4.17.1",
    "moment": "^2.29.1",
    "ngx-device-detector": "^2.0.5",
    "rxjs": "6.6.3",
    "tslib": "2.0.3",
    "xml-js": "^1.6.11",
    "zone.js": "0.11.3"
```
### Package in dev front(Angular): 
```
    "@angular-devkit/build-angular": "0.1100.3",
    "@angular-eslint/builder": "1.2.0",
    "@angular-eslint/eslint-plugin": "1.2.0",
    "@angular-eslint/eslint-plugin-template": "1.2.0",
    "@angular-eslint/schematics": "1.2.0",
    "@angular-eslint/template-parser": "1.2.0",
    "@angular/cli": "^11.2.4",
    "@angular/compiler-cli": "11.0.3",
    "@nguniversal/builders": "11.0.1",
    "@types/express": "4.17.9",
    "@types/jasmine": "3.6.2",
    "@types/node": "14.14.10",
    "@typescript-eslint/eslint-plugin": "4.3.0",
    "@typescript-eslint/parser": "4.3.0",
    "codelyzer": "6.0.1",
    "eslint": "^7.6.0",
    "eslint-plugin-import": "2.22.1",
    "eslint-plugin-jsdoc": "30.7.6",
    "eslint-plugin-prefer-arrow": "1.2.2",
    "jasmine-core": "3.6.0",
    "jasmine-spec-reporter": "6.0.0",
    "karma": "5.2.3",
    "karma-chrome-launcher": "^3.1.0",
    "karma-coverage": "2.0.3",
    "karma-jasmine": "4.0.1",
    "karma-jasmine-html-reporter": "1.5.4",
    "karma-phantomjs-launcher": "^1.0.4",
    "protractor": "7.0.0",
    "ts-node": "9.1.0",
    "typescript": "4.0.5"
```

### Build file Structure
```
dist/
 ├── browser/
 |    ├─ assets/                * assets folder
 |    |
 |    ├─ index.html
 |    ├─ runtime.###.js
 |    ├─ polyfills.###.js       
 |    ├─ main.###.js
 |    ├─ styles.###.css
 |    ├─ robots.txt
 |    ├─ sitemap.xml
 |    |
 |    └─ favicon.ico
 |
 ├── server/
 |     └─  main.js
 |     └─  **-module.js         *front module file for node ssr
```

### schema URL

```bash
# HOST/?lang/?page/

# localization included in the layout routing configuration
#   NAME      URL FRAGMENT
    EN       "/"
    UA       "ua/"
    RU       "ru/"   

```

### sitemap script update

```bash
# command: "npm run update-sitemap" (run auto when use "npm run build:ssr")
# script which updates the sitemap.xml.
#   set host site
    hostFront = https://mysite.com
#   need set all url in site. Without core.
    appUrls = [
        'create-travel/',
        'faq/',
        'login/',
        'sign-up/',
        'create-travel/',
    ];
#   need set all available language rout in front.
    availableLanguages = [
        '/',
        '/ua/',
        '/ru/'
    ];

```

## Concurrently runner for project
###### Requirements: [install concurrently global](https://www.npmjs.com/package/concurrently#install)

### Start whole project
```bash

# Attention! If it's your first run of project or front packages changed run this command:
linux OS systems: npm run start_with_install-lin
windows OS: npm run start_with_install-win
# PS: This command install npm packages of front, after up dev build. Parallels we run backend with command 'gradlew clean bootRunDev'


# usually run(run front and backend server)
linux OS systems: npm run start-lin
windows OS: npm run start-win

```