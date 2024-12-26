import { Mark, mergeAttributes } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { linkClickPlugin, LinkHoverPlugin } from './linkPlugin';
import { LinkTooltip } from '@/redux/features/linkSlice';
import { RawCommands } from '@tiptap/react';
import { DocumentProps } from '@/redux/features/documentSlice';

export interface LinkAttributes {
    href: string;
    target?: string | null;
    id?: string | null;
    rel?: string | null;
    class?: string | null;
}

export interface LinkOptions {
    openOnClick: boolean;
    autolink: boolean;
    defaultProtocol: string;
    HTMLAttributes: Record<string, any>;
    setLinkTooltip: (payload: Partial<LinkTooltip>) => void;
    documents: DocumentProps[];
}

const LinkNode = Mark.create<LinkOptions>({
    name: 'link',

    addOptions() {
        return {
            openOnClick: true,
            autolink: true,
            defaultProtocol: 'https',
            HTMLAttributes: {},
            setLinkTooltip: () => { },
            documents: [],
        };
    },

    addAttributes() {
        return {
            href: {
                default: null,
            },
            target: {
                default: '_blank',
            },
            id: {
                default: null,
            },
            'document-name': {
                default: null,
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'a[href]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['a', mergeAttributes(HTMLAttributes), 0];
    },

    addCommands() {
        return {
            setLink:
                (attributes: LinkAttributes) =>
                    ({ commands }: { commands: any }) => {
                        return commands.setMark(this.name, attributes);
                    },
            toggleLink:
                (attributes: LinkAttributes) =>
                    ({ commands }: { commands: any }) => {
                        return commands.toggleMark(this.name, attributes);
                    },
            unsetLink:
                () =>
                    ({ commands }: { commands: any }) => {
                        return commands.unsetMark(this.name);
                    },
        } as Partial<RawCommands>;
    },

    addProseMirrorPlugins() {
        return [
            linkClickPlugin,
            LinkHoverPlugin(this.options.setLinkTooltip),
        ];
    },
});

export default LinkNode;
