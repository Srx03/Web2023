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

$stmt = $conn->prepare("DELETE FROM user WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo "User deleted successfully.";
} else {
    echo "Error deleting user: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>