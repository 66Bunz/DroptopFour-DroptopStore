/** @format */

// ---- COMMUNITY APPS ----

const params = new Proxy(new URLSearchParams(window.location.search), {
	get: (searchParams, prop) => searchParams.get(prop),
});

let id_query = params.id;

const appsList = document.getElementById('appsList');

function convertToRawGitHubURL(githubURL) {
	const rawURL = githubURL
		.replace('github.com', 'raw.githubusercontent.com')
		.replace('/blob/', '/');
	return rawURL;
}

let displayapps;

class Apps {
	async Items() {
		try {
			let result = await fetch(
				'https://api.droptopfour.com/v1/community-apps'
			);
			let data = await result.json();

			let appsItems = data;

			const fetchAppsPromises = appsItems.map(async (item) => {
				const {
					id,
					uuid,
					name,
					author,
					author_link,
					desc,
					version,
					official_link,
					direct_download_link,
					secondary_link,
					image_url,
					hidden,
					changelog,
					downloads,
				} = item;

				if (item.official_link == '') {
					const readmeExists = false;
					return {
						id,
						uuid,
						name,
						author,
						author_link,
						desc,
						version,
						official_link,
						direct_download_link,
						secondary_link,
						image_url,
						hidden,
						changelog,
						readmeExists,
						downloads,
					};
				} else {
					const rawBaseURL = convertToRawGitHubURL(
						`${item.official_link}`
					);

					try {
						const response = await fetch(
							`${rawBaseURL}/main/README.md`
						);
						const readmeExists = response.status === 200;
						return {
							id,
							uuid,
							name,
							author,
							author_link,
							desc,
							version,
							official_link,
							direct_download_link,
							secondary_link,
							image_url,
							hidden,
							changelog,
							readmeExists,
							downloads,
						};
					} catch (error) {
						const readmeExists = false;
						return {
							id,
							uuid,
							name,
							author,
							author_link,
							desc,
							version,
							official_link,
							direct_download_link,
							secondary_link,
							image_url,
							hidden,
							changelog,
							readmeExists,
							downloads,
						};
					}
				}
			});

			const appsItemsWithReadme = await Promise.all(fetchAppsPromises);

			return appsItemsWithReadme;
		} catch (error) {
			// console.log(error);
		}
	}
}

class DisplayApps {
	constructor() {
		this.apps = [];
	}

	setApps(apps) {
		this.apps = apps;
	}

