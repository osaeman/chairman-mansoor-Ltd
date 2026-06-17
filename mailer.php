<?php
require __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method Not Allowed');
}

/* SMTP CONFIG - replace with cPanel email details */
define('SMTP_HOST',     'mail.chairmanmansoorltd.co.uk');
define('SMTP_PORT',     587);
define('SMTP_SECURE',   PHPMailer::ENCRYPTION_STARTTLS);

define('SMTP_USER',     'query@chairmanmansoorltd.co.uk');
define('SMTP_PASS',     'query@password');

define('MAIL_FROM',     'query@chairmanmansoorltd.co.uk');
define('MAIL_FROM_NAME','Chairman Mansoor Ltd Website');

define('MAIL_TO',       'query@chairmanmansoorltd.co.uk');
define('MAIL_SUBJECT',  'New Website Enquiry - Chairman Mansoor Ltd');

function clean(string $value): string {
    return htmlspecialchars(strip_tags(trim($value)), ENT_QUOTES, 'UTF-8');
}

$fullName     = clean($_POST['fullName'] ?? '');
$emailAddress = filter_var(trim($_POST['emailAddress'] ?? ''), FILTER_SANITIZE_EMAIL);
$phoneNumber  = clean($_POST['phoneNumber'] ?? '');
$subject      = clean($_POST['subject'] ?? '');
$message      = clean($_POST['message'] ?? '');

$required = [$fullName, $emailAddress, $phoneNumber, $subject, $message];

foreach ($required as $field) {
    if ($field === '') {
        http_response_code(422);
        exit('validation_error');
    }
}

if (!filter_var($emailAddress, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    exit('invalid_email');
}

$htmlBody = '
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  body {
    font-family: Arial, sans-serif;
    background:#f5f7fa;
    margin:0;
    padding:0;
    color:#1f2937;
  }

  .wrap {
    max-width:650px;
    margin:30px auto;
    background:#ffffff;
    border-radius:14px;
    overflow:hidden;
    box-shadow:0 12px 35px rgba(0,0,0,0.08);
  }

  .header {
    background:#234056;
    padding:28px 32px;
    color:#ffffff;
  }

  .header h1 {
    margin:0;
    font-size:22px;
  }

  .header p {
    margin:7px 0 0;
    color:#a7beae;
    font-size:13px;
  }

  .body {
    padding:30px 32px;
  }

  .row {
    padding:13px 0;
    border-bottom:1px solid #e8eaf2;
    display:flex;
    gap:18px;
  }

  .row:last-child {
    border-bottom:none;
  }

  .label {
    width:155px;
    color:#6b7280;
    font-weight:bold;
    font-size:12px;
    text-transform:uppercase;
    letter-spacing:0.08em;
  }

  .value {
    flex:1;
    color:#111827;
    font-size:14px;
    line-height:1.6;
  }

  .message {
    margin-top:22px;
    padding:18px;
    background:#f2f6f4;
    border-left:4px solid #234056;
    border-radius:8px;
    line-height:1.7;
  }

  .footer {
    background:#31473a;
    padding:18px 32px;
    text-align:center;
    color:#d7ded9;
    font-size:12px;
  }
</style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <h1>Chairman Mansoor Ltd</h1>
      <p>New website enquiry received</p>
    </div>

    <div class="body">
      <div class="row">
        <div class="label">Full Name</div>
        <div class="value">' . $fullName . '</div>
      </div>

      <div class="row">
        <div class="label">Email</div>
        <div class="value"><a href="mailto:' . $emailAddress . '">' . $emailAddress . '</a></div>
      </div>

      <div class="row">
        <div class="label">Phone</div>
        <div class="value">' . $phoneNumber . '</div>
      </div>

      <div class="row">
        <div class="label">Subject</div>
        <div class="value">' . $subject . '</div>
      </div>

      <div class="message">
        <strong>Message:</strong><br>
        ' . nl2br($message) . '
      </div>
    </div>

    <div class="footer">
      This message was sent from the Chairman Mansoor Ltd website contact form.
    </div>
  </div>
</body>
</html>
';

$plainBody = "New Website Enquiry - Chairman Mansoor Ltd\n"
    . "--------------------------------------------------\n"
    . "Full Name: $fullName\n"
    . "Email: $emailAddress\n"
    . "Phone: $phoneNumber\n"
    . "Subject: $subject\n\n"
    . "Message:\n$message\n";

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = SMTP_HOST;
    $mail->SMTPAuth   = true;
    $mail->Username   = SMTP_USER;
    $mail->Password   = SMTP_PASS;
    $mail->SMTPSecure = SMTP_SECURE;
    $mail->Port       = SMTP_PORT;
    $mail->CharSet    = 'UTF-8';

    $mail->setFrom(MAIL_FROM, MAIL_FROM_NAME);
    $mail->addAddress(MAIL_TO, 'Chairman Mansoor Ltd');
    $mail->addReplyTo($emailAddress, $fullName);

    $mail->isHTML(true);
    $mail->Subject = MAIL_SUBJECT;
    $mail->Body    = $htmlBody;
    $mail->AltBody = $plainBody;

    $mail->send();
    echo 'success';
} catch (Exception $e) {
    error_log('[Chairman Mansoor Mailer] Mail error: ' . $mail->ErrorInfo);
    http_response_code(500);
    echo 'mail_error';
}