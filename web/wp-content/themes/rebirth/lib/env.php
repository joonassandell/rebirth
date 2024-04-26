<?php

function load_env($file) {
    if (file_exists(__DIR__ . '/../' . $file)) {
        $dotenv = Dotenv\Dotenv::createImmutable(__DIR__, '../' . $file);
        $dotenv->load();
    }
}

switch (wp_get_environment_type()) {
    case "development": {
        load_env('.env.local');
        load_env('.env.development');
        load_env('.env');
        break;
    }

    case "production": {
        load_env('.env.local');
        load_env('.env.production');
        if (file_exists(__DIR__ . '/../dist/PREVIEW')) load_env('.env.development');
        load_env('.env');
    }
}
