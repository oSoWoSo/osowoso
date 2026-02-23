---
title: bssg
date: 2026-02-23 12:57:17 +0100
lastmod: 2026-02-23 12:57:17 +0100
tags: bssg, static, site, website, generator, ssg
slug: bssg
secondary: true
---
# BSSG - Bash Static Site Generator

[BSSG](https://bssg.dragas.net) is a simple static site generator written in Bash. It processes Markdown files and builds a minimal, accessible website suitable for personal journals, daily writing, or introspective personal newspapers.

## Table of Contents
- [Features](#features)
- [Requirements](#requirements)
- [Quick Start](#quick-start)
- [Recommended Setup: Separating Content from Core](#recommended-setup-separating-content-from-core)
- [Directory Structure](#directory-structure)
- [Usage](#usage)
- [Markdown Post Format](#markdown-post-format)
- [Customization](#customization)
- [Deployment](#deployment)
- [Themes](#themes)
- [Theme Previews](#theme-previews)
- [Admin Interface](#admin-interface)
- [BSSG Post Editor](#bssg-post-editor)
- [Performance Features](#performance-features)
- [Site Configuration](#site-configuration)
- [Future Plans](#future-plans)
- [Local Development Server](#local-development-server)
- [Troubleshooting](#troubleshooting)
- [Author and License](#author-and-license)
- [Documentation](#documentation)

## Features

- Generates HTML from Markdown using pandoc, commonmark, or markdown.pl (configurable)
- Supports post metadata (title, date, tags)
- Supports `lastmod` timestamp in frontmatter for tracking content updates (used in sitemap, RSS feed, and optionally displayed on posts)
- Full date and time support with timezone awareness
- Post descriptions/summaries for previews, OpenGraph, and RSS
- Admin interface for managing posts and scheduling publications (planned for future release)
- Standalone post editor with modern Ghost-like interface for visual content creation
- Creates tag index pages with optional tag RSS feeds
- Related Posts: automatically suggests related posts based on shared tags at the end of each post
- Author index pages with conditional navigation menu and optional author RSS feeds
- Archives by year and month for chronological browsing
- Dynamic menu generation based on available pages
- Support for primary and secondary pages with automatic menu organization
- Generates `sitemap.xml` and RSS feeds with timezone support
- Two build modes: `normal` (incremental, cache-backed) and `ram` (memory-first)
- RAM mode stage timing summary printed at the end of each RAM build
- Asset pre-compression with incremental and parallel gzip processing (`.html`, `.css`, `.xml`, `.js`)
- Clean design
- No JavaScript required (except for admin interface)
- Works well without images
- Cross-platform (Linux, macOS, BSDs)
- Reading time calculation for posts
- Pagination for blog posts with configurable posts per page
- Multiple themes available (see [Themes section](#themes))
- Theme preview generator to see all available themes in action
- Supports static files (images, CSS, JS, etc.)
- Configurable clean output directory option
- Draft posts support
- Backup and restore functionality
- Incremental builds with file and metadata caching for improved performance
- Parallel processing with GNU parallel (if available) plus shell-worker fallbacks
- File locking for safe concurrent operations
- Automatic handling of different operating systems (Linux/macOS/BSDs)
- Custom URL slugs with SEO-friendly permalinks
- Featured images in posts are displayed in index, tag, and archive pages
- Support for static pages with custom URLs
- Support for custom homepage - useful if you want to build a website, not a blog
- Built-in local development server for easy previewing

## Quick Start

1. Clone the repository:
   ```bash
   git clone https://brew.bsd.cafe/stefano/BSSG.git
   cd BSSG
   ```

2. Create your first post:
   ```bash
   ./bssg.sh post
   ```

3. Build the site:
   ```bash
   ./bssg.sh build
   ```
   *(This command now invokes the modular build process located in `scripts/build/`)*

4. View your site in the `output` directory or serve it locally:
   ```bash
   ./bssg.sh server
   ```
   This will build your site and start a local web server. By default, you can access your site at `http://localhost:8000`.
   Alternatively, to manually serve the `output` directory (e.g., if you want to use a different server):
   ```bash
   cd output
   python3 -m http.server 8000 # Or any other simple HTTP server
   ```

5. Open your browser and navigate to the URL provided by the server (e.g., http://localhost:8000).

## Recommended Setup: Separating Content from Core

**Why separate?** This setup keeps your website's content (posts, pages, static files, configuration) in a dedicated directory, separate from the BSSG core scripts. This makes it much easier to update BSSG itself (using `git pull` in the core directory) without affecting or risking conflicts with your site content. This is the **recommended approach for most users**.

1.  **Clone BSSG Core (if you haven't already):**
    ```bash
    git clone https://brew.bsd.cafe/stefano/BSSG.git
    cd BSSG # Navigate into the BSSG core directory
    ```

2.  **Initialize Your Site Directory:**
    From within the BSSG core directory, run the `init` command, specifying the path where you want your new site's content to live:
    ```bash
    ./bssg.sh init /path/to/your/new/website
    ```
    *Replace `/path/to/your/new/website` with the actual path (e.g., `~/my-blog`, `./my-website`).*

3.  **Directory Structure Creation:**
    BSSG will create the necessary content directories (`src`, `pages`, `drafts`, `static`) inside `/path/to/your/new/website`. The build output (`output/`) will also be placed within this new site directory by default.

4.  **Site Configuration File:**
    A specific `config.sh.local` file will be automatically created *inside your new site directory* (`/path/to/your/new/website/config.sh.local`). This file tells BSSG where to find your content (`SRC_DIR`, `PAGES_DIR`, etc.) and where to build the output (`OUTPUT_DIR`).

5.  **Automatic Configuration Loading (Optional but Recommended):**
    The `init` script will ask if you want to modify the `config.sh.local` file located *within the BSSG core directory* to automatically point to your new site's configuration.
    *   **Choose `yes` (y):** This is the **recommended** option. It adds a line to the *core* `config.sh.local` that sources your *site's* configuration file. This means you can run `./bssg.sh` commands (like `build`, `post`, `page`) directly from the BSSG core directory, and it will automatically use the correct settings for your separated site. (Note: For reliability, the `source` command added to the core config will use the resolved absolute path to your site's configuration file, even if you provided a relative or tilde-prefixed path during `init`.)
    *   **Choose `no` (N):** If you choose no, you will need to manually specify your site's configuration file using the `--config` flag every time you run a BSSG command from the core directory that needs to know about your site:
        ```bash
        # Example: Running build from the BSSG core directory
        ./bssg.sh build --config /path/to/your/new/website/config.sh.local

        # Example: Creating a post from the BSSG core directory
        ./bssg.sh post --config /path/to/your/new/website/config.sh.local
        ```

**Benefit:** With your content separated, you can safely update the BSSG core scripts in their own directory using `git pull` without worrying about overwriting your posts, pages, or custom configurations.


## Requirements

BSSG requires the following tools:

- Bash (Note: On macOS, the default bash is too old and not compatible. You need to install a newer version using Homebrew: `brew install bash`)
- pandoc, commonmark, or markdown.pl (configurable in config.sh.local)
- Standard Unix utilities (awk, sed, grep, find, date)

### Installation of Dependencies

#### On Debian/Ubuntu:
```bash
sudo apt-get update
sudo apt-get install cmark socat
```

#### On macOS (using Homebrew):
```bash
brew install bash cmark socat
```

#### On FreeBSD:
```bash
pkg install bash cmark socat
```

#### On OpenBSD:
```bash
pkg_add bash cmark socat
```

#### On NetBSD:
```bash
pkgin in bash cmark socat
```

### Using markdown.pl instead of commonmark

If you prefer using markdown.pl instead of commonmark:

1. Set `MARKDOWN_PROCESSOR="markdown.pl"` in your `config.sh.local` file
2. Make sure markdown.pl is installed:
   - You can download it from [Daring Fireball](https://daringfireball.net/projects/markdown/)
   - Place it in your PATH or directly in the BSSG directory
   - Make it executable with `chmod +x markdown.pl`

BSSG will search for either `markdown.pl` or `Markdown.pl` (case-sensitive) in both your system PATH and the current BSSG directory.

### Using pandoc instead of commonmark

If you prefer using pandoc instead of commonmark:

1. Set `MARKDOWN_PROCESSOR="pandoc"` in your `config.sh.local` file
2. Make sure pandoc is installed:
   - On Debian/Ubuntu: `apt install pandoc`
   - On Fedora: `dnf install pandoc`
   - On macOS: `brew install pandoc`
   - On FreeBSD: `pkg install hs-pandoc`
   - On OpenBSD: `pkg_add pandoc`

Commonmark provides a stricter and more standardized Markdown implementation and is portable across different operating systems.

## Directory Structure

```
BSSG/
├── bssg.sh                        # Main command interface script
├── bssg-editor.html               # Standalone post editor (Ghost-like interface)
├── generate_theme_previews.sh     # Script to generate previews of all themes
├── scripts/                       # Supporting scripts
│   ├── build/                     # Modular build scripts
│   │   ├── main.sh                # Main build orchestrator
│   │   ├── config_loader.sh       # Loads defaults and local overrides
│   │   ├── deps.sh                # Dependency checks
│   │   ├── cache.sh               # Cache/config hash helpers
│   │   ├── content.sh             # Metadata/excerpt/markdown helpers
│   │   ├── indexing.sh            # File/tags/authors/archive index builders
│   │   ├── templates.sh           # Template preload/menu generation
│   │   ├── generate_posts.sh      # Post rendering
│   │   ├── generate_pages.sh      # Static page rendering
│   │   ├── generate_index.sh      # Homepage/pagination generation
│   │   ├── generate_tags.sh       # Tag pages (+ optional tag RSS)
│   │   ├── generate_authors.sh    # Author pages (+ optional author RSS)
│   │   ├── generate_archives.sh   # Archive pages (year/month)
│   │   ├── generate_feeds.sh      # Main RSS + sitemap
│   │   ├── generate_secondary_pages.sh # Creates pages.html index
│   │   ├── related_posts.sh       # Related-post indexing/render helpers
│   │   ├── post_process.sh        # URL rewrite + permissions fixes
│   │   ├── assets.sh              # Static copy + CSS/theme handling
│   │   ├── ram_mode.sh            # RAM-mode preload/in-memory datasets
│   │   └── utils.sh               # Shared helpers (time, URLs, parallel)
│   ├── post.sh                    # Handles post creation
│   ├── page.sh                    # Handles page creation
│   ├── edit.sh                    # Handles post/page editing (updates lastmod)
│   ├── delete.sh                  # Handles post/page/draft deletion
│   ├── list.sh                    # Lists posts, pages, drafts, tags
│   ├── backup.sh                  # Backup functionality
│   ├── restore.sh                 # Restore functionality
│   ├── benchmark.sh               # Build benchmarking helper
│   ├── server.sh                  # Local development server implementation
│   ├── theme.sh                   # Theme management and processing (legacy helper)
│   ├── template.sh                # Template processing utilities (legacy helper)
│   └── css.sh                     # CSS generation utilities (legacy helper)
├── src/                           # Source directory for markdown posts (Configurable: $SRC_DIR)
│   └── *.md                       # Markdown posts
├── pages/                         # Source directory for static pages (Configurable: $PAGES_DIR)
│   └── *.md                       # Markdown pages
├── drafts/                        # Source directory for drafts (Configurable: $DRAFTS_DIR)
│   ├── *.md/*.html                # Draft posts
│   └── pages/                     # Optional subdirectory for page drafts
│       └── *.md/*.html            # Draft pages
├── templates/                     # HTML templates (used by themes)
│   ├── header.html                # Header template
│   └── footer.html                # Footer template
├── themes/                        # Theme directory for different visual styles
│   ├── default/                   # Default theme
│   ├── dark/                      # Dark theme
│   └── ...                        # Other themes
├── static/                        # Static files to be copied to output directory
├── admin/                         # Admin interface files
├── example/                       # Theme preview directory (generated)
├── .bssg_cache/                   # Cache directory for improved performance
├── config.sh                      # Default site configuration
├── config.sh.local                # Optional user overrides for configuration
└── output/                        # Generated HTML website (created during build)
```

## Usage

### Basic Commands

```bash
cd BSSG
./bssg.sh [--config <path>] [command] [options]
```

### Available Commands

```
Usage: ./bssg.sh [--config <path>] command [options]

Commands:
  post [-html] [draft_file]
                               Interactive: create/edit post or continue a draft.
  post -t <title> [-T <tags>] [-s <slug>] [--html] [-d] {-c <content> | -f <file> | --stdin} [--build]
                               Command-line: create post non-interactively.
  page [-html] [-s] [draft_file]
                               Create a page or continue a page draft.
  edit [-n] <file>             Edit an existing post/page/draft (updates lastmod).
  delete [-f] <file>           Delete a post/page/draft.
  list                         List all posts.
  tags [-n]                    List all tags. Use -n to sort by post count.
  drafts                       List all draft posts.
  backup                       Create a backup of posts, pages, drafts, and config.
  restore [backup_file|ID]     Restore from a backup (options: --no-content, --no-config).
  backups                      List all available backups.
  build [options]              Build the site (run './bssg.sh build --help' for full options).
  server [options]             Build and run local server (run './bssg.sh server --help').
  init <target_directory>      Initialize a new site in the specified directory.
  help                         Show help.
```

### Creating Posts and Pages

To create a new post interactively:

```bash
./bssg.sh post
```

To create a new page interactively:

```bash
./bssg.sh page
```

You'll be prompted for a title, and `$EDITOR` will open for you to write your content. By default, the site rebuilds automatically after saving an interactive post if `REBUILD_AFTER_POST` is set to `true` in your configuration (`config.sh` or `config.sh.local`).

To create a post non-interactively via the command line (see command list above for all options):

```bash
# Example: Create markdown post from file, force build
./bssg.sh post -t "My CLI Post" -f content.md --build

# Example: Create HTML post from stdin, don't force build (relies on REBUILD_AFTER_POST)
echo "<p>Hello</p>" | ./bssg.sh post -t "HTML Test" --html --stdin
```

To create a secondary page (appears under the "Pages" menu):

```bash
./bssg.sh page -s
```

Secondary pages will be listed under a "Pages" menu item in the navigation, which appears automatically when secondary pages exist.

#### Creating HTML Content

To create content in HTML format instead of Markdown:

```bash
./bssg.sh post -html  # For posts
./bssg.sh page -html  # For pages
```

Example of HTML content:

```html
---
title: HTML Example
date: 2023-01-15
tags: html, example
---

<h2>This is an HTML post</h2>
<p>You can use full HTML markup in this post.</p>
<ul>
    <li>Item 1</li>
    <li>Item 2</li>
</ul>
```

#### Working with Drafts

To save content as a draft (will not be published):

```bash
./bssg.sh post -d  # For posts
./bssg.sh page -d  # For pages
```

To continue editing a draft:

```bash
./bssg.sh post drafts/your-draft-file.md  # For posts
./bssg.sh page drafts/pages/your-draft-file.md  # For pages
```

To list all draft posts:

```bash
./bssg.sh drafts
```

### Editing and Deleting Posts

To edit an existing post:

```bash
./bssg.sh edit src/your-post-file.md
```

To rename the file when the title changes:

```bash
./bssg.sh edit -n src/your-post-file.md
```

To delete a post:

```bash
./bssg.sh delete src/your-post-file.md
```

### Listing Posts and Tags

To list all posts:

```bash
./bssg.sh list
```

To list all tags:

```bash
./bssg.sh tags
```

To list tags sorted by number of posts:

```bash
./bssg.sh tags -n
```

### Backup and Restore

To create a backup of all posts:

```bash
./bssg.sh backup
```

To list available backups:

```bash
./bssg.sh backups
```

To restore from a backup (will prompt for confirmation):

```bash
./bssg.sh restore [backup_file|ID]
```

You can use these options with restore to selectively restore content:
```bash
./bssg.sh restore backup_id --no-content  # Don't restore content (src, drafts, pages)
./bssg.sh restore backup_id --no-config   # Don't restore configuration (config.sh, config.sh.local)
```

### Build Options

```
Usage: ./bssg.sh build [options]

Options:
  --src DIR               Override source directory (from config: SRC_DIR)
  --pages DIR             Override pages directory (from config: PAGES_DIR)
  --drafts DIR            Override drafts directory (from config: DRAFTS_DIR)
  --output DIR            Override output directory (from config: OUTPUT_DIR)
  --templates DIR         Override templates directory (from config: TEMPLATES_DIR)
  --themes-dir DIR        Override themes directory (from config: THEMES_DIR)
  --theme NAME            Override theme for this build
  --static DIR            Override static directory (from config: STATIC_DIR)
  --clean-output [bool]   Clean output directory before build (default from config)
  -f, --force-rebuild     Ignore cache and rebuild all files
  --build-mode MODE       Build mode: normal or ram
  --site-title TITLE      Override site title
  --site-url URL          Override site URL
  --site-description DESC Override site description
  --author-name NAME      Override author name
  --author-email EMAIL    Override author email
  --posts-per-page NUM    Override pagination size
  --deploy                Force deployment after successful build (overrides config)
  --no-deploy             Skip deployment after build (overrides config)
  --help                  Show build help
```

`--config <path>` is a global option and can be passed with any command (including `build`) to load a specific configuration file.

Examples:

```bash
./bssg.sh --config /path/to/site/config.sh.local build --build-mode ram
./bssg.sh build --output ./public --clean-output true
```

The option list above reflects the current `build --help` output.

### Internationalization (i18n)

BSSG supports generating the site in different languages.

1.  **Configuration:**
    *   Set the desired language code in your `config.sh.local` file:
        ```bash
        SITE_LANG="es" # Use 'es' for Spanish, 'fr' for French, etc.
        ```
    *   If `SITE_LANG` is not set or the specified locale file doesn't exist, BSSG will default to English (`en`).

2.  **Locale Files:**
    *   Translations are stored in the `locales/` directory.
    *   Each language has its own file (e.g., `locales/en.sh`, `locales/es.sh`).
    *   These files contain exported shell variables for all translatable strings used in the templates and the build script (e.g., `export MSG_HOME="Home"`).

3.  **Adding a New Language:**
    *   Copy `locales/en.sh` to a new file named after the language code (e.g., `locales/fr.sh` for French).
    *   Translate the string values within the new file.
    *   Set `SITE_LANG` in `config.sh.local` to the new language code (e.g., `SITE_LANG="fr"`).
    *   Run `./bssg.sh build` to generate the site in the new language.

### Post and Page Management

*   **Edit Posts:**
    ```bash
    ./bssg.sh edit <post_filename.md>
    ```
*   **Delete Posts:**
    ```bash
    ./bssg.sh delete <post_filename.md>
    ```
*   **List Posts:**
    ```bash
    ./bssg.sh list
    ```
*   **List Tags:**
    ```bash
    ./bssg.sh tags
    ```

## Markdown Post Format

Posts should include YAML frontmatter at the beginning:

```markdown
---
title: Post Title
date: YYYY-MM-DD HH:MM:SS +TIMEZONE
lastmod: YYYY-MM-DD HH:MM:SS +TIMEZONE # Optional: Last modification date
tags: tag1, tag2, tag3
slug: custom-slug
image: /path/to/image.jpg
image_caption: Optional caption for the image
description: A brief summary of your post that will appear in listings, social media shares, and RSS feeds.
author_name: John Doe # Optional: Override default site author
author_email: john@example.com # Optional: Override default site author email
---

Content goes here...
```

- The `date` format supports full timestamps with timezone information. If you don't specify a time, the system will use the current time. If you don't specify a timezone, the system will use your local timezone.
- The optional `lastmod` field allows you to specify the date and time the content was last modified. It uses the same format as `date`. If omitted, it defaults to the `date` value. This field is used:
    - For the `<lastmod>` tag in `sitemap.xml`.
    - For the `<atom:updated>` tag in `rss.xml`.
    - To optionally display an "Updated on" date on the post page if it differs from the publish `date`.

### Post Description

The `description` field in the frontmatter lets you provide a brief summary of your post. This description will be used in:

- Post previews on the index, tag, and archive pages
- OpenGraph meta tags for better social media sharing
- RSS feed entries

If you don't specify a description, the system will automatically extract one from the beginning of your post content.

### Featured Images

The `image` field in the frontmatter allows you to specify an image path that will be displayed with your post. This can be:
- A relative path (e.g., `/images/photo.jpg`) that refers to a file in your static directory
- An absolute URL (e.g., `https://example.com/images/photo.jpg`)

The optional `image_caption` field lets you add a descriptive caption to the featured image.

When you specify an image, it will appear:
- At the top of individual post pages
- As a thumbnail in index pages, tag pages, and archive pages
- In the RSS feed
- In OpenGraph and Twitter metadata for better social media sharing

### Multi-Author Support

BSSG supports multiple authors through optional frontmatter fields that can override the default site author configuration on a per-post basis.

#### Author Fields

- `author_name`: The name of the post author (optional)
- `author_email`: The email address of the post author (optional)

#### Fallback Behavior

BSSG uses intelligent fallback logic for author information:

1. **Custom Author**: If both `author_name` and `author_email` are specified, they will be used for that post
2. **Name Only**: If only `author_name` is specified, the name will be used but no email will be included in metadata
3. **Default Fallback**: If author fields are empty or missing, the default `AUTHOR_NAME` and `AUTHOR_EMAIL` from your site configuration will be used

#### Author Index Pages

When multiple authors are detected in your posts, BSSG automatically generates:

- **Main Authors Index**: A page at `/authors/` listing all authors with their post counts
- **Individual Author Pages**: Pages at `/authors/author-slug/` showing all posts by a specific author
- **Conditional Navigation**: An "Authors" menu item that only appears when you have multiple authors (configurable threshold)

The author pages reuse the same styling as tag pages for visual consistency and include:
- Post listings sorted by date (newest first)
- Post counts and metadata
- Schema.org structured data for SEO
- Responsive design that works on all devices

#### Configuration Options

You can control author page behavior in your `config.sh.local`:

```bash
# Enable/disable author pages (default: false)
ENABLE_AUTHOR_PAGES=false

# Minimum number of authors to show the Authors menu (default: 2)
SHOW_AUTHORS_MENU_THRESHOLD=2

# Enable author-specific RSS feeds (default: false)
ENABLE_AUTHOR_RSS=false
```

#### Where Author Information Appears

Author information is displayed and used in:

- **Post Pages**: Copyright notices in the footer
- **Index Pages**: "by Author Name" in post listings
- **Author Pages**: Dedicated pages listing posts by each author
- **Navigation Menu**: "Authors" link (when multiple authors exist)
- **RSS Feeds**: Dublin Core `dc:creator` elements with proper author attribution
- **Schema.org Metadata**: JSON-LD structured data for search engines
- **Archive Pages**: Author information in post listings

#### Examples

**Post with custom author:**
```markdown
---
title: Guest Post Example
author_name: Jane Smith
author_email: jane@example.com
---
```

**Post with name only (no email):**
```markdown
---
title: Anonymous Contributor Post
author_name: Anonymous Contributor
author_email: # Leave empty - no email will be included
---
```

**Post using default site author:**
```markdown
---
title: Regular Post
# No author fields - will use AUTHOR_NAME and AUTHOR_EMAIL from config
---
```

This feature is particularly useful for:
- Guest posts from different authors
- Multi-author blogs or publications
- Posts where you want to credit a specific contributor
- Maintaining author attribution when migrating content from other platforms
- Creating author-focused content organization alongside tags and archives

## Customization

To customize the appearance of your site, you can edit:

- Custom Homepage Content: If you want a custom landing page instead of the default "Latest Posts" list (useful for non-blog websites), simply create a file named `index.md` inside your `pages/` directory (`${PAGES_DIR}`). BSSG will automatically use the content of this file for the homepage (`index.html`) and will *not* display the post list. Ensure the `index.md` file has the frontmatter `slug: index` set.

- `templates/header.html` - Site header and navigation
- `templates/footer.html` - Site footer
- CSS styles are generated in `output/css/style.css` 
- `config.sh.local` - Configuration file for site-wide settings

-   **`CUSTOM_CSS`:** (Optional) Specify a path (relative to the output directory root) to a custom CSS file. If set, a `<link>` tag will be added to the `<head>` of every generated page, after the theme's default `style.css`. The CSS file itself should be placed in your `$STATIC_DIR` (default: `static/`) to be copied to the output directory. Example: `CUSTOM_CSS="/css/my-styles.css"` (assuming `static/css/my-styles.css` exists).



### Configuration

The `config.sh` file contains the default configuration settings for the site generator:

```bash
# Directory configuration
SRC_DIR="src"
PAGES_DIR="pages"  # Directory for static pages
OUTPUT_DIR="output"
TEMPLATES_DIR="templates"
THEMES_DIR="themes"
STATIC_DIR="static"
DRAFTS_DIR="drafts" # Directory for drafts
THEME="default"
CACHE_DIR=".bssg_cache" # Default cache directory location (relative to BSSG root)

# Build configuration
CLEAN_OUTPUT=false # If true, BSSG will always perform a full rebuild
REBUILD_AFTER_POST=true # Build site automatically after creating a new post (scripts/post.sh)
REBUILD_AFTER_EDIT=true # Build site automatically after editing a post (scripts/edit.sh)
PRECOMPRESS_ASSETS="false" # Options: "true", "false". If true, compress text assets (HTML, CSS, XML, JS) with gzip during build.
BUILD_MODE="normal" # Options: "normal", "ram". RAM mode preloads inputs and keeps build indexes/data in memory.

# Optional performance tunables (not required):
# RAM_MODE_MAX_JOBS=6            # Cap parallel workers in RAM mode (defaults to 6)
# RAM_MODE_VERBOSE=false         # Extra RAM-mode debug/timing logs
# PRECOMPRESS_GZIP_LEVEL=9       # gzip level for precompression (1-9)
# PRECOMPRESS_MAX_JOBS=0         # 0=auto based on CPU/RAM mode cap
# PRECOMPRESS_VERBOSE=false      # Verbose logs for precompression
# RAM_RSS_PREFILL_MIN_HITS=2     # RAM tag-RSS cache prefill threshold
# RAM_RSS_PREFILL_MAX_POSTS=24   # RAM tag-RSS prefill upper bound

# Customization
CUSTOM_CSS="" # Optional: Path to custom CSS file relative to output root (e.g., "/css/custom.css"). File should be placed in STATIC_DIR.

# Site information
SITE_TITLE="My new BSSG site"
SITE_DESCRIPTION="A complete SSG - written in bash"
SITE_URL="http://localhost:8000"
AUTHOR_NAME="Anonymous" 
AUTHOR_EMAIL="anonymous@example.com"

# Content configuration
DATE_FORMAT="%Y-%m-%d %H:%M:%S %z"
TIMEZONE="local"  # Options: "local", "GMT", or a specific timezone like "America/New_York"
SHOW_TIMEZONE="false" # Options: "true", "false". Whether to display the timezone in rendered dates.
POSTS_PER_PAGE=10
RSS_ITEM_LIMIT=15 # Number of items to include in the RSS feed.
RSS_INCLUDE_FULL_CONTENT="false" # Options: "true", "false". Include full post content in RSS feed.
RSS_FILENAME="rss.xml" # The filename for the main RSS feed (e.g., feed.xml, rss.xml)
INDEX_SHOW_FULL_CONTENT="false" # Options: "true", "false". Show full post content on homepage instead of just description/excerpt.
ENABLE_ARCHIVES=true  # Enable or disable archive pages
ENABLE_AUTHOR_PAGES=false # Enable or disable author pages (default: false)
ENABLE_AUTHOR_RSS=false # Enable or disable author-specific RSS feeds (default: false)
SHOW_AUTHORS_MENU_THRESHOLD=2 # Minimum authors to show menu (default: 2)
URL_SLUG_FORMAT="Year/Month/Day/slug" # Format for post URLs. Available: Year, Month, Day, slug
ENABLE_TAG_RSS=true # Enable or disable tag-specific RSS feed generation (default: true)

# Archive Page Configuration
ARCHIVES_LIST_ALL_POSTS="false" # Options: "true", "false". If true, list all posts on the main archive page.

# Page configuration
PAGE_URL_FORMAT="slug" # Format for page URLs. Available: slug, filename (without ext)

# Markdown processing configuration
MARKDOWN_PROCESSOR="commonmark" # Options: "pandoc", "commonmark", or "markdown.pl"

# Language Configuration
SITE_LANG="en"  # Default language code (e.g., en, es, fr). See locales/ directory.

# Related Posts Configuration
ENABLE_RELATED_POSTS=true # Enable or disable related posts feature
RELATED_POSTS_COUNT=3 # Number of related posts to show (default: 3)

# Server Configuration (for 'bssg.sh server' command)
# These are the defaults used by 'bssg.sh server' if not overridden by command-line options.
BSSG_SERVER_PORT_DEFAULT="8000"    # Default port for the local development server
BSSG_SERVER_HOST_DEFAULT="localhost" # Default host for the local development server

# Deployment configuration
DEPLOY_AFTER_BUILD="false" # Options: "true", "false". Automatically deploy after a successful build.
DEPLOY_SCRIPT=""           # Path to the deployment script to execute if DEPLOY_AFTER_BUILD is true.

# Terminal colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color 
```

#### Date Format Examples

- `DATE_FORMAT="%Y-%m-%d %H:%M:%S"` - 2023-05-15 14:30:45 (default)
- `DATE_FORMAT="%d-%m-%Y %H:%M:%S"` - 15-05-2023 14:30:45 (European format)
- `DATE_FORMAT="%b %d, %Y at %I:%M %p"` - May 15, 2023 at 02:30 PM (American format)
- `DATE_FORMAT="%d/%m/%Y"` - 15/05/2023 (date only)

#### Local Configuration

**IMPORTANT:** Do not modify `config.sh` directly. This file is part of the git repository and your changes could be lost during updates.

For local modifications, use the `config.sh.local` file instead. This file will override any settings in the main configuration and is ignored by git. You can override any variable from `config.sh`, including `SRC_DIR`, `PAGES_DIR`, and `DRAFTS_DIR`.

Example `config.sh.local`:
```bash
# Override site information for local development
SITE_TITLE="Development Site"
SITE_URL="http://localhost:8080"
AUTHOR_NAME="Your Name"
```

## Static Files

Any files placed in the `static/` directory will be automatically copied to the output directory during the build process. This is useful for including:

- Images
- Additional CSS files
- JavaScript files
- Downloadable files 
- Favicons
- Any other static assets

Example usage:
1. Place an image in `static/images/photo.jpg`
2. Reference it in your post as:
   ```markdown
   ![My Photo](/images/photo.jpg)
   ```
3. Or set it as a featured image in your post frontmatter:
   ```
   ---
   title: Post with Image
   image: /images/photo.jpg
   ---
   ```

### Deployment

BSSG allows you to automatically execute a custom deployment script after a successful build process. This is useful for uploading your site to a server, updating a Git repository, or performing any other post-build actions.

**Configuration:**

Two configuration variables in `config.sh.local` control this feature:

-   `DEPLOY_AFTER_BUILD`: Set this to `"true"` to enable automatic deployment after a successful build. Defaults to `"false"`.
-   `DEPLOY_SCRIPT`: Specify the path to your deployment script. This can be an absolute path or a path relative to the project root (where `bssg.sh` resides).

Example `config.sh.local`:

```bash
# Automatically deploy after build
DEPLOY_AFTER_BUILD="true"
# Path to the deployment script (relative to project root)
DEPLOY_SCRIPT="scripts/deploy.sh"
```

**Command-Line Overrides:**

You can override the `DEPLOY_AFTER_BUILD` setting for a specific build using command-line flags:

-   `./bssg.sh build --deploy`: Forces the deployment script to run, regardless of the `DEPLOY_AFTER_BUILD` setting.
-   `./bssg.sh build --no-deploy`: Prevents the deployment script from running, regardless of the `DEPLOY_AFTER_BUILD` setting.

**Deployment Script:**

-   Your deployment script (e.g., `scripts/deploy.sh`) must be executable (`chmod +x scripts/deploy.sh`).
-   BSSG will execute the script from the project root directory.
-   The script receives two arguments:
    1.  The path to the generated output directory (`$OUTPUT_DIR`).
    2.  The site URL (`$SITE_URL`).
-   The script should exit with a status code of `0` on success. A non-zero exit code will be reported as an error in the build output, but will not necessarily stop the build process itself (unless you modify `scripts/build/main.sh` to do so).

Example `scripts/deploy.sh` using `rsync`:

```bash
#!/usr/bin/env bash

OUTPUT_DIR="$1"
SITE_URL="$2"
REMOTE_USER="your_user"
REMOTE_HOST="your_server.com"
REMOTE_PATH="/path/to/your/webroot/"

echo "Deploying site from '$OUTPUT_DIR' to $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH"
echo "Site URL: $SITE_URL"

# Example rsync command (ensure ssh keys are set up for passwordless login)
rsync -avz --delete "$OUTPUT_DIR/" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH"

if [ $? -eq 0 ]; then
  echo "Deployment successful."
  exit 0
else
  echo "Deployment failed!"
  exit 1
fi
```

## Themes

BSSG includes a variety of themes to customize the look of your site. Themes are organized in the `themes/` directory. You can see a list and preview of the available themes [here](https://bssg.dragas.net/example)

### Some of the Available Themes

#### Modern Themes
- `default` - A clean and accessible blog theme
- `minimal` - A clean and minimal theme
- `dark` - Dark mode theme
- `flat` - Microsoft Metro/Modern UI inspired flat design
- `glassmorphism` - Modern frosted glass effect with blue/teal gradient
- `material` - Material Design inspired theme
- `art-deco` - Inspired by 1920s-30s Art Deco style with geometric patterns, elegant fonts, and gold/black/silver/jewel color palettes
- `bauhaus` - Inspired by the Bauhaus school, focusing on functionality, primary geometric shapes, primary colors plus black and white, and clean sans-serif typography
- `mid-century` - Mid-century modern aesthetic (1950s-60s), with clean lines, organic shapes, specific color palettes and characteristic fonts
- `swiss-design` - International Typographic Style, focused on grids, sans-serif typography (like Helvetica), strong visual hierarchy, and minimalism
- `nordic-clean` - Inspired by Scandinavian design, very minimal, airy, with plenty of white space, light and natural colors, and clean typography
- `braun` - Inspired by iconic Braun design with a focus on minimalism, functionality, and understated elegance
- `mondrian` - Inspired by Piet Mondrian's De Stijl artwork featuring primary colors, black grid lines, geometric shapes, and white backgrounds

#### Retro Computing Themes
- `amiga500` - Amiga 500 inspired theme
- `apple2` - Apple II inspired theme
- `atarist` - Atari ST inspired theme
- `c64` - Commodore 64 inspired theme
- `msdos` - MS-DOS inspired theme
- `terminal` - Terminal/console theme
- `zxspectrum` - ZX Spectrum inspired theme
- `nes` - Retro theme inspired by Nintendo Entertainment System, using the NES color palette and pixel art aesthetics
- `gameboy` - Retro theme inspired by Game Boy, using a light green background with dark green text for readability while maintaining nostalgic feel
- `tty` - Ultra-minimal theme simulating an old teletype output with monospace text on simple background and terminal-like aesthetics
- `mario` - Super Mario Bros inspired theme with iconic blue sky background, green pipes for navigation, brick blocks, question blocks, and the classic Mario color palette

#### Operating System Themes
- `beos` - BeOS inspired theme
- `macclassic` - Classic Mac OS inspired theme
- `macos9` - Mac OS 9 inspired theme
- `nextstep` - NeXTSTEP inspired theme
- `osx` - macOS inspired theme
- `win311` - Windows 3.11 inspired theme
- `win95` - Windows 95 inspired theme
- `win7` - Windows 7 inspired theme
- `winxp` - Windows XP inspired theme

#### Web Era Themes
- `web1` - Web 1.0 theme with HTML 3.2 aesthetics
- `web2` - Web 2.0 theme with glossy buttons and gradients
- `vaporwave` - Retro futurism with 80s aesthetics and neon colors
- `y2k` - Turn of the millennium aesthetic with bold colors and bubble effects
- `bbs` - Bulletin Board System theme with ANSI colors and ASCII art aesthetics

#### Content-Focused Themes
- `docs` - A clean, structured theme ideal for technical documentation with excellent code formatting and clear navigation
- `longform` - Optimized for reading long articles with highly readable typography, contained text width, and minimal distractions
- `reader-mode` - Simulates browser reader mode with almost total emphasis on text, sepia background, very readable serif font, and minimal graphic elements
- `thoughtful` -  A warm, accessible, and performant theme for personal reflection blogs and thoughtful writing
- `text-only` - A step beyond minimalism using browser defaults with clean base typography for readability and lightning-fast loading

#### Special Themes
- `brutalist` - Raw, minimalist concrete-inspired design
- `newspaper` - Classic newspaper layout
- `diary` - Personal diary/journal style
- `random` - Selects a random theme (from the available themes) for each build

To use a theme, specify it in your config file:

```bash
THEME="msdos"
```

For a surprise each time, use the random option:

```bash
THEME="random"
```

### Theme Previews

BSSG includes a script to generate previews of all available themes. This is useful for seeing how each theme looks with your content before deciding which one to use.

To generate theme previews:

```bash
./generate_theme_previews.sh
```

This will create a directory called `example/` containing subdirectories for each theme, along with an index.html file that allows you to navigate between them.

You can also specify a custom SITE_URL for the previews:

```bash
./generate_theme_previews.sh --site-url "https://example.com/blog"
```

The script will use the SITE_URL from the following sources in order of precedence:
1. Command line argument (--site-url)
2. Local config file (config.sh.local)
3. Main config file (config.sh)
4. Default value (http://localhost)

Each theme preview will be accessible at `SITE_URL/theme` (e.g., `https://example.com/blog/dark`).

## Admin Interface

**Note: The admin interface is currently in development and has not been released yet. This section describes planned features for a future release.**

BSSG will include an admin interface for managing your blog. When released, the admin interface will provide a user-friendly way to:
- Create and edit posts with a WYSIWYG Markdown editor
- Create and manage drafts
- Schedule posts for future publication
- Organize posts with tags
- View statistics about your blog

The admin interface will feature:
1. Node.js-based server
2. Modern web interface
3. Post scheduling capabilities
4. Draft management
5. Blog statistics and analytics

### Post Scheduling (Planned Feature)

The planned admin interface will allow you to schedule posts for future publication. When available, you will be able to:

1. Choose "Schedule for later" option
2. Select the date and time for publication
3. The post will be stored as a draft until the scheduled time
4. At the scheduled time, the post will be automatically published

## BSSG Post Editor

BSSG includes a standalone post editor (`bssg-editor.html`) that provides a modern, Ghost-like writing experience entirely in your browser. This editor is perfect for users who prefer a visual interface over command-line tools.

### Features

- **Modern Interface**: Clean, distraction-free design inspired by Ghost CMS
- **Split-Pane Editor**: Side-by-side markdown editor and live preview (toggleable)
- **Complete BSSG Integration**: Full support for all BSSG frontmatter fields
- **Smart Auto-Save**: Automatically saves your work every 10 words or after 5 seconds of inactivity
- **Article Management**: Save, load, search, and organize multiple articles locally
- **Unsplash Integration**: Built-in image browser with search and automatic attribution
- **Rich Toolbar**: Quick formatting buttons for headers, lists, links, images, code, and more
- **Keyboard Shortcuts**: Full keyboard support (Ctrl+B for bold, Ctrl+I for italic, Ctrl+S to save, etc.)
- **Theme Support**: Dark/light mode toggle
- **Focus Mode**: Distraction-free writing environment
- **Export Options**: Export to .md files, copy to clipboard, or import existing files
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Offline Capable**: No server required - runs entirely in your browser

### Getting Started

1. **Open the Editor**: Simply open `bssg-editor.html` in your web browser
2. **Configure Settings** (Optional): Add your Unsplash API key in the settings panel for real image search
3. **Start Writing**: Fill in the post metadata in the sidebar and start writing in the editor
4. **Save Your Work**: Use Ctrl+S to save articles locally, or use the auto-save feature
5. **Export**: When ready, export your post as a .md file with proper BSSG formatting

### Usage Tips

- **Frontmatter**: All BSSG frontmatter fields are supported - title, date, tags, slug, description, image, etc.
- **File Naming**: Exported files follow BSSG naming convention: `YYYY-MM-DD-slug.md`
- **Image Integration**: Use the Unsplash button (🖼️) to search and insert images with proper attribution
- **Article Management**: Save multiple articles locally and switch between them using the Load button
- **Keyboard Shortcuts**:
  - `Ctrl+N`: New article
  - `Ctrl+S`: Save article
  - `Ctrl+O`: Load article
  - `Ctrl+P`: Toggle preview
  - `Ctrl+B`: Bold text
  - `Ctrl+I`: Italic text
  - `Ctrl+K`: Insert link
  - `Esc`: Exit focus mode

### Unsplash Integration

To use real Unsplash images instead of demo placeholders:

1. Get a free API key from [Unsplash Developers](https://unsplash.com/developers)
2. Enter your API key in the Settings section of the editor
3. Use the image button (🖼️) to search and select professional photos
4. Images are automatically attributed according to Unsplash guidelines

The editor works without an API key using demo images, but real Unsplash integration provides access to millions of high-quality photos.

### Integration with BSSG Workflow

The BSSG Post Editor generates markdown files that are fully compatible with your BSSG workflow:

1. **Write** your post in the editor
2. **Export** the .md file to your BSSG `src/` directory
3. **Build** your site with `./bssg.sh build`
4. **Publish** as usual

The editor can also import existing BSSG posts for editing, making it easy to update content with a visual interface.

### Embedding the Editor in Your Website

Since the BSSG Post Editor runs entirely in the browser with no server dependencies, you can safely embed it directly in your published website. This allows you to access the editor from anywhere and provides a convenient way to create content on-the-go.

**To embed the editor:**

1. **Copy the editor file** to your static directory:
   ```bash
   cp bssg-editor.html static/editor.html
   ```

2. **Build your site** as usual:
   ```bash
   ./bssg.sh build
   ```

3. **Access the editor** through your website:
   ```
   https://yoursite.com/editor.html
   ```

**Benefits of embedding:**

- **Remote Access**: Write posts from any device with internet access
- **No Installation**: No need to have BSSG installed locally to create content
- **Secure**: Since it's client-side only, there are no security implications
- **Convenient**: Always available alongside your published content
- **Mobile Friendly**: The responsive design works well on tablets and phones

**Workflow with embedded editor:**

1. **Access** the editor at `yoursite.com/editor.html`
2. **Write** your post using the visual interface
3. **Export** the markdown file when finished
4. **Upload** the file to your `src/` directory (via FTP, Git, or your preferred method)
5. **Rebuild** your site to publish the new content

**Security Note**: The editor stores data only in your browser's local storage and never transmits content to external servers (except for optional Unsplash image search). All article management and auto-save functionality works entirely offline, making it safe to embed in public websites.

## Performance Features

BSSG is designed to be efficient even with large sites, using several performance-enhancing techniques:

### Incremental Builds

BSSG intelligently rebuilds only what has changed. When you run the build command, it:

1. Checks if source files have been modified since the last build
2. Checks if templates have been modified
3. Checks if configuration has changed
4. Only rebuilds files affected by changes

### Metadata Caching

The system maintains a cache of extracted metadata from markdown files to reduce repeated parsing:

- Extracted frontmatter is stored in `.bssg_cache/meta/`
- File index information is stored in `.bssg_cache/file_index.txt`
- Tags index information is stored in `.bssg_cache/tags_index.txt`

### RAM Build Mode

BSSG supports a RAM-first build mode for faster full rebuilds and lower disk churn:

- Set `BUILD_MODE="ram"` in `config.sh.local`, or run `./bssg.sh build --build-mode ram`
- Source/posts/pages/templates/locales are preloaded in memory
- Build indexes (file/tags/authors/archive, plus page lists) are kept in memory
- RAM mode intentionally skips cache persistence and always behaves like an in-memory full rebuild
- A stage timing summary is printed at the end of RAM-mode builds
- On low-end disk-bound hosts, RAM mode can significantly reduce build time by avoiding repeated disk reads

### Parallel Processing

BSSG uses multiple execution strategies to process files in parallel:

- Automatically detects GNU parallel and enables it for builds with many files
- Falls back to internal shell workers when GNU parallel is unavailable or unsuitable for a stage
- Auto-detects CPU core count for worker sizing
- In RAM mode, worker count is capped by `RAM_MODE_MAX_JOBS` (default: `6`) to reduce memory pressure

To take advantage of parallel processing, install GNU parallel:

```bash
# Debian/Ubuntu
sudo apt-get install parallel

# macOS
brew install parallel

# FreeBSD
pkg install parallel
```

### Real-World Result

On a single-core OpenBSD server with spinning disks, the maintainer observed build time dropping to about one third of the previous release when building with `BUILD_MODE="ram"`.

## Site Configuration

Key configuration options:

```bash
# Site information
SITE_TITLE="My Journal"
SITE_DESCRIPTION="A personal journal and introspective newspaper" 
SITE_URL="http://localhost"
AUTHOR_NAME="Anonymous"
AUTHOR_EMAIL="anonymous@example.com"

# Content configuration
DATE_FORMAT="%Y-%m-%d %H:%M:%S %z"
TIMEZONE="local"  # Options: "local", "GMT", or a specific timezone
SHOW_TIMEZONE="false" # Options: "true", "false". Determines if the timezone offset (e.g., +0200) is shown in displayed dates.
POSTS_PER_PAGE=10
BUILD_MODE="normal" # "normal" (incremental cache-backed) or "ram" (memory-first)
ENABLE_ARCHIVES=true  # Enable or disable archives by year/month
URL_SLUG_FORMAT="Year/Month/Day/slug"  # Format for post URLs
RSS_ITEM_LIMIT=15 # Number of items to include in the RSS feed.
RSS_INCLUDE_FULL_CONTENT="false" # Options: "true", "false". If set to "true", the full post content will be included in the RSS feed description instead of the excerpt. Useful for readers that consume entire posts via RSS.
INDEX_SHOW_FULL_CONTENT="false" # Options: "true", "false". If set to "true", the full post content will be displayed on the homepage and paginated index pages instead of just the description/excerpt.
ENABLE_TAG_RSS=true # Options: "true", "false". If set to "true" (default), an additional RSS feed will be generated for each tag at `output/tags/<tag-slug>/rss.xml`.

# Precompression options
PRECOMPRESS_ASSETS="false" # Generate .gz siblings for changed text assets
# PRECOMPRESS_GZIP_LEVEL=9
# PRECOMPRESS_MAX_JOBS=0
# PRECOMPRESS_VERBOSE=false

# RAM-mode tuning (optional)
# RAM_MODE_MAX_JOBS=6
# RAM_MODE_VERBOSE=false
# RAM_RSS_PREFILL_MIN_HITS=2
# RAM_RSS_PREFILL_MAX_POSTS=24

# Related Posts configuration
ENABLE_RELATED_POSTS=true # Options: "true", "false". If set to "true" (default), related posts based on shared tags will be shown at the end of each post.
RELATED_POSTS_COUNT=3 # Number of related posts to display (default: 3, recommended maximum: 5).

# Multi-author configuration
ENABLE_AUTHOR_PAGES=false # Options: "true", "false". If set to "true", author index pages will be generated.
ENABLE_AUTHOR_RSS=false # Options: "true", "false". If set to "true", RSS feeds will be generated for each author.
SHOW_AUTHORS_MENU_THRESHOLD=2 # Minimum number of authors required to show the "Authors" menu item.
```

The `URL_SLUG_FORMAT` setting determines how your post URLs are structured. By default, it uses `Year/Month/Day/slug` which creates URLs like `http://yoursite.com/2023/01/15/my-post-title/`. 

Other possible formats include:
- `slug` - For simple `/post-title/` URLs
- `Year/slug` - For `/2023/post-title/` URLs
- `Year/Month/slug` - For `/2023/01/post-title/` URLs

## Local Development Server

BSSG includes a simple built-in web server to help you preview your site locally.

```bash
./bssg.sh server [options]
```

This command will:
1.  **Build your site**: It automatically runs the build process.
2.  **Adjust `SITE_URL`**: For the duration of this build, it temporarily sets `SITE_URL` to match the local server's address (e.g., `http://localhost:8000` or `http://<your-host>:<your-port>`). This ensures that all generated links and asset paths work correctly during local preview. The original `SITE_URL` in your configuration files remains unchanged for regular builds.
3.  **Start the server**: It serves files from your configured `OUTPUT_DIR`.

**Server Options:**

-   `--port <PORT>`: Specifies the port for the server to listen on.
    -   Default: Value of `BSSG_SERVER_PORT_DEFAULT` from your configuration (typically `8000`).
-   `--host <HOST>`: Specifies the host/IP address for the server.
    -   Default: Value of `BSSG_SERVER_HOST_DEFAULT` from your configuration (typically `localhost`).
-   `--no-build`: Skips the build step and immediately starts the server with the existing content in the `OUTPUT_DIR`. Useful if you have just built the site and want to quickly restart the server.

**Example:**

```bash
# Build and serve on http://localhost:8080
./bssg.sh server --port 8080

# Serve on a specific host, accessible on your local network (if firewall allows)
./bssg.sh server --host 192.168.0.2 --port 8000

# Serve existing build without rebuilding
./bssg.sh server --no-build
```

Press `Ctrl+C` to stop the server.


## Future Plans

While BSSG is designed to be simple, there are a few enhancements planned for the future:

- **Stale Content Banner:** Add an option to display a banner on posts that haven't been updated in a configurable amount of time (e.g., more than X days/months).

## Troubleshooting

### Common Issues

#### Missing Dependencies
If you encounter errors about missing commands, make sure you've installed all required dependencies for your platform as mentioned in the [Requirements](#requirements) section.

#### Permissions Issues
If you get "Permission denied" errors when running scripts, make them executable:
```bash
chmod +x bssg.sh
chmod -R +x scripts/*.sh
```

#### Pandoc Not Found
If you get errors about pandoc not being found, either install pandoc or switch to commonmark or markdown.pl in your config.sh.local:
```bash
# Use commonmark (recommended)
MARKDOWN_PROCESSOR="commonmark"

# Or use markdown.pl
MARKDOWN_PROCESSOR="markdown.pl"
```

#### Build Errors
If the build process fails, check:
1. That your Markdown files have proper frontmatter
2. That there are no syntax errors in your templates
3. That all required directories exist

For more help, use the issue tracker on the project's GitHub page.

## Author and License

BSSG has been developed by Stefano Marinelli (stefano@dragas.it) - https://it-notes.dragas.net

Read the announcement post detailing the journey behind BSSG:
[Launching BSSG: My Journey from Dynamic CMS to Bash Static Site Generator](https://it-notes.dragas.net/2025/04/07/launching-bssg-my-journey-from-dynamic-cms-to-bash-static-site-generator/)

This project is licensed under the BSD 3-Clause License - see the LICENSE file for details. 

## Documentation

- **Getting Started**: See the installation and usage instructions above.
- **Configuration**: Customize your site using the options in `config.sh`.
- **Templates**: Learn how to create custom templates in the `templates` directory.
- **Themes**: Explore the available themes in the `themes` directory.
- **Backup & Restore**: Use `./bssg.sh backup` and `./bssg.sh restore` to manage content backups. 
- **Development Blog**: Stay up-to-date with the latest release notes, development progress, and announcements on the official BSSG Dev Blog: [https://blog.bssg.dragas.net](https://blog.bssg.dragas.net)
