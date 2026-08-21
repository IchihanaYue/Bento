// ┌┐ ┬ ┬┌┬┐┌┬┐┌─┐┌┐┌┌─┐
// ├┴┐│ │ │  │ │ ││││└─┐
// └─┘└─┘ ┴  ┴ └─┘┘└┘└─┘
// Function to print Button Cards.

const generateFirstButtonsContainer = () => {
	const buttonsContainer1 = document.getElementById('buttons_1');
	if (!buttonsContainer1 || !CONFIG.firstButtonsContainer) return;

	for (const button of CONFIG.firstButtonsContainer) {
		let item = `
        <a
          href="${button.link}"
          target="${CONFIG.openInNewTab ? '_blank' : ''}"
          class="card button button__${button.id}"
          title="${button.name}"
          aria-label="${button.name}"
        >
          <i class="buttonIcon" icon-name="${button.icon}"></i>
        </a>
    `;

		buttonsContainer1.insertAdjacentHTML('beforeend', item);
	}
};

const generateSecondButtonsContainer = () => {
	const buttonsContainer2 = document.getElementById('buttons_2');
	if (!buttonsContainer2 || !CONFIG.secondButtonsContainer) return;

	for (const button of CONFIG.secondButtonsContainer) {
		let item = `
        <a
          href="${button.link}"
          target="${CONFIG.openInNewTab ? '_blank' : ''}"
          class="card button button__${button.id}"
          title="${button.name}"
          aria-label="${button.name}"
        >
          <i class="buttonIcon" icon-name="${button.icon}"></i>
        </a>
    `;

		buttonsContainer2.insertAdjacentHTML('beforeend', item);
	}
};

const generateButtons = () => {
	switch (CONFIG.bentoLayout) {
		case 'bento':
			generateFirstButtonsContainer();
			break;
		case 'buttons':
			generateFirstButtonsContainer();
			generateSecondButtonsContainer();
			break;
		default:
			break;
	}
};

generateButtons();
