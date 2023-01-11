function createConfigTester() {
  const container = document.getElementById('config-menu');

  if (container) {
    const file = window.location.pathname.split('/').pop();
    const template = `<div>
          <h3>Examples:</h3>
          <div class="config-menu-content">
            <a class="${file === 'ahiqar-syriac.html' ? 'active' : ''}" href="./ahiqar-syriac.html">Ahiqar Syriac</a>
            <a class="${file === 'ahiqar-arabic-karshuni.html' ? 'active' : ''}" href="./ahiqar-arabic-karshuni.html">Ahiqar Arabic-Karshuni</a>
            <a class="${file === 'gfl.html' ? 'active' : ''}" href="./gfl.html">GFL</a>
            <a class="${file === 'zero-config.html' ? 'active' : ''}" href="./zero-config.html">Zero Config</a>
          </div>
          <div class="config-menu-collapse" onclick="this.parentElement.parentElement.classList.toggle('collapsed')">
            <span>Show/Hide</span>
          </div>
        </div>`;

    appendTemplate(template, container);
  }
}

function appendTemplate(template, container) {
  container.appendChild(this.convertToElement(template));
}

function convertToElement(template) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = template;
  return wrapper.firstChild;
}

window.onload = () => {
  createConfigTester();
};
