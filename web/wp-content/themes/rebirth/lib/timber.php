<?php
Timber::$dirname = [
    'components',
    'components/App',
    'components/Article',
    'components/Button',
    'components/Content',
    'components/Footer',
    'components/Header',
    'components/Heading',
    'components/Icon',
    'components/Icon/icons',
    'components/Image',
    'components/Logo',
    'components/Logo/logos',
    'components/Section',
    'partials',
    'templates'
];

class App extends TimberSite {
    function __construct() {
        add_filter('timber_context', [$this, 'context']);
        add_filter('timber_context', [$this, 'context_languages']);
        add_filter('timber_context', [$this, 'context_constants']);
        add_filter('timber/twig', [$this, 'add_to_twig']);
        parent::__construct();
    }

    /* ======
     * Basics
     * ====== */

    function context($context) {
        $context['nav_header'] = new TimberMenu('nav-header');
        $context['options'] = get_fields('option');
        $context['page_for_posts'] = get_page(get_option('page_for_posts'));
        $context['site'] = $this;

        /**
         * Match with _config.scss ($breakpoints)
         */
        $context['bp_xxs_max'] = 359;
        $context['bp_xxs'] = 360;
        $context['bp_xs_max'] = 479;
        $context['bp_xs'] = 480;
        $context['bp_s_max'] = 599;
        $context['bp_s'] = 600;
        $context['bp_m_max'] = 767;
        $context['bp_m'] = 768;
        $context['bp_l_max'] = 1023;
        $context['bp_l'] = 1024;
        $context['bp_xl_max'] = 1140;
        $context['bp_xl'] = 1140;
        $context['bp_xxl_max'] = 1280;
        $context['bp_xxl'] = 1280;

        return $context;
    }

    function context_languages($context) {
        if (function_exists('pll_languages_list')) {
            $languages = pll_the_languages(['raw' => 1]);
            $context['languages']['languages'] = $languages;
        }

        if (function_exists('pll_home_url')) {
            $context['languages']['home_url'] = pll_home_url();
        }

        if (function_exists('pll_current_language')) {
            $context['languages']['current_language'] = pll_current_language();
        }

        return $context;
    }

    function context_constants($context) {
        $context['ENVIRONMENT'] = wp_get_environment_type();
        $context['DEVELOPMENT'] = wp_get_environment_type() == 'development';
        $context['PRODUCTION'] = wp_get_environment_type() == 'production';
        $context['DISABLE_ANALYTICS'] = @$_ENV['DISABLE_ANALYTICS'] == 'true';

        return $context;
    }

    /* ======
     * Extend Twig
     * ====== */

    function add_to_twig($twig) {
        $twig->addFunction(new Timber\Twig_Function('get_posts', [$this, 'get_posts']));
        $twig->addFunction(new Timber\Twig_Function('get_terms', [$this, 'get_terms']));
        $twig->addFunction(new Timber\Twig_Function('get_env', [$this, 'get_env']));
        $twig->addFunction(new Timber\Twig_Function('display_template_file', [$this, 'display_template_file']));
        class_exists('HelloNico\Twig') && $twig->addExtension(new HelloNico\Twig\DumpExtension());
        return $twig;
    }

    /* ======
     * WordPress posts/terms related
     * ====== */

    function get_posts($args = [], $addKeysFromValue = null) {
        $posts = Timber::get_posts(array_merge([
            'posts_per_page' => isset($args->posts_per_page) ? $args->posts_per_page : 10,
        ], $args));

        if (is_array($addKeysFromValue)) {
            $newPosts = [];
            foreach ($posts as $key => $post) {
                foreach ($addKeysFromValue as $newKey => $fromKey) {
                    $post->$newKey = $post->$fromKey;
                }
                $newPosts[$key] = $post;
            }
            return $newPosts;
        }

        return $posts;
    }

    function get_terms($args = [], $addKeysFromValue = null) {
        $terms = Timber::get_terms(array_merge([
            'taxonomy' => isset($args->taxonomy) ? $args->taxonomy : 'categories',
        ], $args));

        $queried_object = get_queried_object();

        if (isset($queried_object->term_id)) {
            foreach ($terms as $term) {
                if ($term->id == $queried_object->term_id) {
                    $term->active = true;
                }
            }
        }

        if (is_array($addKeysFromValue)) {
            $newTerms = [];
            foreach ($terms as $key => $term) {
                foreach ($addKeysFromValue as $newKey => $fromKey) {
                    $term->$newKey = $term->$fromKey;
                }
                $newTerms[$key] = $term;
            }
            return $newTerms;
        }

        return $terms;
    }

    /* ======
     * Various utils
     * ====== */

    function get_env($var) {
        return $_ENV[$var];
    }

    function display_template_file() {
        if (wp_get_environment_type() == 'development') {
            global $template;
            $parts = explode('/', $template);
            $file = end($parts);
            return '<small>Current template: ' . $file . '</small>';
        }
    }
}

new App();
