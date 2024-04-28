<img width="100%" src="./rebirth.png" alt="Rebirth logo">

# Rebirth

WordPress boilerplate with a set of useful development tools and an improved directory structure. Rebirth used to be "a starting point with HTML, CSS and JavaScript recipes you can copy and paste into your apps" but has since evolved to being a WordPress boilerplate. Read mode from [history](https://github.com/joonassandell/rebirth/wiki/History).

## Features

- Docker container to spin up local development environment with prereconfigured database
- Dependency management with [Composer](https://getcomposer.org)
- Theme boilerplate with [Vite](https://vitejs.dev), [Timber](https://upstatement.com/timber) and [shipit](https://github.com/shipitjs/shipit)
- Configuration with environment specific files
- Useful plugins out of the box
- WordPress installation to remote locations
- Scripts for updating plugins and deploying databases and assets to remote locations
- Scripts for pulling databases and assets from remote locations

## Requirements

- [Docker](https://docs.docker.com/engine/install) & [Docker Compose](https://github.com/docker/compose)
- [Composer](https://getcomposer.org)
- [Node.js](http://nodejs.org/), [Npm](https://www.npmjs.com) & [Nvm](https://github.com/nvm-sh/nvm)
- [ACF Pro](https://www.advancedcustomfields.com). ACF subscription key can be found from [advancedcustomfields.com/my-account](https://www.advancedcustomfields.com/my-account). Password can be [an existing site that is already active for the license key or your new site url](https://www.advancedcustomfields.com/resources/installing-acf-pro-with-composer).
- SSH access (RSA Key Pair) and [rsync](https://linux.die.net/man/1/rsync) for syncing assets, repositories and databases to and from remote locations

## Quick start (recommended)

Quickly install with [create-project](https://github.com/mafintosh/create-project). Learn from the variables below and add your values to the following one-liner:

```shell
npx create-project my-project-dir joonassandell/rebirth#main --theme-dir=my-theme-dir --author="Joonas Sandell" --production-url=https://my-project.com --acf-key="9wZ..." --acf-pw="https://registeredacfdomain.com" --git-ssh="git@github.com:username/repository.git"
```

After the installation is done jump to [step 3](#3-install-dependencies-and-boostrap) in the next section.

## Getting started

### 1. Clone and create your project directory

```shell
git clone https://github.com/joonassandell/rebirth.git my-project-dir
```

### 2. Search & replace the required variables in all files

- `{{name}}`: This is your project name (e.g. `my-project-dir`. Preferrably use the same name as your project directory).
- `{{theme-dir}}`: This will be your theme directory and name (e.g. `my-theme`)
- `{{author}}`: Author of this project (e.g. `Joonas Sandell`)
- `{{production-url}}`: Production URL url of the project (e.g. `https://project-name.com`. _Add without trailing slash_.)
- `{{acf-key}}`: ACF subscription key (e.g. `9wZ...`)
- `{{acf-pw}}`: ACF password (e.g. `https://registeredacfdomain.com`)
- `{{git-ssh}}`: Project's remote SSH Git URL

### 3. Install dependencies and bootstrap

Make sure your Docker is running, ports `8000` and `13306` are not in use and you're using node version `14.16.0`. If you don't want the preconfigured database, delete the file `web/wordpress.sql`.

```shell
make start
```

If you're unable to run this, please refer to the [Makefile](Makefile) and run the scripts manually.

### 5. Setup WordPress

Login to the [WordPress Admin dashboard](http://localhost:8000/wp-admin) with the credentials: `@admin` / `root` to see that everything works properly. If you didn't use the preconfigured database, then setup WordPress, activate ACF and other plugins, and sync theme's ACF fields. Add ACF license key so that you're able to use it.

### 6. Install theme dependencies and start theme development

Go to [web/wp-content/themes/{{theme-dir}}](web/wp-content/themes/{{theme-dir}}) and run:

```shell
composer install && npm install
```

Start you theme development with `npm run dev` and navigate to [localhost:8000](http://localhost:8000).

### 7. Recommended actions

Run the bootstrap script which will remove this file and rename [PROJECT.md](PROJECT.md) to [README.md](README.md). See the new README to learn about available scripts and make sure it contains correct information.

```
make bootstrap
```

Other essential actions:

- Change the admin credentials
- Once you have added data to your project you should create your own MySQL dump with `make db-commit` and commit the new dump (`database/wordpress.sql`)
- Keep your projects README in sync with the changes you make
- Git initialise your project (e.g. `git init && git add . && git commit -m "Init"`)

Happy developing!

## Changelog

See [CHANGELOG](/CHANGELOG.md).

## Issues & FAQ

See [Issues](https://github.com/joonassandell/rebirth/issues) and [FAQ](https://github.com/joonassandell/rebirth/wiki/FAQ).

## License

Licensed under the [MIT license](/LICENSE.md).
