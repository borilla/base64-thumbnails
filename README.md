# base64-css-thumbnails
## CLI
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
  make-thumbnails-css --root test/fixtures thumbnails.css
```
will write a file to `test/fixtures thumbnails.css` containing something like:
```
img[src*="test/fixtures/images/acquisition-tile-00-300.jpg"] { background-image: url(data:image/jpeg;base64,...); background-size: cover; }
img[src*="test/fixtures/images/battleship-wild-targets-tile-15-300.jpg"] { background-image: url(data:image/jpeg;base64,...); background-size: cover; }
img[src*="test/fixtures/images/secrets-of-the-phoenix-tile-10-300.png"] { background-image: url(data:image/jpeg;base64,...); background-size: cover; }
```
