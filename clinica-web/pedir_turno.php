<?php
header('Content-Type: text/plain');
session_start();

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
    echo "error";
    exit;
}

$id_usuario = $_POST['id_usuario'] ?? null;
$id_medico  = $_POST['id_medico'] ?? null;
$fecha_turno = $_POST['fecha_turno'] ?? null;
$hora_turno  = $_POST['hora_turno'] ?? null;

if (!$id_usuario || !$id_medico || !$fecha_turno || !$hora_turno) {
    echo "error";
    exit;
}

$stmt = $pdo->prepare("INSERT INTO turnos (id_medico, id_usuario, fecha_turno, hora_turno) VALUES (?, ?, ?, ?)");
$ok = $stmt->execute([$id_medico, $id_usuario, $fecha_turno, $hora_turno]);

echo $ok ? "ok" : "error";
?>

