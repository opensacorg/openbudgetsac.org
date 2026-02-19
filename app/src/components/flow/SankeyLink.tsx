// Custom link renderer for Recharts Sankey
// Recharts passes source/target node objects directly to this component

const LINK_COLORS: Record<string, string> = {
  revenue: 'rgba(127,201,127,0.4)',
  'General Fund': 'rgba(66,133,255,0.4)',
  'Non-Discretionary Funds': 'rgba(130,73,183,0.4)',
  expense: 'rgba(255,129,41,0.4)',
};

export interface SankeyLinkPayload {
  sourceX: number;
  sourceY: number;
  sourceControlX: number;
  targetX: number;
  targetY: number;
  targetControlX: number;
  linkWidth: number;
  index: number;
  payload: {
    source: { name: string; nodeType: string };
    target: { name: string; nodeType: string };
    value: number;
  };
}

interface SankeyLinkProps {
  sourceX?: number;
  sourceY?: number;
  sourceControlX?: number;
  targetX?: number;
  targetY?: number;
  targetControlX?: number;
  linkWidth?: number;
  index?: number;
  payload?: SankeyLinkPayload['payload'];
}

export function SankeyLink({
  sourceX = 0,
  sourceY = 0,
  sourceControlX = 0,
  targetX = 0,
  targetY = 0,
  targetControlX = 0,
  linkWidth = 0,
  payload,
}: SankeyLinkProps) {
  if (!payload || linkWidth <= 0) return null;

  const sourceName = payload.source?.name ?? '';
  const fillColor =
    LINK_COLORS[sourceName] ??
    LINK_COLORS[payload.source?.nodeType ?? ''] ??
    'rgba(128,128,128,0.3)';

  const path = `
    M${sourceX},${sourceY - linkWidth / 2}
    C${sourceControlX},${sourceY - linkWidth / 2}
      ${targetControlX},${targetY - linkWidth / 2}
      ${targetX},${targetY - linkWidth / 2}
    L${targetX},${targetY + linkWidth / 2}
    C${targetControlX},${targetY + linkWidth / 2}
      ${sourceControlX},${sourceY + linkWidth / 2}
      ${sourceX},${sourceY + linkWidth / 2}
    Z
  `;

  return (
    <path
      d={path}
      fill={fillColor}
      stroke="none"
    />
  );
}
