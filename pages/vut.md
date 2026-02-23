---
title: vut
date: 2026-02-23 12:05:34 +0100
lastmod: 2026-02-23 13:05:56 +0100
tags: vut, void, template, xbps-src, xbps
slug: vut
secondary: true
---

# Void Ultimate Tool (VUT)

A simple shell script that provides a menu of useful tools for working with [XBPS](https://wiki.voidlinux.org/XBPS) and [xbps-src](https://wiki.voidlinux.org/Xbps-src) on Void Linux.

## Requirements

* [xbps-src](https://wiki.voidlinux.org/Xbps-src)
* [fzf](https://github.com/junegunn/fzf)
* [vpsm](https://github.com/natemaia/vpsm)
* [xxtools](https://github.com/leahneukirchen/xxtools)
* [git](https://git-scm.com/)
* [topgrade](https://github.com/r-darwish/topgrade) (optional)

## Usage

Clone this repository and run the `vut` script:

git clone https://github.com/osowoso/vut.git
cd vut
./vut.sh

## Features

The tool provides a menu with the following options:

1. **XBPS-SRC menu**: Provides a menu of tools for working with [xbps-src](https://wiki.voidlinux.org/Xbps-src). These include options for creating, editing, and building templates, as well as options for updating, cleaning, and linting templates. There are also options for installing and removing packages.
2. **PACKAGES menu**: Provides options for installing and removing packages using `xbps-install`.
3. **Update xbps**: Updates `xbps` and the XBPS package index using `xbps-install -Suv`.
4. **Update all**: Updates all packages on the system using [topgrade](https://github.com/r-darwish/topgrade) (if installed).
5. **List possible arguments**: Lists the available arguments for the `vut` script.
6. **Edit config file**: Opens the configuration file (`~/.config/vut/vut.conf`) in the default editor.
7. **Install essential programs**: Installs essential programs for development (git, fzf, vpsm, xxtools).

## Configuration

The tool is configured using the `~/.config/vut/vut.conf` file. This file contains a number of variables that control the behavior of the tool. The default configuration file is created when you run the `vut` script for the first time, and you can edit it manually if necessary.

## License

This tool is released under the [MIT License](https://opensource.org/licenses/MIT).
