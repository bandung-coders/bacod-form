<?php
$env_path = __DIR__ . '/.env';
$env_data = parse_ini_file($env_path);

$dbhost = $env_data['DB_HOST'];
$dbport = $env_data['DB_PORT'];
$dbname = $env_data['DB_NAME'];
$dbuser = $env_data['DB_USERNAME'];
$dbpass = $env_data['DB_PASSWORD'];

$conn = pg_connect("host={$dbhost} port={$dbport} dbname={$dbname} user={$dbuser} password={$dbpass}");

if (!$conn) {
    echo "SOMETHING WRONG, PLEASE CONTACT ADMIN";
    die();
}
?>