<?php
include_once (ABSPATH . 'wp-admin/includes/plugin.php');

/**
 * Simple History: Reduce visibility
 */
add_filter('simple_history/view_history_capability', function($cap) {
    $cap = 'manage_options';
    return $cap;
});

/**
 * Redirection: Allow editors to edit redirects
 * https://redirection.me/developer/permissions
 */
add_filter('redirection_role', function($role) {
    return 'edit_posts';
});

add_filter('redirection_capability_check', function($capability, $permission_name) {
    if ($permission_name === 'redirection_cap_redirect_manage' || $permission_name === 'redirection_cap_redirect_add') {
        return $capability;
    }

    return 'manage_options';
}, 10, 2);

/**
 * Hide unwanted post-types-order plugin info box
 */
add_action('admin_head', function() {
    echo '
        <style>
            #cpto #cpt_info_box { display: none !important; }
        </style>
    ';
});