	displayApps() {
		let result = '';
		this.apps.forEach((item) => {
			if (item.hidden != 1) {
				if (item.author_link == '') {
					if (item.official_link == '') {
						result += `
            <div>
            	<div class="app-card" id="${item.id}">
                	<div class="app-card-container">
				  		<div class="tooltip-share">
							<a class="app-card-share" onclick="copy_to_clipboard('${item.id}')" onmouseout="out_function('${item.id}')"><span class="tooltiptext-share" id="TooltipShare${item.id}">Copy to clipboard</span><img class="app-share-button" src="../icons/share.webp" /></a>
				  		</div>
                  		<a><img href="javascript:void(0)" onclick="openImageModal('${item.image_url}', '${item.name}'); return false" class="app-card-image" src="${item.image_url}" alt="${item.name} image"></a>
						<h3 class="app-card-name">${item.name}</h3>
						<p class="app-card-version">v${item.version}</p>
						<p class="app-card-author">Created by <a class="app-card-author-link">${item.author}</a></p>
						<p class="app-card-desc">${item.desc}</p>
						<p class="app-card-downloads">Downloaded ${item.downloads} times</p>
						<div class="app-card-buttons">
							<a class="app-card-button bold" href="javascript:void(0)" onclick="downloadApp('${item.uuid}', '${item.direct_download_link}')">Download</a>
						</div>
					</div>  
              	</div>
            </div>
            `;
					} else {
						if (item.readmeExists) {
							const baseLink = convertToRawGitHubURL(
								`${item.official_link}`
							);
							result += `
			<div>
				<div class="app-card" id="${item.id}">
					<div class="app-card-container">
						<div class="tooltip-share">
							<a class="app-card-share" onclick="copy_to_clipboard('${item.id}')" onmouseout="out_function('${item.id}')"><span class="tooltiptext-share" id="TooltipShare${item.id}">Copy to clipboard</span><img class="app-share-button" src="../icons/share.webp" /></a>
						</div>
						<a><img href="javascript:void(0)" onclick="openImageModal('${item.image_url}', '${item.name}'); return false" class="app-card-image" src="${item.image_url}" alt="${item.name} image"></a>
						<h3 class="app-card-name pointer" href="javascript:void(0)" onclick="openReadmeModal('${baseLink}')">${item.name}</h3>
						<p class="app-card-version">v${item.version}</p>
						<p class="app-card-author">Created by <a class="app-card-author-link">${item.author}</a></p>
						<p class="app-card-desc">${item.desc}</p>
						<p class="app-card-downloads">Downloaded ${item.downloads} times</p>
						<div class="app-card-buttons">
							<a class="app-card-button bold" href="javascript:void(0)" onclick="downloadApp('${item.uuid}', '${item.direct_download_link}')">Download</a>
							<a class="app-card-button" href="${item.official_link}" target="_blank">See on Github</a>
						</div>
					</div>  
				</div>
			</div>
			`;
						} else {
							result += `
			<div>
				<div class="app-card" id="${item.id}">
					<div class="app-card-container">
						<div class="tooltip-share">
							<a class="app-card-share" onclick="copy_to_clipboard('${item.id}')" onmouseout="out_function('${item.id}')"><span class="tooltiptext-share" id="TooltipShare${item.id}">Copy to clipboard</span><img class="app-share-button" src="../icons/share.webp" /></a>
						</div>
						<a><img href="javascript:void(0)" onclick="openImageModal('${item.image_url}', '${item.name}'); return false" class="app-card-image" src="${item.image_url}" alt="${item.name} image"></a>
						<h3 class="app-card-name">${item.name}</h3>
						<p class="app-card-version">v${item.version}</p>
						<p class="app-card-author">Created by <a class="app-card-author-link">${item.author}</a></p>
						<p class="app-card-desc">${item.desc}</p>
						<p class="app-card-downloads">Downloaded ${item.downloads} times</p>
						<div class="app-card-buttons">
							<a class="app-card-button bold" href="javascript:void(0)" onclick="downloadApp('${item.uuid}', '${item.direct_download_link}')">Download</a>
							<a class="app-card-button" href="${item.official_link}" target="_blank">See on Github</a>
						</div>
					</div>  
				</div>
			</div>
			`;
						}
					}
				} else {
					if (item.official_link == '') {
						result += `
            <div>
				<div class="app-card" id="${item.id}">
					<div class="app-card-container">
						<div class="tooltip-share">
							<a class="app-card-share" onclick="copy_to_clipboard('${item.id}')" onmouseout="out_function('${item.id}')"><span class="tooltiptext-share" id="TooltipShare${item.id}">Copy to clipboard</span><img class="app-share-button" src="../icons/share.webp" /></a>
						</div>
						<a><img href="javascript:void(0)" onclick="openImageModal('${item.image_url}', '${item.name}'); return false" class="app-card-image" src="${item.image_url}" alt="${item.name} image"></a>
						<h3 class="app-card-name">${item.name}</h3>
						<p class="app-card-version">v${item.version}</p>
						<p class="app-card-author">Created by <a class="app-card-author-link" href="${item.author_link}">${item.author}</a></p>
						<p class="app-card-desc">${item.desc}</p>
						<p class="app-card-downloads">Downloaded ${item.downloads} times</p>
						<div class="app-card-buttons">
							<a class="app-card-button bold" href="javascript:void(0)" onclick="downloadApp('${item.uuid}', '${item.direct_download_link}')">Download</a>
						</div>
					</div>  
				</div>
            </div>
            `;
					} else {
						if (item.readmeExists) {
							const baseLink = convertToRawGitHubURL(
								`${item.official_link}`
							);
							result += `
            <div>
				<div class="app-card" id="${item.id}">
					<div class="app-card-container">
						<div class="tooltip-share">
							<a class="app-card-share" onclick="copy_to_clipboard('${item.id}')" onmouseout="out_function('${item.id}')"><span class="tooltiptext-share" id="TooltipShare${item.id}">Copy to clipboard</span><img class="app-share-button" src="../icons/share.webp" /></a>
						</div>
						<a><img href="javascript:void(0)" onclick="openImageModal('${item.image_url}', '${item.name}'); return false" class="app-card-image" src="${item.image_url}" alt="${item.name} image"></a>
						<h3 class="app-card-name pointer" href="javascript:void(0)" onclick="openReadmeModal('${baseLink}')">${item.name}</h3>
						<p class="app-card-version">v${item.version}</p>
						<p class="app-card-author">Created by <a class="app-card-author-link" href="${item.author_link}">${item.author}</a></p>
						<p class="app-card-desc">${item.desc}</p>
						<p class="app-card-downloads">Downloaded ${item.downloads} times</p>
						<div class="app-card-buttons">
							<a class="app-card-button bold" href="javascript:void(0)" onclick="downloadApp('${item.uuid}', '${item.direct_download_link}')">Download</a>
							<a class="app-card-button" href="${item.official_link}" target="_blank">See on Github</a>
						</div>
					</div>
				</div>
            </div>
            `;
						} else {
							result += `
            <div>
				<div class="app-card" id="${item.id}">
					<div class="app-card-container">
						<div class="tooltip-share">
							<a class="app-card-share" onclick="copy_to_clipboard('${item.id}')" onmouseout="out_function('${item.id}')"><span class="tooltiptext-share" id="TooltipShare${item.id}">Copy to clipboard</span><img class="app-share-button" src="../icons/share.webp" /></a>
						</div>
						<a><img href="javascript:void(0)" onclick="openImageModal('${item.image_url}', '${item.name}'); return false" class="app-card-image" src="${item.image_url}" alt="${item.name} image"></a>
						<h3 class="app-card-name">${item.name}</h3>
						<p class="app-card-version">v${item.version}</p>
						<p class="app-card-author">Created by <a class="app-card-author-link">${item.author}</a></p>
						<p class="app-card-desc">${item.desc}</p>
						<p class="app-card-downloads">Downloaded ${item.downloads} times</p>
						<div class="app-card-buttons">
							<a class="app-card-button bold" href="javascript:void(0)" onclick="downloadApp('${item.uuid}', '${item.direct_download_link}')">Download</a>
							<a class="app-card-button" href="${item.official_link}" target="_blank">See on Github</a>
						</div>
					</div>  
				</div>
            </div>
            `;
						}
					}
				}
			}
		});
		appsList.innerHTML = result;
	}

