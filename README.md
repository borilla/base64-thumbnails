# base64-css-thumbnails

Output a file containing CSS which adds simplified background images to `<img>` tags prior to loading the larger image resources

## TOC

* [Installation](#installation)
* [CLI](#cli)
  * [Example](#example)

## Installation

Install the module using npm. The module isn't published yet but can be installed from the github repo:
```shell
$ npm install --save borilla/base64-css-thumbnails
```

## CLI

The module adds the `make-thumbnails-css` command:
```
  Usage: make-thumbnails-css [options] <output-file>

  Write CSS file containing directives for image thumbnails

  Options:

    -h, --help                    output usage information
    -V, --version                 output the version number
    -r, --root [path]             root directory to search for images and for output (./)
    -p, --pattern [glob-pattern]  image file pattern to match (**/*.{jpeg,jpg,png})
    -q, --quality [0..100]        jpeg quality (60)
    -w, --width [pixels]          thumbnail width (16)
    -h, --height [pixels]         thumbnail height (16)
```

### Example

```
  make-thumbnails-css --root www/media thumbnails.css
```
creates a file `www/media/thumbnails.css` containing something like:
```
img[src*="www/media/images/tile-1.jpg"] { background-image: url(data:image/jpeg;base64,...); background-size: cover; }
img[src*="www/media/images/tile-2.jpg"] { background-image: url(data:image/jpeg;base64,...); background-size: cover; }
img[src*="www/media/images/tile-3.png"] { background-image: url(data:image/jpeg;base64,...); background-size: cover; }
```
