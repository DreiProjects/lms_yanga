@echo off
echo Setting PHP timezone to Asia/Manila...
php -r "file_put_contents('C:/xampp_new/php/php.ini', str_replace('date.timezone=Europe/Berlin', 'date.timezone=Asia/Manila', file_get_contents('C:/xampp_new/php/php.ini')));"
php -r "file_put_contents('C:/xampp_new/php/php.ini', str_replace(';date.timezone =', 'date.timezone = Asia/Manila', file_get_contents('C:/xampp_new/php/php.ini')));"
echo Timezone set successfully to Asia/Manila
php -r "echo 'Current timezone: ' . date_default_timezone_get() . ' (UTC' . date('P') . ')';"
echo Restart your web server for changes to take effect.
pause
