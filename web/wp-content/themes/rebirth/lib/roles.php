<?php
/**
 * Modify editor role
 */
add_action('init', function() {
    if (get_option('add_editor_custom_cap_once') != 'done') {
        $editor_role = get_role('editor');

        $editor_role->add_cap('create_sites');
        $editor_role->add_cap('delete_sites');
        $editor_role->add_cap('manage_network');
        $editor_role->add_cap('manage_network_users');
        $editor_role->add_cap('manage_sites');

        $editor_role->add_cap('create_users');
        $editor_role->add_cap('delete_users');
        $editor_role->add_cap('edit_users');
        $editor_role->add_cap('list_users');
        $editor_role->add_cap('promote_users');
        $editor_role->add_cap('remove_users');

        update_option('add_editor_custom_cap_once', 'done');
    }
});

/**
 * If someone is trying to edit or delete admin and that user isn't an admin, don't allow it
 */
add_filter('map_meta_cap', function($caps, $cap, $user_id, $args) {
    switch($cap) {
        case 'edit_user':
        case 'remove_user':
        case 'promote_user':
            if (isset($args[0]) && $args[0] == $user_id)
                break;
            elseif (!isset($args[0]))
                $caps[] = 'do_not_allow';
            $other = new WP_User(absint($args[0]));
            if ($other->has_cap('administrator')) {
                if (!current_user_can('administrator')) {
                    $caps[] = 'do_not_allow';
                }
            }
            break;
        case 'delete_user':
        case 'delete_users':
            if (!isset($args[0]))
                break;
            $other = new WP_User(absint($args[0]));
            if ($other->has_cap('administrator')) {
                if (!current_user_can('administrator')) {
                    $caps[] = 'do_not_allow';
                }
            }
            break;
        default:
            break;
    }

    return $caps;
}, 10, 4);

/**
 * Remove 'Administrator' from the list of roles if the current user is not an admin
 */
add_filter('editable_roles', function($roles) {
    if (isset($roles['administrator']) && !current_user_can('administrator')) {
        unset($roles['administrator']);
    }

    return $roles;
});

/**
 * Hide unnecessary pages
 */
add_action('admin_menu', function() {
    if (!current_user_can('administrator')) {
        remove_submenu_page('themes.php', 'themes.php');
        remove_submenu_page('themes.php', 'widgets.php');
        remove_submenu_page('tools.php', 'tools.php');

        global $submenu;
        unset($submenu['themes.php'][6]);
    }
});

add_action('admin_init', function() {
    if (!current_user_can('administrator')) {
        global $pagenow;

        if ($pagenow == 'themes.php' || $pagenow == 'widgets.php'
            || $pagenow == 'customize.php') {
            wp_redirect(admin_url('/nav-menus.php'), 302);
            exit;
        }

        if ($pagenow == 'site-themes.php') {
            wp_redirect(admin_url('/network/index.php'), 302);
            exit;
        }

        if ($pagenow == 'site-settings.php') {
            wp_redirect(admin_url('/network/index.php'), 302);
            exit;
        }
    }
});
