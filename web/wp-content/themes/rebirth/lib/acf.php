<?php
/**
 * Global settings page
 */
acf_add_options_page([
    'capability'  => 'edit_posts',
    'menu_slug'   => 'global-settings',
    'menu_title'  => __('Global Settings', 'app'),
    'page_title'  => __('Global Settings', 'app'),
    'redirect'    => false,
]);

/**
 * Posts settings page
 */
acf_add_options_page([
    'capability'  => 'edit_posts',
    'menu_slug'   => 'posts-settings',
    'menu_title'  => __('Settings', 'app'),
    'page_title'  => __('Posts settings', 'app'),
    'redirect'    => false,
    'parent_slug'   => 'edit.php',
]);

/**
 * Allow shortcodes in textareas
 */
add_filter('acf/format_value/type=textarea', 'do_shortcode');

/**
 * Modify Basic wysiwyg fields
 * https://www.tiny.cloud/docs-3x/reference/buttons/
 */
add_filter('acf/fields/wysiwyg/toolbars', function($toolbars) {
	$toolbars['Basic'] = [];
	$toolbars['Basic'][1] = [
        'bold',
        'italic',
        'underline',
        'strikethrough',
        'bullist',
        'numlist',
        'link',
        'undo',
        'redo',
        'formatselect',
    ];

    $toolbars['Simple'][1] = [
        'bold',
        'italic',
        'underline',
        'link',
    ];

	return $toolbars;
});


/**
 * Make category edit form wider for ACF fields
 */
add_action('category_edit_form', function() {
    echo '<style>#edittag { max-width: unset; }</style>';
});

/**
 * Hide ACF fields in new category form since they're barely usable there
 */
add_action('category_add_form', function() {
    echo '<style>#acf-term-fields { display: none; }</style>';
});

/**
 * Fix a long-standing issue with ACF, where fields sometimes aren't shown
 * in previews (ie. from Preview > Open in new tab).
 * https://support.advancedcustomfields.com/forums/topic/custom-fields-on-post-preview/
 *
 * This doesn't apply changes to the fields in the preview though. This
 * doesn't really fix the issue, this just makes the fields visible.
 */
if (class_exists('acf_revisions')) {
	// Reference to ACF's <code>acf_revisions</code> class
	// We need this to target its method, acf_revisions::acf_validate_post_id
	$acf_revs_cls = acf()->revisions;

	// This hook is added the ACF file: includes/revisions.php:36 (in ACF PRO v5.11)
	remove_filter('acf/validate_post_id', array($acf_revs_cls, 'acf_validate_post_id', 10));
}
