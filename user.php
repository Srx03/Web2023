<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "web";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['user_id'])) {
        $userId = $_GET['user_id'];

        $stmt = $conn->prepare("SELECT * FROM note WHERE user_id = ?");
        $stmt->bind_param("i", $userId);

        $stmt->execute();

        $result = $stmt->get_result();

        $notes = [];

        while ($row = $result->fetch_assoc()) {
            $notes[] = $row;
        }

        echo json_encode($notes);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['user_id']) && isset($data['value'])) {
        $userId = $data['user_id'];
        $value = $data['value'];

        $stmt = $conn->prepare("INSERT INTO note (user_id, value) VALUES (?, ?)");
        $stmt->bind_param("is", $userId, $value);

        $stmt->execute();

        if ($stmt->affected_rows === 1) {
            $response = array('success' => true, 'message' => 'Note saved successfully!');
        } else {
            $response = array('success' => false, 'message' => 'Error saving note.');
        }

        echo json_encode($response);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['note_id']) && isset($data['user_id']) && isset($data['value'])) {
        $noteId = $data['note_id'];
        $userId = $data['user_id'];
        $value = $data['value'];

        $stmt = $conn->prepare("UPDATE note SET value = ? WHERE id = ? AND user_id = ?");
        $stmt->bind_param("ssi", $value, $noteId, $userId);

        $stmt->execute();

        if ($stmt->affected_rows === 1) {
            $response = array('success' => true, 'message' => 'Note updated successfully!');
        } else {
            $response = array('success' => false, 'message' => 'Error updating note.');
        }

        echo json_encode($response);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['user_id']) && isset($data['note_id'])) {
        $userId = $data['user_id'];
        $id = $data['note_id'];

        $stmt = $conn->prepare("DELETE FROM note WHERE user_id = ? AND id = ?");
        $stmt->bind_param("ii", $userId, $id);

        $stmt->execute();

        if ($stmt->affected_rows === 1) {
            $response = array('success' => true, 'message' => 'Note deleted successfully!');
        } else {
            $response = array('success' => false, 'message' => 'Error deleting note.');
        }

        echo json_encode($response);
    }
}

$conn->close();
?>
