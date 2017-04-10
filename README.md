# base64-thumbnails

Search for images and output a JSON file containing size data and base64 thumbnails

The base64 thumbnails can be used for progressive image loading. See a [jsfiddle](https://jsfiddle.net/borilla/pacf4kva/) for a demo of progressive image loading using a base64 data URI. See [base64-thumbnails-test](https://github.com/borilla/base64-thumbnails-test) for a demo of how this can be achieved using this module

## Installation

Install the module using npm. The module isn't published yet but can be installed from the github repo:
```shell
$ npm install --save borilla/base64-thumbnails
```

## CLI

The module adds the `base64-thumbnails` command:
```
  Usage: base64-thumbnails [options] <output-file>

  Output json file containing base64 image thumbnails

  Options:

    -h, --help                    output usage information
    -V, --version                 output the version number
    -c, --cwd [path]              root directory to search for images and for output (./)
    -r, --root [path]             alias for "cwd"
    -p, --pattern [glob-pattern]  image file pattern to match (**/*.{jpeg,jpg,png})
    -q, --quality [0..100]        jpeg quality (60)
    -w, --width [pixels]          max thumbnail width (16)
    -h, --height [pixels]         max thumbnail height (16)
```

### Example

```
$ base64-thumbnails --root www/media thumbnails.json
```
will search for image files within `www/media/` and create a file `thumbnails.json` from found images, eg:
```
[
    {
        "file": "images/image-1.jpg",
        "originalImage": {
            "width": 510,
            "height": 340
        },
        "thumbnail": {
            "width": 22,
            "height": 15,
            "base64": "data:image/jpeg;base64,..."
        }
    },
    {
        "file": "images/image-2.jpg",
        "originalImage": {
            "width": 511,
            "height": 340
        },
        "thumbnail": {
            "width": 22,
            "height": 15,
            "base64": "data:image/jpeg;base64,..."
        }
    },
    {
        "file": "images/image-3.jpg",
        "originalImage": {
            "width": 513,
            "height": 340
        },
        "thumbnail": {
            "width": 22,
            "height": 15,
            "base64": "data:image/jpeg;base64,..."
        }
    },
    ...
]
```
