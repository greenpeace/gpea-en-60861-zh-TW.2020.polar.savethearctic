const {$, anime, autosize, Cookies, Highcharts, dataLayer} = window

const donateUrl = "https://act.greenpeace.org/page/4663/donate/1?campaign=polar&ref=savethearctic";
const shareUrl = "https://act.gp/2zJgXKO";
const shareFBUrl = "https://act.gp/2WII1mu";
// const shareLineUrl = "https://act.greenpeace.org/page/60863/petition/1";

const thankYouPageRedirect = "https://act.greenpeace.org/page/4663/donate/1?campaign=polar&ref=savethearctic_thankyou_page";

window.donate = () => {
	window.open(
        donateUrl,
        "_blank"
    );
}
const sharePage = () => {

    console.log(navigator.share)
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

$('#share_btn').click(function () {
    sharePage();
})
// console.log(window.share)

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
    for (var i = 0; i < 120; i++) {
        
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
            // tracking conversion
            window.dataLayer = window.dataLayer || [];
            //
            dataLayer.push({
                'event': 'gaEvent',
                'eventCategory': 'petitions',
                'eventAction': 'signup',
                'eventLabel': '2020-savethearctic',
                'eventValue': undefined
            });
            dataLayer.push({
                'event': 'fbqEvent',
                'contentName': '2020-savethearctic',
                'contentCategory': 'Petition Signup'
            });

            window.location.href = thankYouPageRedirect;

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

<<<<<<< HEAD
$(function () {
  const EN_PAGE_STATUS = resolveEnPagePetitionStatus();
  console.log("EN_PAGE_STATUS", EN_PAGE_STATUS);
  if (EN_PAGE_STATUS === "FRESH") {
    $("#page-2").hide();
    pageInit();
  } else if (EN_PAGE_STATUS === "SUCC") {
    $("#page-1").hide();
    window.dataLayer = window.dataLayer || [];
    dataLayer.push({
      event: "gaEvent",
      eventCategory: "petitions",
      eventAction: "signup",
      eventLabel: "2020-savethearctic",
      eventValue: undefined,
    });
    dataLayer.push({
      event: "fbqEvent",
      contentName: "2020-savethearctic",
      contentCategory: "Petition Signup",
    });
    setTimeout(function () {
      window.location.href = thankYouPageRedirect;
    }, 3000);
    // $('#page-2').show();
  }
});
=======
$(function(){

    const EN_PAGE_STATUS = resolveEnPagePetitionStatus()
    console.log("EN_PAGE_STATUS", EN_PAGE_STATUS)
    
	if (EN_PAGE_STATUS==="FRESH") {
        pageInit();
        $("#page-2").hide();
	} else if (EN_PAGE_STATUS==="SUCC") {
        window.location.href = thankYouPageRedirect;
        $('#page-1').hide();
        // $('#page-2').show();
        console.log("go to thank you page")
	}
})
>>>>>>> 6494c82aa0e63694060af551dbc97207dc245ae0
