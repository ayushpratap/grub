/* eslint-disable require-jsdoc */
'use-strict';

//  Function to get username

//  Read cookie
console.log(document.cookie);
$(document).ready(function() {
  const username = $('#username').text();
  console.log(username);
  const webSockUrl = 'http://localhost:8081?username='+username;
  const client = io(webSockUrl);
  client.on('connect', function() {
    onConnect(client);
    // emit auth-event
  });
  function onConnect(client) {
    console.log('client id = ', client.id);
  }
  function buildUserList(users) {
    console.log(users);
    const list = users.list;
    //  Loop though the users object
    $.each(list, function(keys, user) {
      //  Append to the user list
      console.log(user);
      $('#user-list')
          .append(`<div class="row">
          <a href="#"><span>${user}</span></a>
          </div>`);
    });
  }
  function loadUserList() {
    //  Make AJAX request to the server and get the usrList
    const username = $('#username').text();
    $.ajax({
      type: 'GET',
      url: '/api/getUserList',
      data: {username: username},
      dataType: 'JSON',
      success: function(data, status, jqXhr) {
        console.log('success');
        buildUserList(data);
      },
      error: function(jqXhr, status, errorMessage) {
        console.log('error');
        $('#user-list').append('Error: '+errorMessage);
      },
    });
  }
  loadUserList();
});

