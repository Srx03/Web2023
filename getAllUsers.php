<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "web";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM user";
$result = $conn->query($sql);

$users = array();
while ($row = $result->fetch_assoc()) {
    $users[] = $row;
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($users);
?>