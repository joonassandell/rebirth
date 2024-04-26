<?php
require_once __DIR__ . '/lib/bootstrap.php';
if (!class_exists('Timber') || !class_exists('ACF')) return;

require_once __DIR__ . '/lib/utility.php';
require_once __DIR__ . '/blocks/index.php';
require_once __DIR__ . '/lib/acf.php';
require_once __DIR__ . '/lib/clean-up.php';
require_once __DIR__ . '/lib/custom-post-types/module.php';
require_once __DIR__ . '/lib/gutenberg.php';
require_once __DIR__ . '/lib/plugins.php';
require_once __DIR__ . '/lib/roles.php';
require_once __DIR__ . '/lib/setup.php';
require_once __DIR__ . '/lib/timber.php';
require_once __DIR__ . '/lib/vite.php';
