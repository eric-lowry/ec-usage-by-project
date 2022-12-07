# ec-usage-by-project
Elastic Cloud Usage by Project Reports

This application delivers an interactive web page that allows you 
to view your elastic cloud usage, summarized by a project tag.
It also allows users to download the summarized data to a CSV file.

## Pre-Requisites

Before running the report, you will need do a couple of things
in the [Elastic Cloud](https://cloud.elastic.co) console.

* Create an [API Key](https://cloud.elastic.co/deployment-features/keys) for use by the report.
* Tag your each of your deployments with a "project" key and name pair.

Note: _Untagged deployments will show up in an "Untagged" section of the report._

## To run the report using the public container

1. run the public image in a local container (named "ec-usage")

```bash
export EC_API_KEY="...your-ec-api-key..."
docker run --publish 80:8080 --env EC_API_KEY --rm --name ec-usage --detach gcr.io/elastic-sa/ec-usage-by-project:latest
```
2. To access the usage report, open http://127.0.0.1 in your web browser

3. To shutdown, kill the container

```bash
docker kill ec-usage
```

## To build and run the report locally, follow these steps:

1. Clone the repository

```bash
git clone https://github.com/eric-lowry/ec-usage-by-project.git
```
2. Build the docker image

```bash
cd ec-usage-by-project
docker build --tag ec-usage-by-project:latest .
```

3. Run the image in a container (named "ec-usage")

```bash
export EC_API_KEY="...your-ec-api-key..."
docker run --publish 80:8080 --env EC_API_KEY --rm --name ec-usage --detach ec-usage-by-project:latest
```

4. To access the usage report, open http://127.0.0.1 in your web browser

5. To shutdown, kill the container

```bash
docker kill ec-usage
```
