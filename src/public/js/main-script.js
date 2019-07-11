'use-strict';
$(function () 
{
    var client = io('http://localhost:8081');
    client.on('connect',function(){
        console.log(' client id', client.id);
        console.log(client.connected);
    });
})