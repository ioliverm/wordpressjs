function WPManager () {

	var self = this;
	self.guid = new Date();
	self.objId = 'wordpress';
	self.head = document.head || document.getElementsByTagName('head')[0];
	self.monthDict = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	self.timeoutSeconds = 5;
	
	// Parameters:
	// - blogUrl
	// - page
	// - count
	// - searchQuery
	self.getPostsList = function(options,next) {
	
		if (!options) return null;
		if (!options.blogUrl) return null;
		if (!options.page) options.page = 1;
		if (!options.count) options.page = 5;
		
		var sURL = "http://public-api.wordpress.com/rest/v1/sites/" + options.blogUrl + "/posts/?number=" + options.count + "&page=" + options.page;
		if (options.search) sURL += "&search=" + options.search;
		
		self._loadPosts(sURL, function(error, posts) {
			if (error) next (error, null);
			else next (null, posts);
		});
		
	} // end getPostsList
	
	// Parameters:
	// - blogUrl
	// - postId
	self.getPostDetails = function(options,next) {
	
		if (!options) return null;
		if (!options.blogUrl) return null;
		if (!options.postId) return null;
		
		var sURL = "http://public-api.wordpress.com/rest/v1/sites/" + options.blogUrl + "/posts/" + options.postId;
		self._loadPosts(sURL, function(error, posts) {
			if (error) next (error, null);
			else next (null, posts);
		});

	} // end getPostDetails
	
	// renderPostList
	// 
	// Parameters:
	// - options: 
	//   - nodeId:
	//   - blogUrl
	//   - page
	//   - count
	//   - searchQuery
	//   - template
	//   - renderFunction
	//   - noResultsFoundFunction
	//   - clearContents
	// - timeout:
	self.renderPostList = function(options,next) {

		self.getPostsList(options, function (error, tPosts) {
		
			if (!tPosts) return;
		
			options.nodeObject = document.getElementById(options.nodeId);
			if (typeof options.clearContents == 'undefined') options.clearContents = true;
		
			var html = [''];
			self._renderPosts (html,tPosts,options);
			
			var sHTML = '';
			if (html.join('')=='') sHTML = self._renderNoResultsFound(options);
			else sHTML = html.join('');
			
			if (options.clearContents) options.nodeObject.innerHTML = sHTML;
			else options.nodeObject.innerHTML += sHTML;
		
			// Callback
			if (next) next(null,tPosts,options)

		});
		
	} // end renderPostList

	// Parameters:
	// - options:
	//   - nodeId:
	//   - blogUrl
	//   - postId
	//   - renderFunction
	// - next:
	self.renderPostDetails = function(options,next) {
	
		self.getPostDetails(options, function (error, tPost) {
		
			if (!tPost) return;
		
			options.nodeObject = document.getElementById(options.nodeId);
			if (typeof options.clearContents == 'undefined') options.clearContents = true;
		
			var html = [''];
			self._renderPost (html,tPost,options);
			
			var sHTML = '';
			if (html.join('')=='') sHTML = self._renderNoResultsFound(options);
			else sHTML = html.join('');
			
			if (options.clearContents) options.nodeObject.innerHTML = sHTML;
			else options.nodeObject.innerHTML += sHTML;
		
			// Callback
			if (next) next(null,tPost,options)

		});
		
	} // end renderPostDetails

	// --------------------------------------
	// Internal methods ("private")
	// --------------------------------------
	
	self._initializePost = function (post,options) {
	
		post.originalDate = post.date;
		post.dateObject = self._parsePostDate(post.originalDate);
		post.date = self._dateToString(post.dateObject);
		var sFeaturedImage = self._detectFeaturedImage(post);
		if (sFeaturedImage)	post.featuredImage = sFeaturedImage;
		
	} // end _initializePost

	self._renderPosts = function (html,posts,options) {
		
		var i=0;
		while (i<posts.posts.length) {
			self._renderPost(html,posts.posts[i],options);
			i++;
		} // end while

	} // end _renderPosts

	self._renderPost = function (html,post,options) {
		
		self._initializePost(post,options);
		
		if (options.renderFunction) html.push(options.renderFunction(post,options));
		else if (options.template) html.push(self._renderPostWithTemplate(post,options));
		else html.push(self._renderPostWithoutTemplate(post,options));
	
	} // end _renderPost
	
	self._renderNoResultsFound = function (options) {
		if (options.noResultsFoundFunction) return(options.noResultsFoundFunction(options));
		else return '<div>No posts found</div>';
	}
	
	self._renderPostWithTemplate = function (post,options) {
		return(options.template.replace(/%([a-z_\-\.]*)%/ig, function (m, l) {
			var r = post[l] + "" || "";
			return r;
		}));
	} // end _renderPostWithTemplate
	
	self._renderPostWithoutTemplate = function (post,options) {
		return '<div>' + post.content + '</div>';
	} // end _renderPostWithoutTemplate
	
	self._loadPosts = function (url, next) {
	
		var queryId = self.guid++;

		// Prepare a callback function		
		window[self.objId + queryId] = function (posts) {
			self._clear(queryId);
			next(null,posts);
		} // end callback function
		
		if (url.indexOf('?')>0)	url += "&callback=" + self.objId + queryId;
		else url += "?callback=" + self.objId + queryId;
		
		// Create a script that will load the posts
		var script = document.createElement('script');
		script.src = url;
		script.id = self.objId + queryId;
		self.head.appendChild(script);
		
		// Setup a timeout
		window[self.objId + 'timeout' + queryId] = setTimeout(function () {
			self._clear(queryId);
			next('timeout',null);
		}, self.timeoutSeconds * 1000);
		
	} // end _loadJSON
	
	self._clear = function (queryId) {
		clearTimeout(window[self.objId + 'timeout' + queryId]);
		var el = document.getElementById(self.objId + queryId);
		if (el) {
			self.head.removeChild(document.getElementById(self.objId + queryId));
		}
		window[self.objId + queryId] = undefined;
		try{ delete window[ self.objId + queryId ]; } catch(e){}
	}
	
	self._parsePostDate = function (time_value) {
		var values = time_value.split("T"),
			dateComponents = values[0].split("-"),
			timeComponents = values[1].split("+")[0].split(":"),
			date = new Date(dateComponents[0],dateComponents[1],dateComponents[2],timeComponents[0],timeComponents[1],timeComponents[2],0);
		return date;
	}
	
	self._dateToString = function (date) {
        var mon = self.monthDict[date.getMonth()],
            day = date.getDate()+'',
            dayi = ~~(day),
            year = date.getFullYear(),
            thisyear = (new Date()).getFullYear(),
            th = 'th';

        if ((dayi % 10) == 1 && day.substr(0, 1) != '1') th = 'st';
        else if ((dayi % 10) == 2 && day.substr(0, 1) != '1') th = 'nd';
        else if ((dayi % 10) == 3 && day.substr(0, 1) != '1') th = 'rd';
        if (day.substr(0, 1) == '0') day = day.substr(1);

        return mon + ' ' + day + th + (thisyear != year ? ', ' + year : '');
	}
	
	self._detectFeaturedImage = function(post) {
		var attachments = post.attachments;
		var match,match2;
		if (!attachments) return null;
		for (var attachmentId in attachments) {
			attachment = attachments[attachmentId];
			match = attachment.guid.match(/.*\/(.*\.(?:png|jpg|jpeg))/i);
			if (match) {
				match2 = post.content.match(match[0]);
				if (!match2) return attachment.guid;
			}
		}
		return null;
	}
	
} // end WPManager

function getWPManager() {
	if (!window.wpManager) window.wpManager = new WPManager();
	return window.wpManager;
}