<?php
add_action('init', function() {
    register_block_type(__DIR__ . '/Highlight');
});

function acf_block_highlight($block, $content = '', $is_preview = false) {
    Timber::render('Highlight/Highlight.twig', [
        'fields' => get_fields(),
    ]);
};

/**
 * Filter allowed block types
 */
add_filter('allowed_block_types_all', function($allowed_blocks) {
    return [
        'core/embed',
        'core/heading',
        'core/image',
        'core/list',
        'core/list-item',
        'core/paragraph',
        'core/shortcode',
        'core/separator',
        'core/video',
        'contact-form-7/contact-form-selector',
        'acf/highlight',
    ];
});

