const {$, anime, autosize, Cookies, Highcharts, dataLayer} = window

const donateUrl = "https://act.greenpeace.org/page/4723/donate/1?utm_campaign=2020-dwf&ref=2020-dwf_thankyoupage_donation_btn";
const shareUrl = "https://act.greenpeace.org/page/60863/petition/1";
const shareFBUrl = "https://act.greenpeace.org/page/60863/petition/1";
const shareLineUrl = "https://act.greenpeace.org/page/60863/petition/1";

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
			.then(() => console.log("Successfully shared"))
			.catch(error => console.log("Error sharing:", error));
	} else {
		
		var baseURL = "https://www.facebook.com/sharer/sharer.php";
		
		console.log('open', baseURL + "?u=" + encodeURIComponent(shareFBUrl))
		window.open(
			baseURL + "?u=" + encodeURIComponent(shareFBUrl),
			"_blank"
		);
	}
}

var pageInit = function(){
    console.log('init')
    var _ = this;
    _.$container = $('#form');

    _.$container.find('input, select').bind('change blur', function(){
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
        console.log("center_sign-form submitting")
    }).end()

    // create the year options
    let currYear = new Date().getFullYear()
    for (var i = 0; i < 80; i++) {
        
        let option = `<option value="01/01/${currYear-i}">${currYear-i}</option>`
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
            // console.log('do validate')
            console.log('phone required :', $('#center_phone').prop('required'));
            if ($('#center_phone').prop('required')) {
                return this.optional(element) || /^[\d \-+]{7,15}$/i.test(value);
            } else if ($('#center_phone').val()) {
                return this.optional(element) || /^[\d \-+]{7,15}$/i.test(value);
            }
            return true
        },
        "電話格式不正確，請只輸入數字 0912345678 或 02-12345678")

    $.validator.addClassRules({ // connect it to a css class
        "taiwan-phone" : { "taiwan-phone" : true }
    });

    $("#center_sign-form").validate({
        errorPlacement: function(error, element) {
            console.log(error)
            element.parents("div.form-field:first").after( error );
        },
        submitHandler: function(form) {
            // do other things for a valid form
            // var temp = [];

            // $('#voting .option .vote-btn.checked').each(function(k,v) {
            //     var id = $(v).data('id');
            //     temp.push(id);
            // });

            // Cookies.set('checked_options', temp);
            // console.log('en__field_supporter_questions_288643', temp.join())

            $('#en__field_supporter_firstName').val($('#center_name').val());
            $('#en__field_supporter_lastName').val($('#center_lastname').val());
            $('#en__field_supporter_emailAddress').val($('#center_email').val());

            if (!$('#center_phone').prop('required') && !$('#center_phone').val()) {
                $('#en__field_supporter_phoneNumber').val('0900000000');
            } else {
                $('#en__field_supporter_phoneNumber').val($('#center_phone').val());
            }
            $('#en__field_supporter_NOT_TAGGED_6').val($('#center_yearofbirth').val());

            // // handling opinion submit
            // let message = $('#fake_message').val().trim();
            // let last_name = $('#fake_supporter_lastName').val();
            // let email = $('#fake_supporter_emailAddress').val();
            // console.log(message);

            console.log($("form.en__component--page").serialize());
            $("form.en__component--page").submit();
            console.log("submit success")

        },
        invalidHandler: function(event, validator) {
            // 'this' refers to the form
            var errors = validator.numberOfInvalids();
            if (errors) {
                // console.log(errors)
                var message = errors == 1
                    ? 'You missed 1 field. It has been highlighted'
                    : 'You missed ' + errors + ' fields. They have been highlighted';
                $("div.error").show();
            } else {
                $("div.error").hide();
            }
        }
    });
}

const resolveEnPagePetitionStatus = () => {
	let status = "FRESH";
	// console.log(window);
	if (window.pageJson.pageNumber === 2) {
		status = "SUCC"; // succ page
	} else {
		status = "FRESH"; // start page
	}

	return status;
};

$(function(){

    const EN_PAGE_STATUS = resolveEnPagePetitionStatus()
	console.log("EN_PAGE_STATUS", EN_PAGE_STATUS)
	if (EN_PAGE_STATUS==="FRESH") {
	// if (false) {
        pageInit();
        $("#page-2").hide();
		// if($('#voting').length == 1){
			
		// }

		// setTimeout(function(){
		// 	scrollTo(0,0);
		// 	if($('#intro').length == 1) introPage.init();
		// }, 400);

		// $(window).resize(function(){
		// 	if(introPage.active) introPage.resize();
		// });
	} else if (EN_PAGE_STATUS==="SUCC") {
	// } else if (true) {
		// pageHandler.goTo('#result', '#intro');
        // resultPage.init();
        $('#page-1').hide();
        $('#page-2').show();
        console.log("go to thank you page")
	}
})
