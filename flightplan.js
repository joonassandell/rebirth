require('dotenv').config();
const plan = require('flightplan');
const cfg = require('./flightplan.config');

/* ======
 * Configuration
 * ====== */

/**
 * Target servers
 */
plan.target('local', {});
plan.target('production', cfg.production, cfg.production.opts);
plan.target('production-db', cfg.productionDB, cfg.productionDB.opts);

/**
 * Setup
 */
let sshUser,
  sshPort,
  sshHost,
  webRoot,
  url,
  domain,
  wpHome,
  dbName,
  dbUser,
  dbPw;
const date = `${new Date().getTime()}`;
const DEVELOPMENT_URL = 'http://localhost:8000';
const devDomain = DEVELOPMENT_URL.replace(/(^\w+:|^)\/\//, '');

plan.local(['start', 'update', 'assets-pull', 'db-pull', 'db-replace'], () => {
  sshHost = plan.runtime.hosts[0].host;
  sshUser = plan.runtime.hosts[0].username;
  sshPort = plan.runtime.hosts[0].port;
  webRoot = plan.runtime.options.webRoot;
  url = plan.runtime.options.url;
  domain = url ? url.replace(/(^\w+:|^)\/\//, '') : '';
  wpHome =
    plan.runtime.options.wpHome === '/'
      ? (plan.runtime.options.wpHome = '')
      : plan.runtime.options.wpHome || '';
  dbName = plan.runtime.options.dbName;
  dbUser = plan.runtime.options.dbUser;
  dbPw = plan.runtime.options.dbPw;
});

/* ======
 * Start & update
 * ====== */

plan.local(['start'], local => {
  local.log('Preparing files and installing dependencies...');
  local.exec(`
    if [ ! -f web/.htaccess ]; then
      cp web/.htaccess.example web/.htaccess
    fi

    if [ ! -f web/wp-config.php ]; then
      cp web/wp-config.example.php web/wp-config.php
    fi

    if [ ! -f web/.auth.example.json ]; then
      cp web/auth.example.json web/auth.json
    fi

    if [ ! -d "web/wp-content/themes/{{theme-dir}}" ]; then
      mv web/wp-content/themes/rebirth web/wp-content/themes/{{theme-dir}}
    fi

    docker-compose up -d

    (cd web && composer update)
  `);
});

plan.local(['update'], local => {
  local.log('Updating dependencies...');
  local.exec(`
    docker-compose up -d

    (cd web && composer clearcache)
    (cd web && composer update)
  `);
});

/* ======
 * Pull assets
 * ====== */

plan.local(['assets-pull'], local => {
  local.log('Downloading uploads folder...');
  local.exec(
    `rsync -avz -e 'ssh -p ${sshPort}' \
    ${sshUser}@${sshHost}:${webRoot}/wp-content/uploads web/wp-content`,
    { failsafe: true },
  );
});

/* ======
 * Backup database
 * ====== */

plan.local(['db-backup'], local => {
  local.log(`Creating local dump to database/local/wordpress-${date}.sql`);
  local.exec(`mkdir -p database/local`, { silent: true, failsafe: true });
  local.exec(
    `docker-compose exec -T db bash -c 'mysqldump -uroot -proot \
      wordpress > /docker-entrypoint-initdb.d/local/wordpress-${date}.sql'`,
    { failsafe: true },
  );
});

/* ======
 * Commit database
 * ====== */

plan.local(['db-commit'], local => {
  local.log('Dumping local database to database/wordpress.sql');
  local.exec(
    `docker-compose exec -T db bash -c 'mysqldump -uroot -proot \
      wordpress > /docker-entrypoint-initdb.d/wordpress.sql'`,
    { failsafe: true },
  );
});

/* ======
 * Pull database
 * ====== */

plan.remote(['db-pull'], remote => {
  remote.log(
    `Dumping remote database to ${webRoot}/tmp/database/remote/${dbName}-${date}.sql`,
  );
  remote.exec(`mkdir -p ${webRoot}/tmp/database/remote`, {
    silent: true,
    failsafe: true,
  });
  remote.exec(
    `mysqldump -u${dbUser} -p${dbPw} ${dbName} > ${webRoot}/tmp/database/remote/${dbName}-${date}.sql`,
  );
});

plan.local(['db-pull'], local => {
  local.log(`Pulling remote database dump to database/remote/wordpress.sql`);
  local.exec(`mkdir -p database/remote`, { silent: true, failsafe: true });
  local.exec(`rsync -avz -e 'ssh -p ${sshPort}' \
    ${sshUser}@${sshHost}:${webRoot}/tmp/database/remote/${dbName}-${date}.sql ./database/remote`);
  local.exec(
    `cp ./database/remote/${dbName}-${date}.sql ./database/remote/wordpress.sql`,
  );
});

plan.remote(['db-pull'], remote => {
  remote.log(
    `Removing remote database dump from ${webRoot}/tmp/database/remote/${dbName}-${date}.sql`,
  );
  remote.exec(`rm ${webRoot}/tmp/database/remote/${dbName}-${date}.sql`);
});

/* ======
 * Replace database
 * ====== */

plan.local(['db-replace'], local => {
  let database = plan.runtime.options.database || 'remote/wordpress.sql';
  local.log(`Replacing local database with database/${database}`);

  local.exec(
    String.raw`
      if [ -f database/${database} ]; then
        docker-compose exec -T db bash -c "mysql -uroot -proot \
          -e 'drop database wordpress;'"
      fi
  `,
    { failsafe: true },
  );

  local.exec(String.raw`
    if [ -f database/${database} ]; then
      docker-compose exec -T db bash -c "mysql -uroot -proot \
        -e ' \
          create database wordpress; \
          use wordpress; source docker-entrypoint-initdb.d/${database};'"
    fi
  `);

  local.log('Replacing strings in database...');
  local.exec(
    String.raw`
    docker-compose exec -T web bash -c " \
      if \$(wp --url=${url} core is-installed --network --allow-root); then
          wp search-replace --url='${url}${wpHome}' '${url}${wpHome}' '${DEVELOPMENT_URL}' --network --allow-root --skip-tables=wp_users,wp_blogs,wp_site
          wp search-replace '${domain}' '${devDomain}' wp_blogs wp_site --allow-root --network --url=${devDomain}
          wp search-replace '${wpHome}' '' wp_blogs --allow-root --network --url=${devDomain}
        else
          wp search-replace '${url}${wpHome}' '${DEVELOPMENT_URL}' --skip-tables=wp_users --allow-root --url=${devDomain}
      fi
    "
  `,
    { failsafe: true },
  );
});
