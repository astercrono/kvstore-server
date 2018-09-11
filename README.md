# KVStore Server #

This is a basic key-value store with a RESTful front-end. Data is stored in a simple SQLite database, each value is encrypted with aes-128-ctr, and each row is signed with hmac-sha256. API authentication is handled by an API key. 

## Prerequisites ##

 - nodejs
 - npm
 - Make
 - sqlite3
 - mocha

 ## Building ##

**Clone repository**

```bash
git clone https://github.com/astercrono/kvstore-server
cd kvstore-server
```

**Setup database and keys**

This will create the database and setup all the necessary keys (encryption, signing and API).

```bash
make new
```

**Setup**
```bash
make 
```

## Running ##
To launch the server, just run app.js.
```bash
node app.js
```

I do, however, recommend using a process manager, such as *nodemon* or *forever*. 

## Authentication ##

By default, your credentials will be location in $HOME/kvstore.secret, unless otherwise customized in the project's config.json file. To get your API key, open up this file and copy out the API key. Save this somewhere for later use.
