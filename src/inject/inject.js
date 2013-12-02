var statusa;

chrome.extension.sendRequest({msg: "getStatus"}, function(response) {
   if (response.status == 1) {
   		statusa = true;
   } else {
   		statusa = false;
   }
});

WIKI_URL_REGEX = /^((http|https):\/\/)?[a-z]+.wikipedia.org\/wiki\/[a-zA-Z0-9_()#%,.!-]+$/i
CLASS_MATCHER = /easy-wiki-popover/i

var extractLanguage = function(url) {
	return url.match(/\/[a-z]{2}/i)[0].replace("/", '');
}

var extractTitle = function(url) {
	return url.match(/wiki\/[a-zA-Z0-9_()#%,.!-]+$/i)[0].replace("wiki/", '');
}

var wikiFetch = function(url) {
	language = extractLanguage(url);
	title = extractTitle(url);

	fetchUrl = "http://" + language + '.wikipedia.org/w/api.php?' + 'action=query&prop=extracts&exchars=500&format=json&titles=' + title;

	$.ajax({
		url: fetchUrl,
		timeout: 30000,
	})
	.done(function(data) {
		var ewp_content = '';
		var ewp_title = "";
		$.each(data.query.pages, function(key) {
			ewp_content = data.query.pages[key].extract.replace(/(<([^>]+)>)/ig,"");
			ewp_title = data.query.pages[key].title;
		});
		var link = $(".ewp-active");
		link.attr("data-content", ewp_content);
		link.attr("data-title", ewp_title);
		link.attr("data-original-title", ewp_title);
		$(".popover-content").html(ewp_content);
		$(".popover-title").html(ewp_title);
		$(".ewp-active").popover("show");
	})
	.fail(function(data) {
		var ewp_content = "Drats! Error fetching the Wikipedia page.";
		var ewp_title = "Error";
		var link = $(".ewp-active");
		link.attr("data-content", ewp_content);
		link.attr("data-title", ewp_title);
		link.attr("data-original-title", ewp_title);
		$(".popover-content").html(ewp_content);
		$(".popover-title").html(ewp_title);
		$(".ewp-active").popover("show");
	});
}

$(document).ready(function() {
	
	var delay = 700, timer;

	$("a").on('mouseenter', function() {
		__this = this;

		popTitle = $(this).attr("title");
		if (statusa && !($(this).hasClass("easy-wiki-popover"))) {
			$(this).attr("title", "");
		}

		timer = setTimeout(function() {
			if (statusa && __this.href.match(WIKI_URL_REGEX)) {

				$(__this).addClass("ewp-active");

				if (!($(__this).hasClass("easy-wiki-popover"))) {
					$(__this).addClass("easy-wiki-popover");

					$(__this).popover({
						html: true,
						trigger: 'manual',
						title: popTitle || 'EasyWiki',
						content: "Loading..."
					}).on("mouseenter", function() {
						var _this = this;
				        $(this).popover("show");
				        $(this).siblings(".popover").on("mouseleave", function () {
				            $(_this).popover('destroy');
				            $(_this).removeClass("ewp-active");
				        });
					}).on("mouseleave", function() {
						var _this = this;
				        setTimeout(function () {
				            if (!$(".popover:hover").length) {
				                $(_this).popover("destroy");
				                $(_this).removeClass("ewp-active");
				            }
				        }, 5);
					}).popover("show");
					wikiFetch(__this.href);
				}
			}
			$(".ewp-active").popover("show");
		}, delay);
	});

	$("a").on("mouseleave", function() {
		clearTimeout(timer);
		$(this).removeClass("easy-wiki-popover");
	});

});