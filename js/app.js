//Write functions here
$.validate({
	modules :  'sanitize, security',
	ignore: [],
});



$(function(){
	$('.nav-icon').click(function(){
		$("header").toggleClass("open");
		$('.nav-icon').toggleClass('open');
		//Open menu
		$("#mobile-menu").toggleClass("mobile-nav-show");
	});

	$(".chkbox").on("click", function(e){
		var chkbox = $(this);
		var targetChk = chkbox.parent().children('input[type=checkbox]');

		if(chkbox.hasClass("unchecked")){
			chkbox.removeClass("unchecked");
			targetChk.prop("checked", true);
		} else {
			chkbox.addClass("unchecked");
			targetChk.prop("checked", false);
		}

		targetChk.validate();

	});

	$('.question-title').click(function(){
		$(this).toggleClass("active");
	});

	$('.question-large-title').click(function(){
		$(this).toggleClass("active");
	});

	$(".phone-mask").mask("(999) 999-999", { autoclear: false });
	$(".jmbg-mask").mask("9999999999999", { autoclear: false });
	$(".passport-mask").mask("a9999999", { autoclear: false });
	$(".passportexp-mask").mask("99.99.9999", { autoclear: false });
	$(".id-mask").mask("*********", { autoclear: false });

	$(".dropdown-toggle").on("click", function(){
		var toggle = $(this);
		toggle.next(".dropdown-menu").toggle();
		return false;
	});

});