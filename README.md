wordpressjs
===========

Javascript library to integrate wordpress blogs into any website

QuickStart
----------

Clone the repo, `git clone git://github.com/ioliverm/wordpressjs.git`, or [download the latest release](https://ioliverm/wordpressjs/zipball/master).

Description
-----------

wordpressjs is a wrapper to the wordpress online api. It allows to obtain a list of posts os a single post using easy-to-use javascript functions.
It allows you to define the style applied to each post.

Usage
-----

wordpressjs consist of two files: one javascript file and one css file. Include them in your pages prior to use it's functionallity.

They're two main functions in the library:

+ **renderPostList**
This function will render a list of posts of a blog into the HTML node that you want. The function accepts two parameters:

+ **options**
+ **next**
This function will be called in two cases:

1) When an error occurs, the function passed as a parameter will be called with the error description as the first parameter.
2) When the render of posts is finished, this function will be called with a null value at the first parameter.


+ **renderPostDEtails**


Author
------

**Ivan Oliver**
+@ioliverm