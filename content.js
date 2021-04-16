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
