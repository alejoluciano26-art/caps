<?php
header('Content-Type: application/json');

// Conexión a la base de datos
$host = 'localhost';
$db   = 'clinica';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

try {
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error de conexión con la base de datos']);
    exit;
}

// Obtener datos enviados
$nombre = $_POST['nombre'] ?? '';
$email = $_POST['email'] ?? '';
$telefono = $_POST['telefono'] ?? '';
$mensaje = $_POST['mensaje'] ?? '';

// Validar datos obligatorios
if (empty($nombre) || empty($email) || empty($mensaje)) {
    echo json_encode(['status' => 'error', 'message' => 'Completa todos los campos obligatorios']);
    exit;
}

// Guardar consulta
$stmt = $pdo->prepare("INSERT INTO consultas (nombre, email, telefono, mensaje) VALUES (?, ?, ?, ?)");
try {
    $stmt->execute([$nombre, $email, $telefono, $mensaje]);
    echo json_encode(['status' => 'ok', 'message' => 'Tu consulta ha sido enviada con éxito']);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error al guardar la consulta']);
}
?>