	sortApps() {
		const sortCriteria = document.getElementById('sort-criteria').value;

		switch (sortCriteria) {
			case 'name':
				this.apps.sort((a, b) => a.name.localeCompare(b.name));
				break;
			case 'name_reverse':
				this.apps.sort((a, b) => b.name.localeCompare(a.name));
				break;
			case 'author':
				this.apps.sort((a, b) => a.author.localeCompare(b.author));
				break;
			case 'author_reverse':
				this.apps.sort((a, b) => b.author.localeCompare(a.author));
				break;
			case 'release':
				this.apps.sort((a, b) => b.id - a.id);
				break;
			case 'release_reverse':
				this.apps.sort((a, b) => a.id - b.id);
				break;
			case 'last_update':
				this.apps.sort((a, b) => b.version.localeCompare(a.version));
				break;
			case 'last_update_reverse':
				this.apps.sort((a, b) => a.version.localeCompare(b.version));
				break;
			case 'downloads':
				this.apps.sort((a, b) => a.downloads - b.downloads);
				break;
			case 'downloads_reverse':
				this.apps.sort((a, b) => b.downloads - a.downloads);
				break;
			case 'type':
				this.apps.sort((a, b) => a.type.localeCompare(b.type));
				break;
			case 'type_reverse':
				this.apps.sort((a, b) => b.type.localeCompare(a.type));
				break;
			default:
				break;
		}

		this.displayApps();
	}
}

// ---- SHARE BUTTON ----

function copy_to_clipboard(id) {
	navigator.clipboard.writeText(
		'https://www.droptopfour.com/community-apps/?id=' + id
	);

	var tooltip = document.getElementById('TooltipShare' + id);
	tooltip.innerHTML = 'Copied';
}

function out_function(id) {
	var tooltip = document.getElementById('TooltipShare' + id);
	tooltip.innerHTML = 'Copy to clipboard';
}

// ---- README MODAL ----

