import { Extension } from '@tiptap/core';
import { RawCommands, ChainedCommands } from '@tiptap/react';

export const FontSize = Extension.create({
    name: 'fontSize',

    addOptions() {
        return {
            types: ['textStyle'],
        };
    },

    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    fontSize: {
                        default: null,
                        parseHTML: (element) => element.style.fontSize.replace(/['"]+/g, ''),
                        renderHTML: (attributes) => {
                            if (!attributes.fontSize) {
                                return {};
                            }
                            return {
                                style: `font-size: ${attributes.fontSize}`,
                            };
                        },
                    },
                },
            },
        ];
    },

    addCommands() {
        return {
            setFontSize:
                (fontSize: string) =>
                    ({ chain }: { chain: () => ChainedCommands }) => {
                        return chain().setMark('textStyle', { fontSize }).run();
                    },
            unsetFontSize:
                () =>
                    ({ chain }: { chain: () => ChainedCommands }) => {
                        return chain().unsetMark('textStyle').run();
                    },
        } as Partial<RawCommands>;
    }
});