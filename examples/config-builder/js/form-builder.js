import * as icons from '../../icons/icons.js'

const formData = {}

function createInput(field, fullName, parentObj, index) {
  const wrapper = document.createElement("div")
  wrapper.classList.add('field')
  const label = document.createElement("label")
  label.textContent = field.label
  label.title = field.description ?? ''
  let input

  switch (field.type) {
    case "text":
    case "number":
      input = createTextOrNumberInput(field, fullName, parentObj, index)
      break
    case "color":
      input = createColorPicker(field, fullName, parentObj)
      break
    case "select":
      input = createSelectInput(field, fullName, parentObj, wrapper)
      break
    case "checkbox":
      input = createCheckboxGroup(field, fullName, parentObj)
      break
    case "radio":
      input = createRadioGroup(field, fullName, parentObj)
      break
    case "switch":
      input = createSwitchInput(field, fullName, parentObj)
      break
    case "group":
      input = createGroup(field, fullName, parentObj)
      break
    case "translations":
      input = createTranslationsInput(field, fullName, parentObj)
      break
    case "list":
      input = createListInput(field, fullName, parentObj)
      break
    case "icons":
      input = createIconSelectInput(field, fullName, parentObj)
      break
  }

  wrapper.appendChild(label)

  if (field.type === 'group' || field.type === 'translations' || field.type === 'list') {
    wrapper.appendChild(input)
  } else {
    label.appendChild(input)
  }
  return wrapper
}

function createTranslationsInput(field, fullName, parentObj) {
  const data = []
  const container = document.createElement("div")

  const addButton = createAddButton(() => {
    const language = createLanguage()
    container.insertBefore(language, addButton)
  })
  container.appendChild(addButton)

  function createLanguage() {
    const languageContainer = document.createElement("div")
    languageContainer.classList.add('language')
    data.push({
      id: '',
      keys: []
    })
    const index = data.length - 1

    const label = document.createElement('label')
    label.textContent = 'Language'
    languageContainer.appendChild(label)

    const languageInput = document.createElement("input")
    languageInput.type = 'text'
    languageInput.addEventListener("input", (e) => {
      data[index].id = e.target.value
      update()
    })
    label.appendChild(languageInput)

    const addButton = createAddButton(() => {
      const keyValue = createKeyValue(languageContainer, index)
      languageContainer.insertBefore(keyValue, addButton)
    }, 'Add Key/Value Pair')
    languageContainer.appendChild(addButton)

    const removeButton = createRemoveButton(() => {
      languageContainer.remove()
      data.splice(index, 1)
      update()
    })
    languageContainer.appendChild(removeButton)

    return languageContainer
  }

  function createKeyValue(container, languageIndex) {
    data[languageIndex].keys.push({
      key: '',
      value: ''
    })
    const keyValueIndex = data[languageIndex].keys.length - 1

    const keyValueContainer = document.createElement("div")
    keyValueContainer.classList.add('key-value')
    const keyLabel = document.createElement('label')
    keyLabel.textContent = 'Key'
    const keyInput = document.createElement("input")
    keyInput.type = 'text'

    keyInput.addEventListener("input", (e) => {
      data[languageIndex].keys[keyValueIndex].key = e.target.value
      update()
    })

    const valueLabel = document.createElement('label')
    valueLabel.textContent = 'Value'
    const valueInput = document.createElement("input")
    valueInput.type = 'text'

    valueInput.addEventListener("input", (e) => {
      if (data[languageIndex].keys[keyValueIndex].key === '') return
      data[languageIndex].keys[keyValueIndex].value = e.target.value
      update()
    })

    const removeButton = createRemoveButton(() => {
      container.removeChild(keyValueContainer)
      data[languageIndex].keys.splice(keyValueIndex, 1)
      update()
    })

    keyValueContainer.appendChild(keyLabel)
    keyLabel.appendChild(keyInput)
    keyValueContainer.appendChild(valueLabel)
    valueLabel.appendChild(valueInput)
    keyValueContainer.appendChild(removeButton)


    return keyValueContainer
  }

  function update() {
    parentObj[field.name] = data.reduce((acc, cur) => {
      acc[cur.id] = cur.keys.reduce((acc, cur) => {
        if (!cur.key) return acc
        acc[cur.key] = cur.value
        return acc
      }, {})
      return acc
    }, {})

    updateJsonOutput()
  }

  return container

}

