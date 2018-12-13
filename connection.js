var elasticsearch=require('elasticsearch');

var client = new elasticsearch.Client( {  
    host:'localhost:9200/',
    log: 'trace'
});

 client.indices.create({
     index: 'books'
 }, function(err, resp, status) {
     if (err) {
         console.log(err);
     } else {
         console.log("create", resp);
     }
 });

module.exports = client;  