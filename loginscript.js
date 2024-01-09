if (localStorage.getItem('loggedIn') && localStorage.getItem('email')) {
    if(localStorage.getItem('email') === "admin@admin.com") {
	   window.location.href = 'admin.html';
    } else {
	   window.location.href = 'user.html';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('loginForm');
    var errorPopup = document.getElementById('errorPopup');
    var closeBtn = document.getElementsByClassName('close')[0];
    var errorMessage = document.getElementById('errorMessage');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form submission
        
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
    	if (email=== "admin@admin.com" && password === "admin" ) {
           localStorage.setItem('loggedIn', true);
           localStorage.setItem('email', email);             
           window.location.href = 'admin.html';
        }

        
        var xhr = new XMLHttpRequest();
        
        xhr.open('GET', 'login.php?email=' + encodeURIComponent(email) + '&password=' + encodeURIComponent(password), true);
        
        xhr.onload = function() {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                
                if (response.success) {
                    console.log(response.message);

                    
                    localStorage.setItem('loggedIn', true);
                    localStorage.setItem('email', email);
                    localStorage.setItem('user_id', response.user_id);
                    
                    console.log(response);
                    window.location.href = 'user.html';
                } else {
                    displayError(response.message);
                }
            } else {
                displayError(response.message);
            }
        };
        
        xhr.send();
    });

    closeBtn.addEventListener('click', function() {
        errorPopup.style.display = 'none';
    });

    function displayError(message) {
        errorMessage.textContent = message;
        errorPopup.style.display = 'block';
    }
});
