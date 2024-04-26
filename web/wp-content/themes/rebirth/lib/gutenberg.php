<?php
/**
 * Disable default Gutenberg block styles
 */
add_action('wp_print_styles', function() {
    wp_dequeue_style('wp-block-library');
}, 100);

/**
 * Remove colors
 */
add_action('after_setup_theme', function() {
    add_theme_support('editor-color-palette');
    add_theme_support('disable-custom-colors');
});

add_action('admin_head', function() {
    echo '
        <style>
            [data-wp-component="ToolsPanel"]:has(.color-block-support-panel__inner-wrapper) {
                display: none !important;
            }
        </style>
    ';
});
