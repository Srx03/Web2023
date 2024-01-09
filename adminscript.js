document.addEventListener('DOMContentLoaded', function() {
    var tableBody = document.querySelector('#userTable tbody');
    var searchInput = document.getElementById('search-input');
    var searchBtn = document.getElementById('search-btn');
    var errorPopup = document.getElementById('errorPopup');
    var closeBtn = document.getElementsByClassName('close')[0];
    var errorMessage = document.getElementById('errorMessage');
    var allUsers = [];
    var fillteredUsers = [];

    closeBtn.addEventListener('click', function() {
        errorPopup.style.display = 'none';
    });

    function displayError(message) {
        errorMessage.textContent = message;
        errorPopup.style.display = 'block';
    }

    function populateTable(users) {
        tableBody.innerHTML = '';

        users.forEach(function(user) {
            var row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.email}</td>
                <td contenteditable="true">${user.password}</td>
                <td>
                    <button class="saveBtn" data-id="${user.id}">Save</button>
                    <button class="deleteBtn" data-id="${user.id}">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    searchBtn.addEventListener('click', function(event) {
        filterUsers(searchInput.value);
    });

    function filterUsers(value) {
        fillteredUsers = [];
        allUsers.forEach(function(user) {
            if(user.email.includes(value)) {
                fillteredUsers.push(user);
            }
        });
        populateTable(fillteredUsers);
    }

    function updateUserPassword(id, password) {
        var xhr = new XMLHttpRequest();
        xhr.open('PUT', 'updateUser.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = function() {
            if (xhr.status === 200) {
                getUsersData();
            } else {
                console.log('Request failed. Status: ' + xhr.status);
            }
        };
        xhr.send(`id=${id}&password=${password}`);
    }

    function deleteUser(id) {
        var xhr = new XMLHttpRequest();
        xhr.open('DELETE', 'deleteUser.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = function() {
            if (xhr.status === 200) {
                getUsersData();
            } else {
                console.log('Request failed. Status: ' + xhr.status);
            }
        };
        xhr.send(`id=${id}`);
    }

    function getUsersData() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'getAllUsers.php', true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                var users = JSON.parse(xhr.responseText);
                allUsers = users;
                console.log(allUsers);
                populateTable(users);
            } else {
                console.log('Request failed. Status: ' + xhr.status);
            }
        };
        xhr.send();
    }

    tableBody.addEventListener('click', function(event) {
        if (event.target.classList.contains('saveBtn')) {
            var id = event.target.getAttribute('data-id');
            var password = event.target.parentNode.previousElementSibling.innerText;
            if(password.length < 6) {
                displayError("Password too short.");
                return;
            }
            updateUserPassword(id, password);
        }
    });

    tableBody.addEventListener('click', function(event) {
        if (event.target.classList.contains('deleteBtn')) {
            var id = event.target.getAttribute('data-id');
            deleteUser(id);
        }
    });

    var logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', function() {
         localStorage.removeItem('email');
         localStorage.removeItem('loggedIn');
         window.location.href = 'login.html';
     });
    
    getUsersData();
});