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

Note: _Untagged deployments will show up in an "un-tagged" section of the report._

## To deploy the report on Google Cloud, using cloud run

1. From the google cloud shell terminal
```bash
export SERVICE="ec-usage-by-project"
export EC_API_KEY="...your-ec-api-key..."
export ADMIN_USER_NAME="elastic"
export ADMIN_PASSWORD="...password..."
export REGION="us-central1"
# Optional for Cloud Shell Terminal
export GOOGLE_CLOUD_PROJECT="elastic-sa"

gcloud run deploy $SERVICE \
--image=gcr.io/elastic-sa/ec-usage-by-project:latest \
--allow-unauthenticated \
--max-instances=5 \
--set-env-vars=EC_API_KEY="$EC_API_KEY",ADMIN_USER_NAME="$ADMIN_USER_NAME",ADMIN_PASSWORD="$ADMIN_PASSWORD" \
--region=$REGION \
--project=$GOOGLE_CLOUD_PROJECT \
--format=json > /tmp/last-deploy.json
# optional, but helpful
export SERVICE_ID=`jq -r .metadata.uid /tmp/last-deploy.json`
export SERVICE_URL=`jq -r .status.url /tmp/last-deploy.json`
```

2. To destroy the published service
```bash
gcloud run services delete --region $REGION $SERVICE
```

## To run the report using the public container

1. run the public image in a local container (named "ec-usage")

```bash
export EC_API_KEY="...your-ec-api-key..."
export ADMIN_USER_NAME="elastic"
export ADMIN_PASSWORD="...password..."
docker run --publish 80:8080 --env EC_API_KEY --env ADMIN_USER_NAME --env ADMIN_PASSWORD --rm --name ec-usage --detach gcr.io/elastic-sa/ec-usage-by-project:latest
```

_Note: the ADMIN_USER_NAME and ADMIN_PASSWORD environment variables are optional.  When omitted from the docker run command, the admin user will be "elastic" and the password will be the EC_API_KEY._

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
export ADMIN_USER_NAME="elastic"
export ADMIN_PASSWORD="...password..."
docker run --publish 80:8080 --env EC_API_KEY --env ADMIN_USER_NAME --env ADMIN_PASSWORD --rm --name ec-usage --detach ec-usage-by-project:latest
```

_Note: the ADMIN_USER_NAME and ADMIN_PASSWORD environment variables are optional.  When omitted from the docker run command, the admin user will be "elastic" and the password will be the EC_API_KEY._

4. To access the usage report, open http://127.0.0.1 in your web browser

5. To shutdown, kill the container

```bash
docker kill ec-usage
```
