<?php
/**
 * Prevent access to urls such as /2022, /?year=2023 which are unwanted in
 * majority of the cases. Prefer using dedicated templates such as category.php,
 * archive-cpt.php etc.
 */
wp_redirect(home_url());
exit;