function openReadmeModal(baseLink) {
	const modal = document.createElement('div');
	modal.classList.add('readme-modal');
	modal.innerHTML = `
		<div class="readme-modal-container">
			<div class="readme-modal-close" onclick="closeReadmeModal()">
				<svg width="50" height="50" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
					<line x1="5" y1="5" x2="25" y2="25" stroke="currentColor" stroke-width="2" />
					<line x1="25" y1="5" x2="5" y2="25" stroke="currentColor" stroke-width="2" />
				</svg>
			</div>
			<div class="readme-modal-content" id="readme-modal-content">
				
			</div>
		</div>
		`;
	document.body.appendChild(modal);

	fetch(`${baseLink}/main/README.md`)
		.then((response) => response.text())
		.then((readmeContent) => {
			const readmeModalContent = document.getElementById(
				'readme-modal-content'
			);
			marked.use(markedGfmHeadingId.gfmHeadingId());
			readmeModalContent.innerHTML = marked.parse(
				readmeContent
					.replace(/Images\//g, `${baseLink}/main/Images/`)
					.replace(/images\//g, `${baseLink}/main/images/`)
			);
		})
		.catch((error) => {
			console.error('Errore nel caricamento del README:', error);
			closeReadmeModal();
		});

	disableScroll();

	document.addEventListener('keydown', function (event) {
		if (event.key === 'Escape') {
			closeReadmeModal();
		}
	});

	modal.addEventListener('click', function (event) {
		if (event.target === modal) {
			closeReadmeModal();
		}
	});
}

function closeReadmeModal() {
	const modal = document.querySelector('.readme-modal');
	if (modal) {
		enableScroll();

		modal.remove();
		document.removeEventListener('keydown', function (event) {
			if (event.key === 'Escape') {
				closeReadmeModal();
			}
		});
	}
}

// ---- IMAGE MODAL ----

function openImageModal(imageUrl, imageName) {
	const modal = document.createElement('div');
	modal.classList.add('image-modal');
	modal.innerHTML = `
		<div class="image-modal-close" onclick="closeImageModal()">
			<svg width="50" height="50" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
				<line x1="5" y1="5" x2="25" y2="25" stroke="currentColor" stroke-width="2" />
				<line x1="25" y1="5" x2="5" y2="25" stroke="currentColor" stroke-width="2" />
			</svg>
		</div>
		<div class="image-modal-content">
			<img src="${imageUrl}" alt="${imageName}">
		</div>
    `;
	document.body.appendChild(modal);

	disableScroll();

	document.addEventListener('keydown', function (event) {
		if (event.key === 'Escape') {
			closeImageModal();
		}
	});

	modal.addEventListener('click', function (event) {
		if (event.target === modal) {
			closeImageModal();
		}
	});
}

function closeImageModal() {
	const modal = document.querySelector('.image-modal');
	if (modal) {
		enableScroll();

		modal.remove();
		document.removeEventListener('keydown', function (event) {
			if (event.key === 'Escape') {
				closeImageModal();
			}
		});
	}
}

// ---- SCROLL ACTIONS ----

function Scroll() {
	const appElement = document.getElementById(id_query);
	if (appElement) {
		appElement.scrollIntoView();
	}
}

function disableScroll() {
	var node = document.createElement('style');
	node.setAttribute('type', 'text/css');
	node.textContent =
		'html, body { height: auto ! important ; overflow: hidden ! important ; }';
	document.head.prepend(node);
}

function enableScroll() {
	document.head.querySelector('style')?.remove();
}

// ---- DOWNLOAD APP ----

function downloadApp(uuid, link) {
	window.open(link, '_self');

	fetch(`https://api.droptopfour.com/v1/downloads/community-apps/${uuid}`, {
		method: 'POST',
	});
}

// ---- MAIN ----

function HideBufferingIcon() {
	const bufferingIcon = document.getElementById('apps-buffering');
	bufferingIcon.style.display = 'none';
}

function EnableSelect() {
	const sortCriteria = document.getElementById('sort-criteria');
	sortCriteria.removeAttribute('disabled');
}

document.addEventListener('DOMContentLoaded', () => {
	const apps = new Apps();
	displayapps = new DisplayApps();

	apps.Items()
		.then((apps) => {
			displayapps.setApps(apps);
			displayapps.sortApps();
		})
		.then(HideBufferingIcon)
		.then(EnableSelect)
		.then(Scroll);
});
