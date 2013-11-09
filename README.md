Clicking Bad
============

Official Clicking Bad Repository

About
=====

System Requirements
-------------------

### Supported browsers

* IE9 & 10
* FF20-24
* Chrome (all recent)
* Android

Contributing
============

Code
----

### Style

* 4 spaces indent, no tabs
* Comments should appear on their own line or lines
    * This is due to the comment-stripper regex
* No Windows carriage returns (`\r\n`)
    * `dos2unix` can be run on these, but we'd prefer not to.
* No "special" characters in code, use standard ASCII where possible.

#### Sample .vimrc

    set shiftwidth=4
    set tabstop=4
    set expandtab

Look and Feel
-------------

There are a few things that should be kept in mind:

1. **Responsive design.** One CSS file should allow `index.html` to look good on mobile phones, too.
2. **Cross browser.** This means no `div` overflow, since it's not supported by Android. See the [Supported Browsers](#supported-browsers) section for more information.
3. **Valid.** Try to keep the HTML5 as valid as possible. 

Testing
-------

### Caching

The following command will cache templates to `./docroot`.   

    $ ./control.py cache
    ...

### Testing

    $ cd ./docroot
    $ python -m SimpleHTTPServer 5000

 
