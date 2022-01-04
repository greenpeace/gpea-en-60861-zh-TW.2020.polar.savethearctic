import { phone_required, line_QR_code } from './utm_source_dd.js';

const {$, anime, autosize, Cookies, Highcharts, dataLayer} = window

const donateUrl = "https://supporter.ea.greenpeace.org/tw/s/donate?campaign=polar&ref=savethearctic_thankyou_page";
const shareUrl = "https://cloud.greentw.greenpeace.org/petition-arctic-savethearctic?utm_campaign=2020-arctic&utm_source=facebook&utm_medium=socialorganic&utm_content=2020-arctic_petition_tkpage";
const shareFBUrl = "https://cloud.greentw.greenpeace.org/petition-arctic-savethearctic?utm_campaign=2020-arctic&utm_source=facebook&utm_medium=socialorganic&utm_content=2020-arctic_petition_tkpage";
const shareLineUrl = "https://cloud.greentw.greenpeace.org/petition-arctic-savethearctic?utm_campaign=2020-arctic&utm_source=facebook&utm_medium=socialorganic&utm_content=2020-arctic_petition_tkpage";
const redirectDonateLink = "https://supporter.ea.greenpeace.org/tw/s/donate?campaign=polar&ref=savethearctic_thankyou_page"

window.donate = () => {
	window.open(
		donateUrl,
		"_blank"
	);
}

window.share = () => {
	if (navigator.share) {
		// we can use web share!
		navigator
			.share({
				title: "阻止破壞北極 今天立即加入全球行動！",
				text: "全賴有您，守護北極的力量日益強大。我們團結一起，讓守護北極的呼聲，揚得更遠！經過三年不懈的努力、超過700萬人揭露SHELL的野心；九月底，石油公司SHELL終於止步北極！現在，讓我們進一步確保所有石油公司永不復返。",
				url: shareUrl
			})			
			.catch(error => console.log("Error sharing:", error));
	} else {
		var baseURL = "https://www.facebook.com/sharer/sharer.php";

		//console.log('open', baseURL + "?u=" + encodeURIComponent(shareFBUrl))
		window.open(
			baseURL + "?u=" + encodeURIComponent(shareFBUrl),
			"_blank"
		);
	}
}

/**
 * Send the tracking event to the ga
 * @param  {string} eventLabel The ga trakcing name, normally it will be the short campaign name. ex 2019-plastic_retailer
 * @param  {[type]} eventValue Could be empty
 * @return {[type]}            [description]
 */
function sendPetitionTracking(eventLabel, eventValue) {
	window.dataLayer = window.dataLayer || [];

	window.dataLayer.push({
	    'event': 'gaEvent',
	    'eventCategory': 'petitions',
	    'eventAction': 'signup',
	    'eventLabel': eventLabel,
	    'eventValue' : eventValue
	});

	window.dataLayer.push({
	    'event': 'fbqEvent',
	    'contentName': eventLabel,
	    'contentCategory': 'Petition Signup'
	});

	window.uetq = window.uetq || [];  
	window.uetq.push ('event', 'signup', {'event_category': 'petitions', 'event_label': eventLabel, 'event_value': 0});
}

