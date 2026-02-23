---
title: xut
date: 2026-02-23 12:06:16 +0100
lastmod: 2026-02-23 22:22:19 +0100
tags: xut, void, xbps-src, template, repository
slug: xut
secondary: true
---
## xut : xtra user templates

Installs and updates unofficial packages for Void Linux.

_Created and tested for/with the [abyss-packages repo](https://codeberg.org/mobinmob/abyss-packages)._
_Working with other unofficial repos is supported partially. Code contributions, testing and general
coordination is highly appreciated!_
 
**This script is in the alpha stage.**

### Why and how

The `xbps-src` package builder for voidlinux is a really powerful tool, but it only works with
a single repository, the void-packages repo. The only straightforward way to add software to repo
provide it in an accessible way to the users is to send PRs and be accepted.
That created a well-maintained and curated repository by the distribution developers but impedes
the inclusion of software that the same maintainers decide - for entirely valid reasons - to not accept.

`xut` tries to provide a solution for users that need more packages that cannot be provided in the
official repos. It clones the void-packages, the [abyss-packages repository](https://codeberg.org/mobinmob/abyss-packages)
and possibly other third party repos,  merges the templates from unofficial repos to the clone of void-packages
and installs or updates sw **with a single command.**
 
### Install and setup

1. Clone this repo, run the `xut` command directly from the clone or install using the Makefile.
2. Use the xutconf.sample if you want to modify configuration.
3. The script depends on:
   - `sh` and the  posix userland **(*)**,
   - `xbps >= 0.60`,
   - `git`,
   - `mktemp`,
   - the `xi` tool from the _xtools_ package which requires a working `sudo` configuration,
   (for installation/update).
   - the `tput` tool from _ncurses_ (optional).

>Note that `xut` _will run in other distributions_ that have the above tools available,
but installing (-i) and upgrading (-u) packages is disabled. In this case, `xi` is
not needed.
   
>**(*)** `xut` uses posix sh and tries to use only the posix userland utilities. The `local` 
keyword may be used in the future, but effort is being made to use only the extensions that 
are supported in gnu coreutils, busybox and the bsd userland (additional arguments).
   

### Todo

- [ ] Deal with shlibs in order to package more complex sw or modified packages from the upstream repos.
- [x] Implement a way to handle package updates gracefully. [**-u argument**]
- [x] Search for a practical way to enable more than one unofficial repos (Inteligent merging by @zenobit available from 0.4.1).
- [ ] ... (suggestions are welcome, working code even more welcome)

### Usage

```shell
xut [options]
```

| OPTIONS                | Info                                                    |
| ---------------------- | ------------------------------------------------------- |
| -s                     | Sync the repos
| -l                     | Keep a log file (5 most recent log files remain)        |
| -h                     | Display this usage information.                         |
| -d			         | Enable debugging and logging output.                    |
| -b <package1,package2> | Build a (comma-separated) list of packages.             |
| -i <package1,package2> | Build and install a (comma-separated) list of packages. |
| -x <command>           | Give xbps-src commands.                                 |
| -q <query>             | Search for <query> in available templates.              |
| -u                     | Update packages.							               |
                                     |


### Examples

- Build packages (without installing them):
```shell
xut -b package1,package2
```

- Sync repos and install packages: 
```shell
xut -si package1,package2
```

- Use the above command with logging enabled:
```shell
xut -sli package1,package2
```

- Execute an xbps-command in the merged repo:

```shell
xut -x <command>
```

- Update packages after syncing repos:

```shell
xut -su
```
