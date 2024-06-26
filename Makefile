# =======================================
# Local
# =======================================

start:
	npm install
	npm run --silent start

start-clone:
	npm install
	npm run --silent start
	npm run --silent db:pull
	npm run --silent assets:pull
	npm run --silent db:replace

up:
	docker-compose up -d

stop:
	docker-compose stop

update:
	npm run --silent update

rebuild:
	docker-compose stop
	docker-compose rm -f web
	docker-compose rm -f db
	make start

web-bash:
	docker-compose exec web bash

db-bash:
	docker-compose exec db bash

assets-pull:
	npm run --silent assets:pull

db-backup:
	npm run --silent db:backup

db-clean:
	rm -r database/local
	rm -r database/remote

db-commit:
	npm run --silent db:commit

db-reset:
	npm run --silent db:reset

db-pull:
	npm run --silent db:pull

db-replace:
	npm run --silent db:backup
	npm run --silent db:replace

db-replace-clone:
	npm run --silent db:backup
	npm run --silent db:pull
	npm run --silent db:replace

regenerate-thumbnails:
	docker-compose exec web bash -c "wp media regenerate --yes --allow-root"

replace-special-characters:
	docker-compose exec web bash -c "wp search-replace 'Ã„' 'Ä' --allow-root && \
	  wp search-replace 'Ã¤' 'ä' --allow-root && \
	  wp search-replace 'â€' '”' --allow-root && \
	  wp search-replace 'â€“' '–' --allow-root && \
	  wp search-replace 'â€”' '—' --allow-root && \
		wp search-replace 'Ã¶' 'ö' --allow-root"

bootstrap:
	rm README.md
	rm CHANGELOG.md
	rm LICENSE
	mv PROJECT.md README.md
	@printf '%s\n' \
            '{' \
            '  "http-basic": {' \
            '    "connect.advancedcustomfields.com": {' \
            '      "username": "",' \
            '      "password": ""' \
            '    }' \
            '  }' \
            '}' > web/auth.example.json

# =======================================
# Remote
# =======================================

production-start:
	npm run --silent production:start

production-db-replace-clone:
	npm run --silent production:db:replace

production-update:
	npm run --silent production:update

production-assets-push:
	npm run --silent production:assets:push
