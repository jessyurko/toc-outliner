

$(document).on("click", ".menuEdit", function(e) {
	if(!$(this).hasClass("editing")) {
		var $parent = $(this);
		var textBlock = $(this).children()[0];
		var prev = $(textBlock).html().trim();
		$(textBlock).hide();
		var $textarea = $("<textarea cols='50'>"+prev+"</textarea>");
		$(this).append($textarea);
		$(this).addClass("editing");
		$textarea.blur(function() {
			
			$(textBlock).html($(this).val());
			$(this).remove();
			$(textBlock).show();
			$parent.removeClass("editing");
			json = jsonify();
		});
	}
});


$(document).on("click", ".titleEdit", function(e) {
	if(!$(this).hasClass("editing")) {
		var $parent = $(this);
		var textBlock = $(this).children()[0];
		var prev = $(textBlock).html().trim();
		$(textBlock).hide();
		var $textarea = $("<input type='text' value='"+prev+"'>");
		$(this).append($textarea);
		$(this).addClass("editing");
		$textarea.blur(function() {
			
			$(textBlock).html($(this).val());
			$(this).remove();
			$(textBlock).show();
			$parent.removeClass("editing");
			json = jsonify();
		});
	}
});

$("#addNewItem").click(function() {


 var node = '<li class="d0" data-depth="0"><div><span><span class="titleEdit"><span class="titleField">new node</span></span><span title="Click to delete item." data-id="2" class="deleteMenu ui-icon ui-icon-closethick"><span></span></span><span title="Click to show/hide children" class="disclose ui-icon ui-icon-minusthick"><span></span></span><span title="Click to show/hide item editor" data-id="2" class="expandEditor ui-icon ui-icon-triangle-1-n"><span></span></span></span><div class="menuEdit"><span class="textarea"></span></div></div></li>';
 
 $(".sortable").prepend(node);
 

});

var json = {};


 $(document).ready(function(){
 		$.get("data/list.json", function(data) {
 			json = data;
 			console.log(json);
			var node = $("#container");		
			$(node).append(addList(json.items));
		
			$($(node).find("ol")[0]).addClass("sortable");
		
			$('.sortable').nestedSortable({
					handle: 'div',
					items: 'li',
					placeholder: 'placeholder',
					forcePlaceholderSize: true,
					toleranceElement: '> div',
					relocate: function(e){
						var $li = $(e.originalEvent.target.parentElement).closest("li");
						var d = $li.attr("data-depth");
						console.log(d);
						$li.removeClass("d"+d);
						d = ($li.parents().length - 5)/2;
						console.log(d);
						$li.addClass("d"+d);
						$li.attr("data-depth", d);
						

						json = jsonify();
					}
			});
		});
	});
	

	function addList(items, node) {
	
		var $ol = $("<ol></ol>");
		
		$.each(items, function() {
			var $li = $('<li><div><span><span class="titleEdit"><span class="titleField"></span></span><span title="Click to delete item." data-id="2" class="deleteMenu ui-icon ui-icon-closethick"><span></span></span><span title="Click to show/hide children" class="disclose ui-icon ui-icon-minusthick"><span></span></span><span title="Click to show/hide item editor" data-id="2" class="expandEditor ui-icon ui-icon-triangle-1-n"><span></span></span></span><div class="menuEdit"><span class="textarea"></span></div></div></li>');
			
			$li.find(".titleField").text(this.title);
			$li.find(".textarea").text(this.body);
			$($li[0]).addClass("d"+this.depth);
			$($li[0]).attr("data-depth",this.depth);
			
			if(this.children) {
				$li.append(addList(this.children));
			}
			
			$ol.append($li);
		
		});
	
		return $ol;
	}
		
	function jsonify() {
		var json = {};

		var depth = 0;
		
		var sublist = $("ol.sortable");
		
		json.items = processList($("ol.sortable"), 0);
		
		
		$.ajax({
			type: 'POST',
			url: 'write.php',
			data: {list: JSON.stringify(json)},
			dataType: 'json'
		});
		
		return json;
		
	}
	
	function processList(items, depth) {
		
		var list = [];
		
		
		$.each($(items).children(), function() {
			var primaryNode = $(this).children()[0];
			var curr = {};
			curr.depth = depth;
			curr.title = $(primaryNode).find(".titleField").text();
			curr.body = $(primaryNode).find(".textarea").text();
			
			if($(this).children()[1]) {
				curr.children = processList($(this).children()[1], depth+1);
			}
			
			list.push(curr);			
		});
		
		return list;
	}



$(document).on("click", '.disclose', function() {
	$(this).closest('li').toggleClass('mjs-nestedSortable-collapsed').toggleClass('mjs-nestedSortable-expanded');
	$(this).toggleClass('ui-icon-plusthick').toggleClass('ui-icon-minusthick');
});

$(document).on("click", '.expandEditor', function(){
	$($(this).parent().parent().children()[1]).toggle();
	$(this).toggleClass('ui-icon-triangle-1-n').toggleClass('ui-icon-triangle-1-s');
});

$(document).on("click", '.deleteMenu', function(){
	if($(this).parent().parent().parent().parent()[0].childElementCount == 1) {
		$(this).parent().parent().parent().parent().remove();
	} else $(this).parent().parent().parent().remove();
	json = jsonify();

});

