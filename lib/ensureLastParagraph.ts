import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'

export const EnsureLastParagraph = Extension.create({
  name: 'ensureLastParagraph',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('ensureLastParagraph'),
        appendTransaction: (transactions, oldState, newState) => {
          if (!transactions.some(tr => tr.docChanged)) return null

          const { doc, tr } = newState
          const lastNode = doc.lastChild

          // 마지막 노드가 빈 paragraph가 아닐 경우
          if (!lastNode || (lastNode.type.name !== 'paragraph' || lastNode.content.size !== 0)) {
            // 빈 paragraph 추가
            const type = newState.schema.nodes.paragraph
            const newParagraph = type.create()
            
            return tr.insert(doc.content.size, newParagraph)
          }

          return null
        },
      }),
    ]
  },
})