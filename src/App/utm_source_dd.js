// Get utm_source in urlParams
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);


/**
 * We provide two helper class to quickly switch the block show/hide
 * in the dd page: `is-hidden-at-dd-page-only`, `is-shown-at-dd-page-only`
 *
 * This function use the current url to distinguish the dd page.
 * The dd page should have url like this: xxx?utm_source=dd
 */
(() => {
	if (urlParams.get('utm_source') === "dd") {
		let style = document.createElement('style');
		style.innerHTML =
			`.is-hidden-at-dd-page-only {
				display: none !important;
			}
			.is-shown-at-dd-page-only {
				display: block !important;
			}`
		;
		document.head.appendChild(style);		        	
	} else { // not in the dd page
		let style = document.createElement('style');
		style.innerHTML =
			`
			.is-shown-at-dd-page-only {
				display: none !important;
			}`
		;
		document.head.appendChild(style);
	}
})();

export const phone_required = (elementId) => {
	if (urlParams.get('utm_source') === "dd") {
		let line_block_id = elementId;
		if (line_block_id.indexOf('#') < 0) {
			line_block_id = '#' + line_block_id;
		}
		document.querySelector(line_block_id).removeAttribute("required"); // remove required Attr from MobilePhone field
	}
}

export const line_QR_code = (elementId) => {
	if (urlParams.get('utm_source') === "dd") {
		let line_block_id = elementId;
		if (line_block_id.indexOf('#') < 0) {
			line_block_id = '#' + line_block_id;
		}
		document.querySelector(line_block_id).innerHTML =
			`<div class="line-div is-show-at-dd-page-only" style="text-align: center; margin: 1.5rem 0;">				
				<div class="line-tp">
					<a href='http://act.gp/GPLINE_tp' target='_blank' style='color: #00c300; text-decoration: none;'>加入我們的 LINE 好友<br>
					<img src="${process.env.PUBLIC_URL}/img/act.gp_GPLINE_tp.png" style="width:100%; max-width:256px;" /></a>
				</div>
				<div class="line-tc">
					<a href='http://act.gp/GPLINE_tc' target='_blank' style='color: #00c300; text-decoration: none;'>加入我們的 LINE 好友<br>
					<img src="${process.env.PUBLIC_URL}/img/act.gp_GPLINE_tc.png" style="width:100%; max-width:256px;" /></a>
				</div>
				<div class="line-ks">
					<a href='http://act.gp/GPLINE_ks' target='_blank' style='color: #00c300; text-decoration: none;'>加入我們的 LINE 好友<br>
					<img src="${process.env.PUBLIC_URL}/img/act.gp_GPLINE_ks.png" style="width:100%; max-width:256px;" /></a>
				</div>
			</div>`;
		
		if (urlParams.get('utm_content') === "tp") {
			document.querySelector('.line-tp').style.display = "block";
			document.querySelector('.line-tc').style.display = "none";
			document.querySelector('.line-ks').style.display = "none";
		} else if (urlParams.get('utm_content') === "tc") {
			document.querySelector('.line-tp').style.display = "none";
			document.querySelector('.line-tc').style.display = "block";
			document.querySelector('.line-ks').style.display = "none";		
		} else {
			document.querySelector('.line-tp').style.display = "none";
			document.querySelector('.line-tc').style.display = "none";
			document.querySelector('.line-ks').style.display = "block";
		}
	}
}