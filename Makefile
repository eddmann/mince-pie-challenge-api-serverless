install:
	docker-compose run --rm serverless npm install

build:
	docker-compose run --rm serverless sls webpack -v --stage=dev

deploy:
	docker-compose run --rm serverless sls deploy -v --stage=dev

shell:
	docker-compose run --rm serverless bash
