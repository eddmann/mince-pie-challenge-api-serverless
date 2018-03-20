build:
	docker-compose run --rm serverless npm install

test:
	docker-compose run --rm serverless npm test

flow:
	docker-compose run --rm serverless npm run flow

deploy:
	docker-compose run --rm serverless sls deploy -v

remove:
	docker-compose run --rm serverless sls remove -v

shell:
	docker-compose run --rm serverless bash
