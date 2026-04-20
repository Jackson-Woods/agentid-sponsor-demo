import type { ComponentType } from 'react';
import AgentCardSvg from '../../assets/icons/AgentCard.svg?react';
import InventoryMenuSvg from '../../assets/icons/InventoryMenu.svg?react';
import GroupsIdentitySvg from '../../assets/icons/GroupsIdentity.svg?react';
import VirtualNetworkGatewaysSvg from '../../assets/icons/VirtualNetworkGateways.svg?react';
import AdminUnitsSvg from '../../assets/icons/AdminUnits.svg?react';

/** Matches the Fluent icon component interface: `{ fontSize?: number; className?: string }` */
type FluentIconLike = ComponentType<{ fontSize?: number; className?: string }>;

function wrapSvg(
  SvgComponent: ComponentType<React.SVGProps<SVGSVGElement>>,
): FluentIconLike {
  const Wrapped = ({ fontSize = 16, className }: { fontSize?: number; className?: string }) => (
    <SvgComponent width={fontSize} height={fontSize} className={className} />
  );
  return Wrapped;
}

export const AgentCardIcon = wrapSvg(AgentCardSvg);
export const InventoryMenuIcon = wrapSvg(InventoryMenuSvg);
export const GroupsIdentityIcon = wrapSvg(GroupsIdentitySvg);
export const VirtualNetworkGatewaysIcon = wrapSvg(VirtualNetworkGatewaysSvg);
export const AdminUnitsIcon = wrapSvg(AdminUnitsSvg);
