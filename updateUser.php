<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "web";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

parse_str(file_get_contents("php://input"), $requestData);
$id = $requestData['id'];
$password = $requestData['password'];

$stmt = $conn->prepare("UPDATE user SET password = ? WHERE id = ?");
$stmt->bind_param("si", $password, $id);

if ($stmt->execute()) {
    echo "User password updated successfully.";
} else {
    echo "Error updating user password: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>