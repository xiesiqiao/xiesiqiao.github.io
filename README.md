# xiesiqiao.github.io

Personal academic website for Siqiao Xie, built on the [Academic Pages](https://academicpages.github.io/) Jekyll theme and served via GitHub Pages at https://xiesiqiao.github.io.

## Structure

* `_pages/about.md` — homepage / bio
* `_pages/cv.md` — CV page (also linked as a downloadable PDF in `files/`)
* `_publications/` — research papers, one file per entry
* `_portfolio/` — public datasets
* `_talks/`, `_teaching/` — presentations and teaching experience
* `_config.yml` — site-wide settings (title, bio, nav, publication categories)
* `_data/navigation.yml` — header menu

## Running locally

1. Install Ruby, Bundler, and Node.js (`sudo apt install ruby-dev ruby-bundler nodejs` on Linux/WSL, or `brew install ruby node && gem install bundler` on macOS).
2. `bundle install` (delete `Gemfile.lock` first if you hit resolver errors).
3. `bundle exec jekyll serve -l -H localhost` and open `http://localhost:4000`.

### Using Docker

```bash
docker build -t xiesiqiao-site .
docker run -p 4000:4000 --rm -v $(pwd):/usr/src/app xiesiqiao-site
```

## Deployment

GitHub Pages builds this site automatically from the `master` branch on push — no separate build step needed.

## Adding content

* New paper: add a file to `_publications/` (copy an existing one for the front-matter format).
* New talk: add a file to `_talks/`.
* New teaching entry: add a file to `_teaching/`.
* New dataset: add a file to `_portfolio/`.

The `markdown_generator/` notebooks/scripts can bulk-generate publication or talk pages from a TSV file if you're adding many at once.
