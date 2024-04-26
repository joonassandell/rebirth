<?php
/**
 * Template Name: Front page
 */
$context = Timber::get_context();
$post = new TimberPost();
$context['post'] = $post;
$context['latest_post'] = Timber::get_posts([
    'posts_per_page' => 1,
])[0];

Timber::render('template-home.twig', $context);
