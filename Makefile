install:
	docker-compose run --rm serverless npm install

build:
	docker-compose run --rm serverless sls webpack -v --stage=dev

deploy:
	docker-compose run --rm serverless sls deploy -v --stage=dev

flow:
	docker-compose run --rm serverless npm run flow

shell:
	docker-compose run --rm serverless bash
