# ec-usage-by-project
Elastic Cloud Usage by Project Reports

1. Tag your deployments with a "project" key, and project names.

2. Clone the repository
`git clone https://github.com/eric-lowry/ec-usage-by-project.git`

3. Build the docker image
`cd ec-usage-by-project`
`docker build --tag ec-usage-by-project:latest .`

4. Run the image in a container
`export EC_API_KEY="...your-ec-api-key..."`
`docker run --publish 80:3000 --env EC_API_KEY --rm --name ec-usage --detach ec-usage-by-project:latest`

5. To access the usage report, open http://127.0.0.1 in your web browser

6. To shutdown, just kill the container
`docker kill ec-usage`
