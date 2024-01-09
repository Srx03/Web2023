<?php
session_start();

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "web";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$email = $_GET['email'];
$password = $_GET['password'];

$stmt = $conn->prepare("SELECT * FROM user WHERE email = ? AND password = ?");
$stmt->bind_param("ss", $email, $password);

$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $row = $result->fetch_assoc();
    $user_id = $row['id'];
    $_SESSION['user_id'] = $user_id;
    $_SESSION['loggedin'] = true;
    $response = array('success' => true, 'message' => 'Login successful!', 'user_id' => $user_id);
} else {
    $response = array('success' => false, 'message' => 'Invalid email or password.');
}

$stmt->close();
$conn->close();

header('Content-Type: application/json');
echo json_encode($response);
?>