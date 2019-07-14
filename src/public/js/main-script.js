'use-strict';
/**
 * @name onConnect
 *
 * @param {*} client
 */
function onConnect(client) {
  console.log('client id = ', client.id);
}
/**
 * @name buildUserList
 * @param {*} users
 */
function buildUserList(users) {
  console.log(users);
  const list = users.list;
  //  Loop though the users object
  $.each(list, function(keys, user) {
    //  Append to the user list
    console.log(user);
    $('#user-list')
        .append(`<div class="row"><a href="#"><span>${user}</span></a></div>`);
  });
}
/**
 *@name loadUserList
 *
 */
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
$(document).ready(function() {
  //  URL of the server where client needs to connect
  const client = io('http://localhost:8081');

  //  Listen for socket connect event
  client.on('connect', function(socket) {
    onConnect(client);
  });

  //  Load the user list
  loadUserList();
});
