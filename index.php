<?php
require "./connection.php";
$url = "";
$data = [];
if (isset($_GET['url'])) {
  $url = $_GET['url'];
  $params = explode('/', $url);
  $slug = $params[0];
  $query = "SELECT a.*, json_agg(row_to_json(b.*)) as questions FROM bootcamp a LEFT JOIN registration_questions b ON b.bootcamp_id = a.id WHERE a.slug = '$slug' GROUP BY a.id";
  $result = pg_query($conn, $query);
  if ($result) {
    $data = pg_fetch_assoc($result);
  }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <link rel="icon" href="https://bacod.id/bacod.png" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
  <meta name="theme-color" content="#222222" />
  <meta name="robots" content="index,follow" />
  <meta name="googlebot" content="index,follow" />
  <meta property="og:type" content="image/jpeg" />
  <meta property="og:url" content="https://form.bacod.id<?= $url ?>" />
  <meta property="og:image" content=https://bacod.id/bacod.png />
  <meta name="author" content="Restu D. Cahyo" />
  <meta name="keywords" content="BACOD" />
  <meta name="keywords" content="BANDUNG CODERS" />
  <meta name="keywords" content="BANDUNG CODERS FORM" />
  <link rel="stylesheet" href="./assets/css/daftar.css">
  <?php
    if (isset($_GET["url"])) {
      echo '<meta name="description" content="'.$data["name"].'" />';
      echo '<meta property="og:title" content="'.$data["name"].'" />';
      echo '<title>'.$data["name"].'</title>';
    } else {
      echo '<title>BACOD FORM</title>';
    }
  ?>
</head>
<body>
  <div id="bacod-framework">
    <div class="container">
      <div class="center-middle">
        <div id="boba-logo"></div>
      </div>
      <?php
      if (isset($_GET["url"])) {
        if (!empty($data)) {
          if ($data["is_register"] === "t") {
            $questions = json_decode($data["questions"]);
            if (!empty($data["name"])) {
              echo '<h2 class="center color-white mb-10">'.$data["name"].'</h2>';
            }
        ?>
        <form id="registerForm" form-id="<?= $data["id"] ?>">
          <div class="form-group">
            <div class="form-group-label required">
              Nama Lengkap
            </div>
            <div class="form-group-wrapper">
              <input type="text" class="form-input remove-message" name="name">
            </div>
            <div class="form-group-message"></div>
          </div>
          <div class="form-group">
            <div class="form-group-label required">
              Whatsapp
            </div>
            <div class="form-group-wrapper">
              <input type="tel" class="form-input remove-message" name="whatsapp">
            </div>
            <div class="form-group-message"></div>
          </div>
          <div class="form-group">
            <div class="form-group-label required">
              Email
            </div>
            <div class="form-group-wrapper">
              <input type="email" class="form-input remove-message" name="email">
            </div>
            <div class="form-group-message"></div>
          </div>

          <?php
          if (!empty($questions)) {
            foreach($questions as $question) {
          ?>
          <div class="form-group">
            <div class="form-group-label<?= $question->is_required === true ? " required" : "" ?>">
              <?= $question->question ?>
            </div>
            <div class="form-group-wrapper">
              <?=
                empty($question->html_input) ?
                '<textarea
                  class="form-input remove-message question"
                  name="question[0]"
                  question-id="'.$question->id.'"
                ></textarea>'
                : $question->html_input
              ?>
            </div>
            <div class="form-group-message"></div>
          </div>
          <?php
            }
          }
          ?>
          <button type="submit" class="btn btn-primary">KIRIM</button>
        </form>
        <?php   
          } else {
            echo '<h1 class="center color-primary mt-10">Maaf</h1><p class="center color-white">Pendaftaran sudah ditutup, coba lagi lain waktu yaa, jangan lupa pantau terus instagram kita di <a href="https://www.instagram.com/bandung.coders/" target="_blank" class="color-white">bandung.coders</a></p>';
          }
        } else {
          echo '<h1 class="center color-red mt-10">404<br/>NOT FOUND</h1>';
        }
      } else {
        echo '<h2 class="center color-primary mt-10">Welcome to BACOD FORM</h2>';
      }
      ?>
    </div>
  </div>
  <script src="./assets/js/bacod.min.js"></script>
  <script src="./assets/js/controller.js"></script>
</body>
</html>
<?php
pg_close($conn);
?>