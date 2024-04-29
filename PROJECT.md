# {{name}}

Local Docker development environment for {{name}}. Started with [rebirth](https://github.com/joonassandell/rebirth).

## Requirements

- [Docker](https://docs.docker.com/engine/install) & [Docker Compose](https://github.com/docker/compose)
- [Composer](https://getcomposer.org)
- [Node.js](http://nodejs.org/), [Npm](https://www.npmjs.com) & [Nvm](https://github.com/nvm-sh/nvm)
- [ACF Pro](https://www.advancedcustomfields.com). ACF subscription key can be found from [advancedcustomfields.com/my-account](https://www.advancedcustomfields.com/my-account). Password can be [an existing site that is already active for the license key or your new site url](https://www.advancedcustomfields.com/resources/installing-acf-pro-with-composer).
- SSH access (RSA Key Pair) and [rsync](https://linux.die.net/man/1/rsync) for deploying theme and for syncing assets, repositories and databases from remote locations

# Getting started

## 1. Clone and navigate to the directory

```shell
git clone {{git-ssh}} && cd {{name}}
```

## 2. Install dependencies

1. Copy [auth.example.json](web/auth.example.json) to `auth.json` and add ACF Pro credentials
2. Optionally copy [.env](.env) to `.env.local` and make sure that all the `PRODUCTION_*` vars are set
3. Make sure your Docker is running, ports `8000` and `13306` are not in use and you're using node version `14.16.0`. Then run:

```
make start
```

If you're unable to run this, please refer to the [Makefile](Makefile) and run the scripts manually. Alternatively clone production to your local development environment with `make start-clone`.

## 3.Setup WordPress

Login to the [WordPress Admin dashboard](http://localhost:8000/wp-admin) to see that everything works properly. Setup WordPress, activate ACF and other plugins, add ACF license key and sync theme's ACF fields if these are not already configured. Assets such as images may be broken, so if you need them you can download them with `make assets-pull`.

## 4. Install theme dependencies

Go to [web/wp-content/themes/{{theme-dir}}](web/wp-content/themes/{{theme-dir}}) and run:

```shell
composer install && npm install
```

Start you theme development with `npm run dev` and navigate to [localhost:8000](http://localhost:8000).

## Usage

### Theme scripts

These scripts work in [web/wp-content/themes/{{theme-dir}}](web/wp-content/themes/{{theme-dir}}). Note that the theme uses a different node version.

- `npm run dev`: Navigate to [http://localhost:8000](http://localhost:8000) (= `VITE_DEVELOPMENT_HOST` and not to the port that is Vite prints in the console)
- `npm run preview`: [Preview](#preview-production-build) and watch the built production version of the theme locally
- `npm run build`: Build the production version of the theme
- `npm run deploy`: Build the theme and [deploy](#deployment) it to the server

### Database scripts

You need SSH access to run some of the scripts. All the scripts are near equivalents to `docker-compose` commands and `npm` scripts. If you are unable to run these scripts, please refer to the [Makefile](Makefile), [package.json](package.json), [Docker compose reference](https://docs.docker.com/compose/reference) and [Docker CLI](https://docs.docker.com/engine/reference/commandline).

- `make start`: Start your project. Builds, creates and starts Docker containers, imports database from `database/wordpress.sql` and installs all dependencies.
- `make start-clone`: Clone production environment to your local development environment. Builds, creates and starts Docker containers, updates all dependencies, pulls assets, pulls MySQL dump, replaces local database with the remote database. Make sure database server credentials are set in the `.env.local` file. **Note that this could be very heavy process, so do it with care**
- `make up`: Starts Docker containers. Use this to resume developing after installing the project.
- `make stop`: Stop Docker containers
- `make update`: Update Composer dependencies
- `make rebuild`: Rebuilds and reinstall containers, including your MySQL container. **Note that you will lose your current data**.
- `make web-bash`: Connect to WordPress (`web`) container
- `make db-bash`: Connect to MySQL (`db`) container
- `make assets-pull`: Pull uploaded files from production environment (`uploads/` directory) to your local environment.
- `make db-backup`: Creates dump to `database/local/wordpress-<date>.sql` from your local database.
- `make db-pull`: Create and pull MySQL dump from the production environment to `database/remote` directory and place the pulled dump ready for replacing in `/database/remote/wordpress.sql`. **Note that this could be very heavy process, so do it with care**.
- `make db-replace`: Backups current database and replaces it with `database/remote/wordpress.sql` dump if there is one.
- `make db-replace-clone`: Shorcut for `make db-pull` & `make db-replace`
- `make db-clean`: Cleans up dumps from `database/local` and `database/remote` to save disk space
- `make db-commit`: Creates dump to `database/wordpress.sql` from your local database. Idea here is to update database to git for other developers to use. Make sure everything works fine before doing this and then commit the new dump
- `make db-reset`: Reset your local database by replacing it with `database/wordpress.sql`
- `make replace-special-characters`: Replace common invalid characters in database with WP-CLI (`Ã¤` -> `ä` etc.)
- `make regenerate-thumbnails`: Regenerate WordPress thumbnails with WP-CLIs

### Remote database scripts

Be careful with the remote commands or you may break the server configuration. You need SSH access to use remote commands.

- `make production-db-replace-clone`: Creates dump of your local database and replaces production database with the newly created dump
- `make production-update`: Update WordPress Composer dependencies. Note that if you have private repositories, you need to configure SSH key pair with the server and git remote.
- `make production-assets-push`: Push your local assets to the production server
- `make production-theme-deploy`: Wrapper command for deploying theme
- `make production-deploy`: Deploy and update everything. Shorcut for `make production-update` & `make production-theme-deploy`.

#### `make production-start`

Install WordPress and plugins to the production server. This is most likely required only once, so be careful not to reinstall accidentally. You may want to:

- [Deploy your theme first](#deployment)
- Add production database credentials and [unique keys and salts](https://api.wordpress.org/secret-key/1.1/salt/) temporarily in [wp/wp-config.php](wp/wp-config.php) so they can copied to the server (Do not commit)
- `make production-db-replace-clone`: Replace remote database with your local one. Make sure the database name matches with the remote in `.env.local` (`PRODUCTION_DB_NAME`).
- `make production-assets-push` to sync your local materials to the server

If you want to add new new server environments you need to modify [flightplan.remote.js](flightplan.remote.js), [flightplan.config.js](flightplan.config.js), [Makefile](Makefile), [package.json](package.json) and [.env](.env) files.

## Theme

### Preview production build

You need to have `define('WP_ENVIRONMENT_TYPE', 'production');` in wp-config.php to preview the production version locally. Alternatively you can add `?production` to the url to preview the production version. Note that [.env.development](web/wp-content/themes/{{theme-dir}}/.env.development) is also loaded in preview but with lower priority than [.env.production](web/wp-content/themes/{{theme-dir}}/.env.production).

### Deployment

1. Make sure you have SSH access to the remove server
2. Add [PRODUCTION_SSH](web/wp-content/themes/{{theme-dir}}/.env.local)
3. Run `npm run deploy` which runs the shipit deployment script. Note that the shipit deployment runs locally but checks the latest commit from the git remote which it will then deploy.
4. [Sync possible ACF fields]({{production-url}}/wp-admin/edit.php?post_type=acf-field-group&post_status=sync) after the deployment

### Developing in LAN

1. Change `DEVELOPMENT_URL` in [.env.local](.env.local) to match your LAN address (e.g. `DEVELOPMENT_URL=http://192.168.1.190:8000`) and restart Docker
2. Change `VITE_HOST` and `VITE_DEVELOPMENT_HOST` in [.env.local](web/wp-content/themes/{{theme-dir}}/.env.local) to match your LAN address (e.g `VITE_DEVELOPMENT_HOST=http://192.168.1.190:8000`, `VITE_HOST=http://192.168.1.190:5173`)
3. Start Vite dev server `npm run dev` and navigate to the `VITE_DEVELOPMENT_HOST` you defined

---

You may learn more about the project at [Rebirth](https://github.com/joonassandell/rebirth).
