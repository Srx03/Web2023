<?php
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['email']) && isset($data['old_password']) && isset($data['new_password'])) {
    $email = $data['email'];
    $oldPassword = $data['old_password'];
    $newPassword = $data['new_password'];

    $servername = 'localhost';
    $username = 'root';
    $password = '';
    $dbname = 'web';

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die('Connection failed: ' . $conn->connect_error);
    }

    $stmt = $conn->prepare("SELECT * FROM user WHERE email = ?");
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $row = $result->fetch_assoc();

        if ($oldPassword === $row['password']) {
            $updateStmt = $conn->prepare("UPDATE user SET password = ? WHERE email = ?");
            $updateStmt->bind_param('ss', $newPassword, $email);
            $updateStmt->execute();

            if ($updateStmt->affected_rows === 1) {
                $response = array('success' => true, 'message' => 'Password changed successfully!');
            } else {
                $response = array('success' => false, 'message' => 'Failed to change password.');
            }
        } else {
            $response = array('success' => false, 'message' => 'Incorrect old password.');
        }
    } else {
        $response = array('success' => false, 'message' => 'User not found.');
    }

    $conn->close();

    echo json_encode($response);
}
