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
<tr><td>blogUrl</td><td>The domain name of the blog that will be shown</td></tr>
<tr><td>page</td><td>Pagination management. First page is numbered as '1'</td></tr>
<tr><td>count</td><td>Number of posts per page</td></tr>
<tr><td>search</td><td>Free text search over the posts of the blog</td></tr>
<tr><td>template (optional)</td><td>HTML template used to render each post (see available template variables)</td></tr>
<tr><td>renderFunction (optional)</td><td>A reference to a function that must return the HTML for each post. This parameter will be ignored if you supply a template</td></tr>
<tr><td>timeout</td><td>A reference to a function that will be called in case worpress does not respond in a reasonable time</td></tr>
<tr><td>noResultsFoundFunction</td><td>A reference to a function that will be called in case that wordpress don't return results.</td></tr>
</table>

For example (using a template):

```
getWPManager().renderPostList (
	{
		nodeId: 'postList',
		blogUrl: 'quietsoft.wordpress.com',
		page: 1,
		count: 5,
        template: '<li><p><i class="icon-envelope"></i><a href="/post/%ID%">%title%</a><small>%date%</small></p></li>',
		timeout: function () { $('#posts').innerHTML = "There's some problem showing the blog posts. Please try again later"; },
		noResultsFoundFunction: function (options) { return '<div class="span12 pull-center well">No posts found that contains "' + options.search + '"</div>'; }
	},
	finishCallback
);
```

Another example (using a custom render function):

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

window.customRenderFunction = function (post) {
	var sTitle = post.title? post.title + ' ':null;
	var sSubtitle = window.getPostSubtitle(post);
	var sTags = window.getPostTags(post);
	var sHTML = "";
	sHTML += '<article class="blog-post">';
	if (sTitle) {
		sHTML += '<header class="blog-header">';
		sHTML += '<h2>' + sTitle;
		if (sSubtitle) {
			sHTML += '<small>' + sSubtitle + '</small>';
		}
		sHTML += '</h2>';
		sHTML += '</header>';
	} // end if
	if (post.featuredImage) {
		sHTML += '<figure class="thumbnail-figure">';
		sHTML += '	<a href="/post/' + post.ID + '">';
		sHTML += '		<img src="' + post.featuredImage + '" alt="">';
		sHTML += '	</a>';
		sHTML += '	<figcaption class="thumbnail-title">';
		sHTML += '		<h3>';
		sHTML += '			<span>' + post.title + '</span>';
		sHTML += '		</h3>';
		sHTML += '	</figcaption>';
		sHTML += '</figure>';
	}
	sHTML += '<div class="entry-content">' + post.excerpt + '</div>';
	sHTML += '<footer class="blog-footer row-fluid">';
	sHTML += '	<div class="span10 blog-tags">';
	if (sTags) {
		sHTML += '		<i class="icon-tags"></i> ' + sTags;
	}
	sHTML += '	</div>';
	sHTML += '	<div class="span2 blog-more pull-right">';
	sHTML += '		<i class="icon-link"></i> <a href="/post/' + post.ID + '"> read more</a>';
	sHTML += '	</div>';
	sHTML += '</footer>';
	sHTML += '</article>';
	return sHTML;
};
```

Author
------

**Ivan Oliver**
+@ioliverm

License
-------

MIT: http://rem.mit-license.org