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
  //  Loop though the users object
  $.each(users, function(keys, user) {
    //  Append to the user list
    console.log(user);
    $('#user-list').append(`<div class="row"><a href="#">${user}</a></div>`);
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
    url: '/getUserList',
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
  //  URL of the server where lient needs to connect
  const client = io('http://localhost:8081');

  //  Listen for socket connect event
  client.on('connect', function(socket) {
    onConnect(client);
  });

  //  Load the user list
  loadUserList();
});
