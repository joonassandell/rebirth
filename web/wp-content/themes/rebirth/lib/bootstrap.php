<?php
if (is_dir(__DIR__ . '/../vendor')) {
    require_once __DIR__ . '/../vendor/autoload.php';
    require_once __DIR__ . '/env.php';
} else {
    add_action('admin_notices', function() {
        echo '
            <div class="error">
                <p>Make sure you have installed theme composer dependencies.</p>
            </div>
        ';
    });
}

if (!class_exists('ACF')) {
    add_action('admin_notices', function() {
        echo '
            <div class="error">
                <p>
                    Advanced custom fields is not activated. Make sure you activate
                    the plugin in <a href="' . esc_url(admin_url('plugins.php')) . '">' .
                    esc_url(admin_url('plugins.php')) . '</a>
                </p>
            </div>
        ';
    });
}

if (class_exists('Timber\Timber')) {
    $timber = new \Timber\Timber();
}
