<?php
header('Content-Type: application/json');
session_start();

// Datos de conexión
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
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

// Buscar usuario
$stmt = $pdo->prepare("SELECT id_usuario, password, nombre FROM usuarios WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user && $user['password'] === md5($password)) {
    $_SESSION['id_usuario'] = $user['id_usuario'];
    $_SESSION['usuario_nombre'] = $user['nombre'];
    echo json_encode([
        'status' => 'ok',
        'id_usuario' => $user['id_usuario'],
        'nombre' => $user['nombre']
    ]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Usuario o contraseña incorrectos']);
}
?>





