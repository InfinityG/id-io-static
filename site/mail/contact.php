<?php
// PHP script for sending email
//
// Configuration
//

$toEmail = 'myemail@mydomain.com';                  // replace with your email where you would like to send email
$subject = 'Contact form from my website';          // replace with subject you want to recieve
$body    = 'You have received email from website:'; // replace with text that you wnat to recieve in email
$from    = 'info@mydomain.com';                     // replace with email that will look like sender

//
// ----- do not edit after this line if you dont understand what you are doing -----
//

if (empty($_POST['name']) || empty($_POST['email']) || empty($_POST['message'])	||
   !filter_var($_POST['email'],FILTER_VALIDATE_EMAIL))
{
	echo "Invalid input";
	return false;
}

$name = $_POST['name'];
$email = $_POST['email'];
$message = $_POST['message'];

$body .= "\n";
$body .= "Name: $name\n";
$body .= "Email: $email\n";
$body .= "Message: $message\n";

$headers = "From: $email\n";
$headers .= "Reply-To: $toEmail";

$res = mail($toEmail, $subject, $body, $headers);
echo "OK";
return true;
