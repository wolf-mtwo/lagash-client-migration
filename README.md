# LAGASH CLIENT MIGRATION

# Install

```
npm install
gulp serve // run as developer

# to migrate spet by step
gulp build
<start>|<end> = inventory id of book asset
node .tmp/server.js 35000 35050
node .tmp/server.js <start> <end>
```

parses data from the below URL and insert it to the lagash-server
[http://finanzas.uab.edu.bo:9095/biblioteca/](http://finanzas.uab.edu.bo:9095/biblioteca/)


## Running your application with Gulp

It's time to use Gulp tasks:
- *$ gulp serve* to start server on your source files with live reload

## License
[The MIT License](LICENSE.md)
