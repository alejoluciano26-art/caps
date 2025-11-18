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
$nombre = $_POST['nombre'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if (!$nombre || !$email || !$password) {
    echo json_encode(['status' => 'error', 'message' => 'Completa todos los campos']);
    exit;
}

// Verificar si el email ya existe
$stmt = $pdo->prepare("SELECT id_usuario FROM usuarios WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->rowCount() > 0) {
    echo json_encode(['status' => 'error', 'message' => 'El correo ya está registrado']);
    exit;
}

// Guardar usuario
$hashedPassword = md5($password); // Puedes cambiar a password_hash para más seguridad
$insert = $pdo->prepare("INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)");
if ($insert->execute([$nombre, $email, $hashedPassword])) {
    $id_usuario = $pdo->lastInsertId();
    $_SESSION['id_usuario'] = $id_usuario;
    $_SESSION['usuario_nombre'] = $nombre;

    echo json_encode([
        'status' => 'ok',
        'message' => 'Usuario registrado con éxito',
        'id_usuario' => $id_usuario,
        'nombre' => $nombre
    ]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Error al registrar el usuario']);
}
?>
