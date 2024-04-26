const path = require('path');
const pkg = require('./package.json');
const dotenv = require('dotenv');

module.exports = shipit => {
  require('shipit-deploy')(shipit);
  const { environment } = shipit;
  dotenv.config({ path: path.resolve(process.cwd(), `.env.${environment}`) });
  dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
  const { WEBROOT, SHIPIT_THEME_PATH, PRODUCTION_SSH, STAGING_SSH } =
    process.env;

  shipit.initConfig({
    default: {
      repositoryUrl: pkg.repository,
      ignores: [
        '.env.development',
        '.eslintrc.js',
        '.nvmrc',
        'assets/fonts',
        'assets/helpers',
        'assets/javascripts',
        'assets/stylesheets',
        'assets/*.*',
        'jsconfig.json',
        'composer.json',
        'composer.lock',
        'node_modules',
        'package-lock.json',
        'package.json',
        'postcss.config.cjs',
        'shipitfile.js',
        'vite.config.js',
      ],
      keepReleases: 5,
      deleteOnRollback: false,
      dirToCopy: SHIPIT_THEME_PATH,
      shallowClone: true,
    },
    production: {
      branch: 'master',
      deployTo: `${WEBROOT}/wp-content/releases/{{theme-dir}}`,
      servers: PRODUCTION_SSH,
    },
    staging: {
      branch: 'development',
      deployTo: `${WEBROOT}/wp-content/releases/{{theme-dir}}`,
      servers: STAGING_SSH,
    },
  });

  shipit.blTask('npm', () => {
    shipit.log('Installing npm dependencies...');
    return shipit
      .local(`cd ${shipit.workspace}/${SHIPIT_THEME_PATH} && npm install`)
      .then(() => shipit.log('Successfully installed npm dependencies'))
      .catch(() => {
        shipit.log('Failed to install dependencies');
        process.exit(1);
      });
  });

  shipit.blTask('composer', () => {
    shipit.log('Installing dependencies...');
    return shipit
      .local(`cd ${shipit.workspace}/${SHIPIT_THEME_PATH} && composer install`)
      .then(() => shipit.log('Successfully installed composer dependencies'))
      .catch(() => {
        shipit.log('Failed to install dependencies');
        process.exit(1);
      });
  });

  shipit.blTask('build', () => {
    shipit.log('Running build...');
    return shipit
      .local(`cd ${shipit.workspace}/${SHIPIT_THEME_PATH} && npm run build`)
      .then(() => shipit.log('Build successful'))
      .catch(() => {
        shipit.log('Build failed');
        process.exit(1);
      });
  });

  shipit.blTask('setup', () => {
    shipit.log('Running setup...');
    shipit.remote(`
      if [ ! -d "${WEBROOT}/wp-content/themes/{{theme-dir}}" ]
        then
          mkdir -p ${WEBROOT}/wp-content/themes \
          mkdir -p ${WEBROOT}/wp-content/releases/{{theme-dir}} \
          && ln -s ${WEBROOT}/wp-content/releases/{{theme-dir}}/current \
            ${WEBROOT}/wp-content/themes/{{theme-dir}}
      fi
    `);
  });

  shipit.on('fetched', () => {
    shipit.start('npm', 'composer', 'build');
  });

  shipit.on('published', () => {
    shipit.start('setup');
  });
};
