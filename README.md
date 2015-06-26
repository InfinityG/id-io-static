# id-io-static

* The 'site' directory contains the public ID-IO website

* The 'wallet' directory contains the demo wallet:
  * This is an AngularJS client application
    * Dependencies are managed with __bower__ (which requires __NodeJS__)
    * It is built using __gulp__
    * The output directory is 'www'
  * Sinatra (Ruby web server) is used to serve the site
    * The 'routes' directory contains the entry points 
    * Only serves static files from the 'www' directory