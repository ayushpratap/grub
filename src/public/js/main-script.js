'use-strict';
$(function () 
{
    var client = io('http://localhost:8081');
    console.log(' client id', client.id);
    client.on('connect',function(){
        console.log(' client id', client.id);
        console.log(client.connected);
    });
})