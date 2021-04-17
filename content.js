const UA_NAV = [
	'0',
	'A',
	'B',
	'C',
	'D',
	'E',
	'F',
	'G',
	'H',
	'I',
	'J',
	'K',
	'L',
	'M',
	'N',
	'O',
	'P',
	'Q',
	'R',
	'S',
	'T',
	'U',
	'V',
	'W',
	'X',
	'Y',
	'Z',
];

function getCurrentUAPage() {
	const reg = /\/([^/])\/index.html/.exec(document.location.pathname);
	return reg && reg.length > 1 ? reg[1] : UA_NAV[0];
}

function getNewUAPageURL(newPage) {
	const reg = /\/([^/])\/index.html/.exec(document.location.pathname);
	if (reg) {
		return document.location.href.replace(
			/\/([^/])(\/index.*)/,
			`/${newPage}$2`
		);
	}
	return document.location.href.replace(/(\/index.*)/, `/${newPage}$1`);
}

function getPrevUAPage() {
	const curPage = getCurrentUAPage();

	let newIndex = UA_NAV.indexOf(curPage) - 1;
	if (newIndex < 0) newIndex += UA_NAV.length;
	return UA_NAV[newIndex];
}

function getNextUAPage() {
	const curPage = getCurrentUAPage();

	return UA_NAV[(UA_NAV.indexOf(curPage) + 1) % UA_NAV.length];
}

var style = document.createElement('style');
style.innerHTML = `.BUA-screenshot {
		max-height: 150px;
		max-width: 150px;
		width: auto;
		height: auto;
		float: left;
	}

	.page {
		max-width: 80% !important;
	}
	
	section.header {
		max-width: 100% !important;
	}
	
	div.page.contentpage {
		max-width: 100% !important;
	}`;

document.getElementsByTagName('head')[0].appendChild(style);

let parser = new DOMParser();

let table = document.getElementsByTagName('table');
if (table.length > 0) {
	// Add previous and next buttons.
	let prevBtn = document.createElement('button');
	prevBtn.innerText = '<';
	prevBtn.style.position = 'fixed';
	prevBtn.style.top = '50%';
	prevBtn.style.left = '0';
	prevBtn.style.marginLeft = '32px';
	prevBtn.style.fontSize = '64px';
	prevBtn.style.background = 'transparent';
	prevBtn.style.border = '0';
	prevBtn.style.color = '#FFFFFF';
	prevBtn.style.cursor = 'pointer';
	prevBtn.onclick = (e) => {
		e.preventDefault();
		document.location = getNewUAPageURL(getPrevUAPage());
	};

	let nextBtn = document.createElement('button');
	nextBtn.innerText = '>';
	nextBtn.style.position = 'fixed';
	nextBtn.style.top = '50%';
	nextBtn.style.right = '0';
	nextBtn.style.marginRight = '32px';
	nextBtn.style.fontSize = '64px';
	nextBtn.style.background = 'transparent';
	nextBtn.style.border = '0';
	nextBtn.style.color = '#FFFFFF';
	nextBtn.style.cursor = 'pointer';
	nextBtn.onclick = (e) => {
		e.preventDefault();
		document.location = getNewUAPageURL(getNextUAPage());
	};

	document.body.appendChild(prevBtn);
	document.body.appendChild(nextBtn);

	// Add images next to each named links.
	table = table[0];

	let rows = table
		.getElementsByTagName('tbody')[0]
		.getElementsByTagName('tr');

	for (let row of rows) {
		let firstCol = row.getElementsByTagName('td')[0];
		let url = firstCol.getElementsByTagName('a')[0].href;
		firstCol.appendChild(document.createElement('br'));
		let div = document.createElement('div');
		fetch(url)
			.then((response) => {
				return response.text();
			})
			.then((htmlStr) => {
				let htmlDoc = parser.parseFromString(htmlStr, 'text/html');
				let screenshots = htmlDoc
					.getElementsByClassName('screenshots')[0]
					.getElementsByTagName('img');
				let count = 0;
				for (let screenshot of screenshots) {
					// if (count++ % 5 === 0) {
					// 	div.appendChild(document.createElement('br'));
					// }
					let img = new Image();
					img.classList.add('BUA-screenshot');
					img.src = screenshot.src;
					div.appendChild(img);
				}
			});
		firstCol.appendChild(div);
	}
}
