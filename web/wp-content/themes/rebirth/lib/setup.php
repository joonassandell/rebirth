<?php
add_action('after_setup_theme', function() {
    /**
     * Register navigations
     */
    register_nav_menus([
        'nav-header' => 'Header navigation',
    ]);

    /**
     * Add featured image support
     */
    add_theme_support('post-thumbnails');

    /**
     * Add additional images
     */
    add_image_size('landscape_xl', 2560, 1097, true); // 21:9
    add_image_size('landscape_l', 1920, 823, true); // 21:9
    add_image_size('landscape_m', 1280, 549, true); // 21:9
    add_image_size('landscape_s', 832, 357, true); // 21:9
    add_image_size('landscape_xs', 416, 178, true); // 21:9

    add_image_size('monitor_l', 1368, 1026, true); // 4:3
    add_image_size('monitor_m', 684, 513, true); // 4:3
    add_image_size('monitor_s', 384, 288, true); // 4:3

    add_image_size('portrait_l', 684, 912, true); // 3:4
    add_image_size('portrait_m', 384, 512, true); // 3:4
    add_image_size('portrait_s', 192, 256, true); // 3:4

    add_image_size('square_xl', 1024, 1024, true); // 1:1
    add_image_size('square_l', 684, 684, true); // 1:1
    add_image_size('square_m', 384, 384, true); // 1:1
    add_image_size('square_s', 192, 192, true); // 1:1
    add_image_size('square_xs', 96, 96, true); // 1:1

    /**
     * Default image sizes programmatically
     */
    update_option('large_size_w', 1024);
    update_option('large_size_h', 1024);
    update_option('medium_size_w', 456);
    update_option('medium_size_h', 456);
    update_option('thumbnail_size_w', 96);
    update_option('thumbnail_size_h', 96);
    update_option('thumbnail_crop', 1);

    /**
     * Create cropped default image sizes
     */
    set_post_thumbnail_size(192, 192, true);

    /**
     * Tweak image compression
     */
    add_filter('jpeg_quality', function() {
        return 100;
    });

    /**
     * Make theme available for translation
     */
    load_theme_textdomain('app', get_template_directory() . '/languages');
});

/**
 * Add favicon to admin also
 */
add_action('admin_head', function() {
    echo '<link rel="icon" href="' . get_template_directory_uri() . '/favicon.svg">';
});
