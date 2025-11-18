<?php
header('Content-Type: application/json');
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
    echo json_encode([]);
    exit;
}

$id_usuario = $_GET['id_usuario'] ?? 0;

$stmt = $pdo->prepare("
    SELECT t.id_turno, t.fecha_turno, t.hora_turno, m.nombre AS medico, m.especialidad
    FROM turnos t
    JOIN medicos m ON t.id_medico = m.id_medico
    WHERE t.id_usuario = ?
    ORDER BY t.fecha_turno, t.hora_turno
");
$stmt->execute([$id_usuario]);
$turnos = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($turnos);
?>



