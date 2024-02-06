import { getData } from './utils'
import './style.css'
import { responseData } from './types'

const dialogConfig = {
  title: 'Lookup Synonyms',
  body: {
    type: 'panel',
    items: [
      {
        type: 'input',
        name: 'word',
        placeholder: 'Type in the word and press enter.',
      },
      {
        type: 'htmlpanel',
        html: "<div id='result'></div>",
        name: 'result',
      },
    ],
  },
  onSubmit: async function (api) {
    const { word } = api.getData()
    const result: HTMLElement | null = document.getElementById('result')
    const loading = document.createElement('p')
    loading.classList.add('loading')

    if (result && word) {
      result.innerHTML = ''
      result.appendChild(loading)
      const data = await getData(word)
      appendResult(api, data)
      result.removeChild(loading)
    }
  },
}

tinymce.PluginManager.add('synonym', function (editor) {
  editor.ui.registry.addButton('synonym', {
    text: 'Synonyms',
    onAction: function () {
      editor.windowManager.open(dialogConfig)
    },
  })
})

const appendResult = async (api, data: responseData) => {
  const fragment = new DocumentFragment()
  const result: HTMLElement = document.getElementById('result') as HTMLElement
  const ul: HTMLElement = document.createElement('ul')

  if (data.length === 0) {
    const empty = document.createElement('p')
    empty.innerHTML = 'No result found! try again'
    empty.classList.add('not-found')
    result.appendChild(empty)
  }

  data.forEach((item) => {
    const li = document.createElement('li')
    li.innerHTML = item.word
    li.onclick = () => {
      tinymce.activeEditor.insertContent(item.word)
      ul.innerHTML = ''
      result.innerHTML = ''
      api.close()
    }
    fragment.appendChild(li)
  })
  ul.appendChild(fragment)
  result.append(ul)
}
