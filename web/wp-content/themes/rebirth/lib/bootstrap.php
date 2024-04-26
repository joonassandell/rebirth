<?php
if (is_dir(__DIR__ . '/../vendor')) {
    require_once __DIR__ . '/../vendor/autoload.php';
    require_once __DIR__ . '/env.php';
} else {
    $notification = '
        <div class="error">
            <p>Make sure you have installed composer dependencies.</p>
        </div>
    ';

    add_action('admin_notices', function() {
        echo $notification;
    });

    if (!is_admin()) echo $notification;
}

/**
 * This ensures that Timber is loaded and available as a PHP class
 */
if (class_exists('Timber\Timber')) {
    $timber = new \Timber\Timber();
}

/**
 * Notify about Advanced Custom Fields
 */
if (!class_exists('ACF')) {
    $notification = '
        <div class="error">
            <p>
                Advanced custom fields is not activated. Make sure you activate
                the plugin in <a href="' . esc_url(admin_url('plugins.php')) . '">' .
                esc_url(admin_url('plugins.php')) . '</a>
            </p>
        </div>
    ';

    add_action('admin_notices', function() {
        echo $notification;
    });

    if (!is_admin()) {
        echo $notification;
    }
}
