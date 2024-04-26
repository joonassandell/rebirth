<?php
$context = Timber::get_context();
$context['post'] = Timber::get_post();

Timber::render(['single-' . $post->ID . '.twig', 'single-' . $post->post_type . '.twig', 'single.twig'], $context);
