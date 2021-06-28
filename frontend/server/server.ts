import 'zone.js/dist/zone-node';

const cors = require('cors');
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';
import { Url } from 'url';
const bodyParser = require('body-parser');
const URL = require('url');

import { AppServerModule } from '../src/main.server';
import { existsSync } from 'fs';

import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';
import { ValueProvider } from '@angular/core';
require("dotenv").config();
import { connectMongooseDB } from './db';
//routes for API  START
import placeSearch from './routes/placeSearch';
//routes for API  END

function normalizeUrl(url: string): string {
  const replacedUrl: string = `${url}/`.replace(/\/{2,}/g, '/').replace(/:\//, '://');
  return /\?\w+=/.test(replacedUrl) ? replacedUrl.replace(/\/$/, '') : replacedUrl;
}

function getFullUrl(req: express.Request): string {
  return `${req.protocol}://${req.get('host')}${req.originalUrl}`;
}

function getParsedFullUrl(req: express.Request): Url {
  return URL.parse(getFullUrl(req), true);
}

function checkProtocol(protocol: string, host: string): string {
  const REG_IP: RegExp = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
  const REG_DEV: RegExp = /dev\.site\.domen/;
  const REG_LOCALHOST: RegExp = /localhost:/;
  return REG_IP.test(host) || REG_DEV.test(host) || REG_LOCALHOST.test(host) ? `${protocol}:`.replace(/:{2,}/g, `:`) : `https:`;
}

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express().disable('x-powered-by');
  server.use(cors());
  connectMongooseDB();
  // node api START
  server.use("/plaseSearch", bodyParser.json(), placeSearch);
  // node api END

  const distFolder = join(process.cwd(), 'dist/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));
  
  server.use('*/robots.txt', express.static(`dist/browser/robots.txt`));
  server.use('*/sitemap.xml', express.static(`dist/browser/sitemap.xml`));
  server.get('*/null$', (req: express.Request, res: express.Response) => res.end());
  server.get('*/wp-content/*', (req: express.Request, res: express.Response) => res.status(404).send('Not Found'));

  server.get('*.*', express.static(distFolder));

  server.get(/.*/, (req: express.Request, res: express.Response, next: any) => {
    const pURL: Url = getParsedFullUrl(req);
    if (/\.|assets*/g.test(pURL.pathname)) {
      next();
      return;
    }

    if (/%/g.test(pURL.path)) {
      // retrieval % on ''
      const REDIRECT_URL: string = normalizeUrl(`${checkProtocol(pURL.protocol, pURL.host)}//${pURL.host}${pURL.path.replace(/%/g, '')}`);
      console.log(`301 Redirect:[retrieval %]: ${REDIRECT_URL}`);
      res.redirect(301, REDIRECT_URL);

    } else if (pURL.path !== `/` && !/\/$|\.|\?\w+=/.test(pURL.path)) {
      // stripTrailingSlash
      const REDIRECT_URL: string = normalizeUrl(`${checkProtocol(req.protocol, pURL.host)}//${pURL.host}${pURL.path}`);
      console.log(`301 Redirect:[add strip trailing slash]`);
      res.redirect(301, REDIRECT_URL);

    } else {
      next();
    }
  });
  // All regular routes use the Universal engine
  server.get('*', (req: express.Request, res: express.Response, next: any) => {

    const pURL: Url = getParsedFullUrl(req);
    const RC = {config: {need: false, code: null, url: null}};

    if (!/\?\w+=/.test(pURL.path) && /\.|assets*/g.test(pURL.path)) {
      console.log(`404 Not Found :: ${pURL.path}`);
      res.status(404).send('Not Found');
      return;
    }
    console.log(`Universal engine * ${pURL.path}`);
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0');

    res.render(indexHtml, {
      req,
      res,
      providers: [
        { provide: REQUEST, useValue: req } as ValueProvider,
        { provide: RESPONSE, useValue: res } as ValueProvider,
        { provide: `REQUEST_MODE`, useValue: `USER-REQUEST` } as ValueProvider,
        { provide: `REDIRECT_CONFIG`, useValue: RC } as ValueProvider
      ],
    });
  });

  return server;
}

function run(): void {
  const port = process.env.PORT_SERVER || 4000;
  // Start up the Node server
  const server = app();

  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
};

export * from '../src/main.server';
