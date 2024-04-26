<?php
$context = Timber::get_context();
$context['posts'] = Timber::get_posts($wp_query);
$context['heading'] = single_cat_title('', false);
$term = get_queried_object();
$context['category_fields'] = get_fields($term);
Timber::render('category.twig', $context);