var pageInit = function(){
	var _ = this;
	var $container = $('#form');

	$container.find('input, select').bind('change blur', function(){
		if($(this).val() !== ''){
			$(this).addClass('filled');
		}
		else{
			$(this).removeClass('filled');
		}
	});

	$('#center_sign-submit').click(function(e){
		e.preventDefault();
		$("#center_sign-form").submit();
		//console.log("center_sign-form submitting")
	}).end()

	// create the year options
	let currYear = new Date().getFullYear()
	for (var i = 0; i < 100; i++) {

		let option = `<option value="${currYear-i}-01-01">${currYear-i}</option>`
		$("#center_yearofbirth").append(option);
		$('#en__field_supporter_NOT_TAGGED_6').append(option);
	}

	$.validator.addMethod( //override email with django email validator regex - fringe cases: "user@admin.state.in..us" or "name@website.a"
		'email',
		function(value, element){
			return this.optional(element) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/i.test(value);
		},
		'Email 格式錯誤'
	);

	$.validator.addMethod(
		"taiwan-phone",
		function (value, element) {
			const phoneReg6 = new RegExp(/^(0|886|\+886)?(9\d{8})$/).test(value);
			const phoneReg7 = new RegExp(/^(0|886|\+886){1}[3-8]-?\d{6,8}$/).test(value);
			const phoneReg8 = new RegExp(/^(0|886|\+886){1}[2]-?\d{8}$/).test(value);
		
			if ($('#center_phone').prop('required')) {
				return this.optional(element) || phoneReg6 || phoneReg7 || phoneReg8;
			} else if ($('#center_phone').val()) {
				return this.optional(element) || phoneReg6 || phoneReg7 || phoneReg8;
			}
			return true
		},
		"電話格式不正確，請只輸入數字 0912345678 或 02-12345678")

	$.validator.addClassRules({ // connect it to a css class
		"email": {email: true},
		"taiwan-phone" : { "taiwan-phone" : true }
	});

	$("#center_sign-form").validate({
		errorPlacement: function(error, element) {
			//console.log(error)
			element.parents("div.form-field:first").after( error );
		},
		submitHandler: function(form) {
			showFullPageLoading()
					
			// mc forms
			$('#mc-form [name="FirstName"]').val($('#center_name').val());
			$('#mc-form [name="LastName"]').val($('#center_lastname').val());
			$('#mc-form [name="Email"]').val($('#center_email').val());
			$('#mc-form [name="MobilePhone"]').val($('#center_phone').val());
			$('#mc-form [name="Birthdate"]').val($('#center_yearofbirth').val());
			$('#mc-form [name="OptIn"]')[0].checked = $('#center_rememberme')[0].checked;

			// collect values in the mc form
			let formData = new FormData();
			$("#mc-form input").each(function (idx, el) {
				let v = null
				if (el.type==="checkbox") {
					v = el.checked
				} else {
					v = el.value
				}

				formData.append(el.name, v)
				//console.log("Use", el.name, v)
			})

			// send the request
			let postUrl = $("#mc-form").prop("action")
			fetch(postUrl, {
				method: 'POST',
				body: formData
			})
			.then(response => response.json())
			.then(response => {
				if (response) {
					hideFullPageLoading()
					changeToPage(2)
					sendPetitionTracking('2020-savethearctic');
				  	//console.log('fetch response', response);
			  	}
			})
			.catch(error => {
				hideFullPageLoading();
				showSubmittedError();
				//console.warn("fetch error")
				//console.error(error)
			})
		},
		invalidHandler: function(event, validator) {
			// 'this' refers to the form
			/*
			var errors = validator.numberOfInvalids();
			if (errors) {				
				console.log(errors)				
			}*/
		}
	});

	//email suggestion, email correctness
	let domains = [
		"me.com",
		"outlook.com",
		"netvigator.com",
		"cloud.com",
		"live.hk",
		"msn.com",
		"gmail.com",
		"hotmail.com",
		"ymail.com",
		"yahoo.com",
		"yahoo.com.tw",
		"yahoo.com.hk"
	];
	let topLevelDomains = ["com", "net", "org"];

	var Mailcheck = require('mailcheck');	
	$("#center_email").on('blur', function() {
		if ($('.email-suggestion').length === 0) {	
			Mailcheck.run({
				email: $("#center_email").val(),
				domains: domains, // optional
				topLevelDomains: topLevelDomains, // optional
				suggested: (suggestion) => {
					$(`<div class="email-suggestion" style="font-size:small; color:blue;">您想輸入的是 <strong id="emailSuggestion">${suggestion.full}</strong> 嗎？</div>`).insertAfter("#center_email");

					$(".email-suggestion").click(function() {
						$("#center_email").val($('#emailSuggestion').html());
						$('.email-suggestion').remove();
					});
				},
				empty: () => {
					this.emailSuggestion = null
				}
			});
		}
	});

	//hideDdBtn();
}

/**
 * Switch to the page
 * @param  {int} pageNo 1 or 2
 */
const changeToPage = (pageNo) => {
	if (pageNo===1) {
		$("#page-2").hide();
	} else if (pageNo===2) {
		$('#page-1').hide();
		$('#page-2').show();

		// console.log("go to thank you page", redirectDonateLink)
		// window.location.href = redirectDonateLink;
	} else {
		throw new Error("Unkonw PageNo:"+pageNo)
	}
}

/**
 * Show the full page loading
 */
const showFullPageLoading = () => {
	if ($("#page-loading").length===0) {
		$("body").append(
			`<div id="page-loading" class="hide">
			  <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
			</div>`)
	}

	setTimeout(() => { // to enable the transition
		$("#page-loading").removeClass("hide")
	}, 0)
}

/**
 * Hide the full page loading
 */
const hideFullPageLoading = () => {
	$("#page-loading").addClass("hide")

	setTimeout(() => {
		$("#page-loading").remove()
	}, 1100)
}

/**
 * Hide the donatin btn in DD page
 */
/*
const hideDdBtn = () => {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	if (urlParams.get('utm_source') === "dd") {
		$('.is-hidden-at-dd-page-only').hide();

		$('#center_phone').removeAttr("required"); //移除電話欄位 required Attr        
	}
}*/

/**
 * Show the submitted error message 
 */
const showSubmittedError = () => {
	if ($("#submitted-error").length === 0) {
		$("body").append(`<div id="submitted-error">抱歉，連署時發生問題，請稍後再嘗試</div>`);		
	}
	
	$("#submitted-error").click(function() {
		$('#submitted-error').remove();
	});
}

$(function(){
	pageInit();
	changeToPage(1);
	// set line QR code in the thank you page
	line_QR_code('line_block');
	phone_required('center_phone');
})
