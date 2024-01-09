if (localStorage.getItem('loggedIn') && localStorage.getItem('email')) {
    if(localStorage.getItem('email') === "admin") {
        window.location.href = 'admin.html';
    } else {
        window.location.href = 'user.html';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var registrationForm = document.getElementById('registrationForm');
    var errorPopup = document.getElementById('errorPopup');
    var closeBtn = document.getElementsByClassName('close')[0];
    var errorMessage = document.getElementById('errorMessage');

    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault();

        var firstName = document.getElementById('firstName').value;
        var lastName = document.getElementById('lastName').value;
        var email = document.getElementById('email').value;
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        var confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            displayError('Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            displayError('Password too short.');
            return;    
        }

        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'register.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);

                if (response.success) {
                    window.location.href = 'login.html';
                } else {
                    displayError(response.message);
                }
            }
        };

        var data = 'firstName=' + encodeURIComponent(firstName) +
                    '&lastName=' + encodeURIComponent(lastName) +
                    '&email=' + encodeURIComponent(email) +
                    '&username=' + encodeURIComponent(username) +
                    '&password=' + encodeURIComponent(password);
        xhr.send(data);
    });

    closeBtn.addEventListener('click', function() {
        errorPopup.style.display = 'none';
    });

    function displayError(message) {
        errorMessage.textContent = message;
        errorPopup.style.display = 'block';
    }
});