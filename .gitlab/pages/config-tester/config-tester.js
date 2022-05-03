function createConfigTester() {
  const container = document.getElementById('config-tester');

  if (container) {
    const template =
      `<div>
          <h3>Config Tester:</h3>
          <div class="config-tester-content">
            <a class="active" href="ahiqar-syriac.html">Ahiqar Syriac</a>
            <a class="active" href="ahiqar-arabic-karshuni.html">Ahiqar Arabic-Karshuni</a>
            <a href="gfl.html">GFL</a>
          </div>
          <div class="config-tester-collapse" onclick="this.parentElement.parentElement.classList.toggle('collapsed')">
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
}
