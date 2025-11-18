<?php
header('Content-Type: text/html; charset=utf-8');

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
    echo "<option value=''>Error al cargar médicos</option>";
    exit;
}

// Obtener todos los médicos
$stmt = $pdo->query("SELECT id_medico, nombre, especialidad FROM medicos ORDER BY nombre");
$medicos = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Si no hay médicos
if (count($medicos) === 0) {
    echo "<option value=''>No hay médicos disponibles</option>";
} else {
    echo "<option value=''>-- Selecciona un médico --</option>";
    foreach ($medicos as $medico) {
        $id = $medico['id_medico'];
        $nombre = htmlspecialchars($medico['nombre']);
        $especialidad = htmlspecialchars($medico['especialidad']);
        echo "<option value='$id'>$nombre ($especialidad)</option>";
    }
}
?>


