<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "web";
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$firstName = $_POST['firstName'];
$lastName = $_POST['lastName'];
$email = $_POST['email'];
$username = $_POST['username'];
$password = $_POST['password'];

$stmt = $conn->prepare("SELECT COUNT(*) as count FROM user WHERE email = ? OR username = ?");
$stmt->bind_param("ss", $email, $username);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$count = $row['count'];
$stmt->close();

if ($count > 0) {
    $response = [
        'success' => false,
        'message' => 'Email or username already exists.'
    ];
} else {
    $stmt = $conn->prepare("INSERT INTO user (firstName, lastName, email, username, password) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $firstName, $lastName, $email, $username, $password);
    $stmt->execute();
    $stmt->close();

    $response = [
        'success' => true,
        'message' => 'Registration successful.'
    ];
}

header('Content-Type: application/json');
echo json_encode($response);
$conn->close();
?>