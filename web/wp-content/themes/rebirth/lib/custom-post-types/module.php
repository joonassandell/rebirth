<?php
add_action('init', function() {
    $args = [
        'description' => 'Reusable components to use in multiple locations. Use with Flexible Layout and setup with ACF.',
        'has_archive' => false,
        'hierarchical' => false,
        'labels' => [
            'add_new_item' => __('Add New Module', 'app'),
            'edit_item' => __('Edit Module', 'app'),
            'name' => __('Modules', 'app'),
            'singular_name' => __('Module', 'app'),
        ],
        'menu_position' => 20,
        'public' => true,
        'publicly_queryable' => false,
        'rewrite' => false,
        'show_ui' => true,
        'show_in_nav_menus' => false,
        'supports' => [
            'title',
            'custom-fields',
            'revisions',
        ],
    ];

    register_post_type('module', $args);
});

add_action('init', function() {
    $args = [
        'description' => 'Allowed component types. Setup with ACF.',
        'hierarchical' => true,
        'labels' => [
            'name' => __('Component Types', 'app'),
            'singular_name' => __('Component Type', 'app'),
        ],
        'meta_box_cb' => false,
        'public' => false,
        'rewrite' => false,
        'show_ui' => current_user_can('administrator'),
        'show_in_quick_edit' => false,
    ];

    register_taxonomy('component_type', 'module', $args);
});