function createGroup(field, fullName, parentObj) {
  const container = document.createElement("div")
  if (!parent[field.name]) {
    parentObj[field.name] = field.repeatable ? [] : {}
  }
  function addGroupInstance(beforeElement = null, index = 0) {

    const instance = {}
    const instanceContainer = document.createElement("div")

    field.fields.forEach(subField => {
      instanceContainer.appendChild(createInput(subField, `${fullName}.${subField.name}`, instance, index))
    })
    if (field.repeatable) {
      const buttonContainer = document.createElement('div')
      buttonContainer.classList.add('buttons')

      parentObj[field.name].push(instance)
      const instanceIndex = parentObj[field.name].length - 1
      const removeButton = createRemoveButton(() => {
        container.removeChild(instanceContainer)
        parentObj[field.name].splice(instanceIndex, 1)
        updateJsonOutput()
      }, field.removeLabel)
      buttonContainer.appendChild(removeButton)

      const addButton = createAddButton(
        () => addGroupInstance(instanceContainer.nextSibling, index + 1),
        field.addLabel
      )
      buttonContainer.appendChild(addButton)
      instanceContainer.appendChild(buttonContainer)
    } else {
      parentObj[field.name] = instance
    }

    if (beforeElement) {
      container.insertBefore(instanceContainer, beforeElement)
    } else {
      container.appendChild(instanceContainer)
    }

    updateJsonOutput()
  }

  if (field.repeatable) {
    const addButton = createAddButton(() => addGroupInstance(), field.addLabel)
    container.appendChild(addButton)
  } else {
    addGroupInstance()
  }

  return container
}

function handleConditionalRendering(field, selectedValue, parentContainer, fullName, parentObj) {
  if (field.conditional) {
    parentContainer.querySelectorAll(".conditional-field").forEach(el => el.remove())
    if (field.conditional[selectedValue]) {
      field.conditional[selectedValue].forEach(subField => {
        const conditionalElement = createInput(subField, `${fullName}.${subField.name}`, parentObj)
        conditionalElement.classList.add("conditional-field")
        parentContainer.appendChild(conditionalElement)
      })
      updateJsonOutput()
    }
  }
}

function createTextOrNumberInput(field, fullName, parentObj, index) {
  const input = document.createElement("input")
  input.type = field.type
  input.name = fullName
  if (Object.hasOwn(field, 'default')) {
    parentObj[field.name] = field.type === 'text' ? field.default.replace('{i}', index + 1) : field.default
    input.value = parentObj[field.name]
  }

  input.addEventListener("input", (e) => {
    parentObj[field.name] = field.type === 'number' ? parseFloat(e.target.value) : e.target.value
    updateJsonOutput()
  })
  return input
}

function createCheckboxGroup(field, fullName, parentObj) {
  const container = document.createElement("div")
  parentObj[field.name] = []
  field.options.forEach(option => {
    const checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.name = `${fullName}[]`
    checkbox.value = option.value
    checkbox.addEventListener("change", (e) => {
      if (e.target.checked) {
        parentObj[field.name].push(option.value);
      } else {
        parentObj[field.name] = parentObj[field.name].filter(v => v !== option.value)
      }
      updateJsonOutput()
    })
    const label = document.createElement("label")
    label.textContent = option.label
    container.appendChild(checkbox)
    container.appendChild(label)
  })
  return container
}

function createSwitchInput(field, fullName, parentObj) {
  const container = document.createElement("div")
  parentObj[field.name] = field.default

  const checkbox = document.createElement("input")
  checkbox.type = "checkbox"
  checkbox.name = `${fullName}`
  checkbox.checked = field.default
  checkbox.role = 'switch'
  checkbox.addEventListener("change", (e) => {
    parentObj[field.name] = e.target.checked
    updateJsonOutput()
  })

  container.appendChild(checkbox)

  return container
}

function createSelectInput(field, fullName, parentObj) {
  const input = document.createElement("select")
  input.name = fullName

  if (Object.hasOwn(field, 'default')) {
    parentObj[field.name] = field.default
  } else {
    const opt = document.createElement("option")
    opt.value = ''
    opt.textContent = 'Please select...'
    input.appendChild(opt)
  }

  field.options.forEach(option => {
    const opt = document.createElement("option")
    opt.value = option.value
    opt.textContent = option.label
    opt.selected = option.value === field.default
    input.appendChild(opt)
  })
  input.addEventListener("change", function () {

    if (this.value === '') delete parentObj[field.name]
    else {
      const isNumber = !isNaN(parseInt(this.value))
      parentObj[field.name] = isNumber ? parseInt(this.value) : this.value
    }

    updateJsonOutput()
    handleConditionalRendering(field, this.value, input.parentNode.parentNode, fullName, parentObj)
  })
  return input
}

