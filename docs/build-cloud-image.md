# Build the gcr.io release images - step-by-step

Cheatsheet for manually releasing a new verion of the report.

## Steps

1. Clone the latest source
```bash
cd ~/Projects
git clone https://github.com/eric-lowry/ec-usage-by-project.git
# or if it already exists
cd ~/Projects/ec-usage-by-project
git pull 
```

2. Build (and tag) the image
```bash
export VERSION="1.1"
export IMAGE="ec-usage-by-project"
export PUBLIC_IMAGE="gcr.io/elastic-sa/$IMAGE"
docker build --tag $IMAGE:latest --tag $PUBLIC_IMAGE:latest --tag $PUBLIC_IMAGE:$VERSION .
```
 
3. Push the image to gcr.io
```bash
docker push --all-tags $PUBLIC_IMAGE:latest
# ...or push them one at a time...
docker push $PUBLIC_IMAGE:latest
docker push $PUBLIC_IMAGE:$VERSION
```
