document.addEventListener('DOMContentLoaded', function() {
  var loginForm = document.getElementById('loginForm');

  loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    changePassword();
  });

  function changePassword() {
    var email = document.getElementById('email').value;
    var oldPassword = document.getElementById('oldpassword').value;
    var newPassword = document.getElementById('newpassword').value;

    if (newPassword.length < 6) {
        showError('Password too short.');
        return;    
    }

    var data = {
      email: email,
      old_password: oldPassword,
      new_password: newPassword
    };

    sendHttpRequest('PUT', 'changepassword.php', data, function(response) {
      if (response.success) {
        alert('Password changed successfully!');
        window.location.href = 'login.html';
      } else {
        showError(response.message);
      }
    });
  }

  function sendHttpRequest(method, url, data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 400) {
        var response = JSON.parse(xhr.responseText);
        callback(response);
      }
    };
    xhr.onerror = function() {
      console.error('Request failed');
    };
    xhr.send(JSON.stringify(data));
  }

  function showError(message) {
    var errorPopup = document.getElementById('errorPopup');
    var errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorPopup.style.display = 'block';

    var closeBtn = document.getElementsByClassName('close')[0];
    closeBtn.addEventListener('click', function() {
      errorPopup.style.display = 'none';
    });
  }
});