function createRadioGroup(field, fullName, parentObj) {
  const container = document.createElement("div")
  parentObj[field.name] = ""
  field.options.forEach(option => {
    const radio = document.createElement("input")
    radio.type = "radio"
    radio.name = fullName
    radio.value = option
    radio.addEventListener("change", (e) => {
      parentObj[field.name] = e.target.value
      updateJsonOutput()
    })
    const label = document.createElement("label")
    label.textContent = option
    container.appendChild(radio)
    container.appendChild(label)
  })
  return container
}

function createColorPicker(field, fullName, parentObj) {
  const input = document.createElement("input")
  input.type = "color"
  input.name = fullName

  if (Object.hasOwn(field, 'default')) {
    parentObj[field.name] = field.default
    input.value = field.default
  }

  input.addEventListener("input", (e) => {
    parentObj[field.name] = e.target.value
    updateJsonOutput()
  });
  return input
}

function createListInput(field, fullName, parentObj) {
  const container = document.createElement("div")
  container.classList.add('list')

  const addButton = createAddButton(() => {
    const item = createListItem(container)
    container.insertBefore(item, addButton)
  })
  container.appendChild(addButton)

  function createListItem(container) {
    if (!parentObj[field.name]) parentObj[field.name] = []
    parentObj[field.name].push('')
    updateJsonOutput()
    const index = parentObj[field.name].length - 1

    const itemContainer = document.createElement("div")
    itemContainer.classList.add('list-item')
    const input = document.createElement('input')
    input.type = 'text'
    input.addEventListener('input', (e) => {
      parentObj[field.name][index] = e.target.value
      updateJsonOutput()
    })
    itemContainer.appendChild(input)

    const removeButton = createRemoveButton(() => {
      container.removeChild(itemContainer)
      parentObj[field.name].splice(index, 1)
      if (parentObj[field.name].length === 0) delete parentObj[field.name]
      updateJsonOutput()
    })
    itemContainer.appendChild(removeButton)

    return itemContainer
  }

  return container
}

function createIconSelectInput(field, fullName, parentObj) {
  const container = document.createElement('div')
  container.classList.add('icon-select')
  const dialog = document.createElement('dialog')
  const content = document.createElement('article')
  const title = document.createElement('h2')
  title.textContent = field.label

  const footer = document.createElement('footer')
  const confirmButton = createButton(() => {
    dialog.removeAttribute('open')
  }, 'Select')

  const selected = document.createElement('div')
  selected.classList.add('selected-icon')
  const defaultIcon = Object.keys(icons)[0]
  parentObj[field.name] = defaultIcon
  updateJsonOutput()
  selected.innerHTML = icons[defaultIcon]

  footer.appendChild(confirmButton)
  content.appendChild(title)
  content.appendChild(footer)
  dialog.appendChild(content)

  container.appendChild(dialog)
  container.appendChild(selected)
  container.appendChild(createAddButton(() => {
    const iconsGrid = createIconsGrid((icon) => {
      parentObj[field.name] = icon
      selected.innerHTML = icons[icon]
      updateJsonOutput()
    })
    const oldIconsGrid = content.querySelector('.icon-grid')
    if (oldIconsGrid) oldIconsGrid.remove()
    content.insertBefore(iconsGrid, footer)
    dialog.setAttribute('open', '')
  }, 'Change'))



  return container
}

function createAddButton(callback, label = 'Add New') {
  return createButton(callback, label)
}

function createRemoveButton(callback, label = 'Remove') {
  return createButton(callback, label)
}

function createButton(callback, label) {
  const button = document.createElement("button")
  button.textContent = label
  button.addEventListener("click", () => callback())
  return button
}

function createIconsGrid(callback) {
  const container = document.createElement('div')
  container.classList.add('icon-grid')

  Object.keys(icons).forEach(key => {
    const gridItem = document.createElement('div')
    gridItem.classList.add('grid-item')
    gridItem.innerHTML = icons[key]
    gridItem.addEventListener('click', () => {
      callback(key)
    })
    container.appendChild(gridItem)
  })

  return container
}

function updateJsonOutput() {
  document.getElementById("jsonOutput").textContent = JSON.stringify(formData, null, 2)
}

function build(selector, config) {
  const form = document.querySelector(selector)
  form.innerHTML = ""
  config.forEach(field => {
    form.appendChild(createInput(field, field.name, formData))
  })
}

export {
  build
}
