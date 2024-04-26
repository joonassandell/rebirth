<?php
use Idleberg\WordPress\ViteAssets\Assets;
use Idleberg\ViteManifest\Manifest;

/* ======
 * Production
 * ====== */

if (wp_get_environment_type() != 'development') {
    $baseUrl = get_template_directory_uri() . '/dist/';
    $manifest = __DIR__ . "/../dist/manifest.json";

    /**
     * Font preloading and head.js
     */
    add_action('wp_head', function() use ($baseUrl, $manifest) {
        $vm = new Manifest($manifest, $baseUrl);

        $fonts = [
            @$vm->getEntrypoint("fonts/font-file.woff2"),
        ];

        if (!empty($fonts)) {
            foreach ($fonts as $font) {
                if ($font) {
                    ["url" => $url] = $font;
                    echo "<link rel=\"preload\" href=\"$url\" as=\"font\" type=\"font/woff2\" crossorigin=\"anonymous\">";
                }

            }
        }

        $head = @$vm->getEntrypoint("head.js");
        if ($head) {
            ["url" => $url] = $head;
            echo "<script src=\"$url\" crossorigin></script>";
        }
    }, 0);

    /**
     * Main index.js
     */
    $viteAssets = new Assets($manifest, $baseUrl);
    $viteAssets->inject("index.build.js", [
        "action" => "wp_head",
        "integrity" => false,
    ]);
}

/* ======
 * Development
 * ====== */

if (wp_get_environment_type() == 'development') {
    add_action('wp_head', function() {
        echo '<script type="module" src="'. $_ENV['VITE_HOST'] .'/@vite/client"></script>';
        echo '<script src="'. $_ENV['VITE_HOST'] .'/head.js"></script>';
        echo '<script type="module" src="'. $_ENV['VITE_HOST'] .'/index.js"></script>';
        echo '<link rel="stylesheet" href="'. $_ENV['VITE_HOST'] .'/index.scss"></link>';
    });
}
