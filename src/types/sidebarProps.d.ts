export type SidebarItemProps = {
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    IconWidth: string;
    label: string;
    isCollapsed?: boolean;
}