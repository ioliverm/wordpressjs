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

+ **renderPostDetails**
With this function, the library will render a single post details (images, texts, tags, etc.) into the HTML node of your choice. As in the renderPostList function, 
you can define the html template that will be used to render the post.

Function parameters
-------------------

The first parameter of each function is a javascript object (hash) containing the specific function parameters. The second parameter is a callback function
that will be called if there's some error (with the error message as the first parameter) or when the rendering process has finished (with a null value as the first parameter)

**Parameters of renderPostList**

<table>
<tr><td>nodeId</td><td>The name of the HTML node in witch the posts will be rendered</td></tr>
</table>

For example:

```
	getWPManager().renderPostList (
		{
			nodeId: 'postList',
			blogUrl: 'quietsoft.wordpress.com',
			page: 1,
			count: 5,
			renderFunction: window.customRenderFunction,
			timeout: function () { $('#posts').innerHTML = "There's some problem showing the blog posts. Please try again later"; },
			noResultsFoundFunction: function (options) { return '<div class="span12 pull-center well">No posts found that contains "' + options.search + '"</div>'; }
		},
		finishCallback
	);
```

Author
------

**Ivan Oliver**
+@ioliverm