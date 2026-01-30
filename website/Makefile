# Create, manage, and deploy the YSAP website
#
# Author: Dave Eddy <dave@daveeddy.com>
# Date: January 30, 2026
# License: MIT
#
# Contributors: zenobit <zen@duck.com>

# duh
SHELL := bash

.PHONY: help
help:
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST) | sort

.PHONY: build
build: static/favicon.ico static/osowoso.png static/favicon.jpg ## default target, builds the site into ./_site
	mkdir -p _site _site/contact _site/contributing _site/episodes _site/projects _site/resources _site/static _site/void
	# disable indexing for certain dirs
	echo -n > _site/static/index.html
	# Create html files
	./make-html
	# copy static files
	cat static/favicon.ico > _site/favicon.ico
	cat static/favicon.jpg > _site/static/favicon.jpg
	cat static/robots.txt > _site/robots.txt
	cat static/osowoso.png > _site/static/osowoso.png
	cat static/style.css > _site/static/style.css
	cat static/ansi.css > _site/static/ansi.css
	cat static/terminal.js > _site/static/terminal.js
	cat static/index.html > _site/index.html
	cat static/contact.html > _site/contact/index.html
	cat static/contrib.html > _site/contributing/index.html
	cat static/episodes.html > _site/episodes/index.html
	cat static/projects.html > _site/projects/index.html
	cat static/resources.html > _site/resources/index.html
	cat static/void.html > _site/void/index.html
	# make /ping endpoint (nginx handles this for me, but just in case)
	echo 'pong' > _site/ping
	# create ASCII index page for curl users
	./make-index > _site/index.txt
	# create ASCII help page
	./make-help > _site/help
	# create episodes ASCII table
	./make-episodes > _site/episodes/index.txt
	# make episodes JSON file for curl
	./make-episodes-json > _site/json
	# make jsonp for our HTML files
	./make-commands-jsonp > _site/static/commands.js
	./make-episodes-json EPISODES > _site/static/episodes.js
	cat _site/json > _site/episodes.json
	# create all pages for each video
	./make-video-pages

static/favicon.ico:
	# Copy icons
	cp ../artwork/favicon.ico static/

static/favicon.jpg:
	cp ../artwork/favicon.jpg static/

static/osowoso.png:
	cp ../artwork/osowoso.png static/

.PHONY: all
all: build deploy ## build and deploy the site

.PHONY: serve
serve: ## serve site locally out of ./_site
	python3 -mhttp.server -d _site

.PHONY: check-deps
check-deps: ## check to ensure needed dependencies are installed
	./check-deps

.PHONY: check
check: ## check tools syntax using shellcheck
	shellcheck -x check-* make-* tools/*

.PHONY: test
test: clean build ## Serve and check website locally
	./make-test

.PHONY: clean
clean: ## remove any generated files
	rm -rf _site
	rm -f static/favicon.{ico,jpg}
	rm -f static/osowoso.png

.PHONY: deploy
deploy: ## deploy the site (using rsync)
	rsync -avh --delete ./_site/ web:/var/www/osowoso.org/
