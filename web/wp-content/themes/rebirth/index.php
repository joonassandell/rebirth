<?php
/**
 * Use index.php as page template and as archive page. Set some page as
 * "posts page" in wp settings for this to take action. This allows to use
 * search params maybe later as filters e.g. /archive?year=2023
 */
$context = Timber::get_context();
$context['posts'] = Timber::get_posts($wp_query);
$context['post'] = new TimberPost();
$query_vars = $wp_query->query_vars;

if ($query_vars['monthnum']) {
	$context['heading'] = __('Archive', 'app') . ': ' . get_the_date('M Y');
} elseif ($query_vars['year']) {
	$context['heading'] = __('Archive', 'app') . ': ' . get_the_date('Y');
} elseif ($query_vars['tag']) {
	$context['heading'] = single_tag_title('', false);
}

Timber::render('index.twig', $context);
