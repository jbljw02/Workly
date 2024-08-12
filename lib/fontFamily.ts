import { Extension } from '@tiptap/core'
import { ChainedCommands, RawCommands } from '@tiptap/react'

export const FontFamily = Extension.create({
    name: 'fontFamily',

    addOptions() {
        return {
            types: ['textStyle'],
        }
    },

    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    fontFamily: {
                        default: null,
                        parseHTML: element => element.style.fontFamily,
                        renderHTML: attributes => {
                            if (!attributes.fontFamily) {
                                return {}
                            }
                            return { style: `font-family: ${attributes.fontFamily}` }
                        },
                    },
                },
            },
        ]
    },

    addCommands() {
        return {
            setFontFamily:
                (fontFamily: string) =>
                    ({ chain }: { chain: () => ChainedCommands }) => {
                        return chain().setMark('textStyle', { fontFamily }).run();
                    },
            unsetFontFamily:
                () =>
                    ({ chain }: { chain: () => ChainedCommands }) => {
                        return chain().unsetMark('textStyle').run();
                    },
        } as Partial<RawCommands>;
    }
})
