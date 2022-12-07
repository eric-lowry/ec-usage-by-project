# ec-usage-by-project
Elastic Cloud Usage by Project Reports

This application delivers an interactive web page that allows you 
to view your elastic cloud usage, summarized by a project tag.
It also allows users to download the summarized data to a CSV file.

To run the report locally, follow these steps:

1. Tag your deployments with a "project" key, and project names.

2. Clone the repository

```bash
git clone https://github.com/eric-lowry/ec-usage-by-project.git
```
3. Build the docker image

```bash
cd ec-usage-by-project
docker build --tag ec-usage-by-project:latest .
```

4. Run the image in a container (named "ec-usage")

```bash
export EC_API_KEY="...your-ec-api-key..."
docker run --publish 80:80 --env EC_API_KEY --rm --name ec-usage --detach ec-usage-by-project:latest
```

5. To access the usage report, open http://127.0.0.1 in your web browser

6. To shutdown, kill the container

```bash
docker kill ec-usage
```
