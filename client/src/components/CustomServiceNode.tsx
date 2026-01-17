import React, { memo, useState, ChangeEvent, CSSProperties } from 'react';
import { Handle, Position, NodeResizer, NodeProps } from 'reactflow';
import styled from 'styled-components';
import { getServiceIcon } from '../data/providerLogos';
import { ServiceCategory } from '../types';
import { formatPrice } from '../utils/formatting';

interface NodeContainerProps {
  bgColor?: string;
  borderColor?: string;
  glowColor?: string;
}

const NodeContainer = styled.div<NodeContainerProps>`
  background: ${props => props.bgColor || 'var(--bg-tertiary)'};
  border: 2px solid ${props => props.borderColor || 'rgba(255, 255, 255, 0.3)'};
  border-radius: 12px;
  padding: 14px;
  min-width: 200px;
  min-height: 140px;
  box-shadow: var(--shadow-md);
  transition: all 0.2s;
  position: relative;

  &:hover {
    box-shadow: var(--shadow-lg), ${props => props.glowColor || 'var(--glow-primary)'};
    border-color: rgba(255, 255, 255, 0.6);
  }

  &.selected {
    border-color: white;
    box-shadow: var(--shadow-lg), 0 0 30px rgba(255, 255, 255, 0.4);
  }
`;

const NodeHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
`;

const ServiceIcon = styled.div`
  font-size: 28px;
  flex-shrink: 0;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 32px;
    height: 32px;
    object-fit: contain;
    filter: brightness(0) invert(1);
  }
`;

const TitleSection = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ServiceName = styled.div`
  font-weight: 700;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.95);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CustomLabel = styled.input`
  font-weight: 600;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  outline: none;
  width: 100%;
  padding: 4px 6px;
  border-radius: 4px;
  font-style: italic;

  &:focus {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.4);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
    font-style: italic;
  }
`;

const NodeCost = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 700;
  background: rgba(255, 255, 255, 0.15);
  padding: 3px 8px;
  border-radius: 4px;
  white-space: nowrap;
  flex-shrink: 0;
`;

const ServiceSpecs = styled.div`
  font-size: 10px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.3;
`;

const IOSection = styled.div`
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
`;

const IOLabel = styled.div`
  font-size: 9px;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-bottom: 3px;
`;

const IOInput = styled.input`
  width: 100%;
  padding: 5px 7px;
  font-size: 11px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: white;
  outline: none;
  margin-bottom: 6px;

  &:focus {
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(0, 0, 0, 0.3);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
    font-size: 10px;
  }
`;

const GroupBadge = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  background: linear-gradient(135deg, var(--accent-secondary), var(--accent-primary));
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 10px;
  box-shadow: var(--shadow-md);
  border: 2px solid var(--bg-primary);
`;

const ExistingBadge = styled.div`
  position: absolute;
  top: -10px;
  left: -10px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 10px;
  box-shadow: var(--shadow-md);
  border: 2px solid var(--bg-primary);
  display: flex;
  align-items: center;
  gap: 4px;

  &::before {
    content: '🏢';
    font-size: 12px;
  }
`;

const HandleStyle: CSSProperties = {
  background: 'white',
  width: 16,
  height: 16,
  border: '3px solid rgba(0, 0, 0, 0.3)',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
  cursor: 'crosshair'
};

// Service category colors
const getCategoryColor = (category: ServiceCategory): string => {
  const colors: Record<ServiceCategory, string> = {
    compute: '#FF9900',
    storage: '#10b981',
    database: '#8b5cf6',
    networking: '#0078D4',
    serverless: '#f59e0b',
    ai: '#ef4444',
    cache: '#ec4899',
    messaging: '#06b6d4'
  };
  return colors[category] || '#6366f1';
};

// Custom Node Data Interface
export interface CustomServiceNodeData {
  serviceName: string;
  customLabel?: string;
  category: ServiceCategory;
  cost: number;
  specs?: string;
  description?: string;
  inputSpec?: string;
  outputSpec?: string;
  groupId?: number;
  isExisting?: boolean;
  onLabelChange?: (label: string) => void;
  onInputChange?: (input: string) => void;
  onOutputChange?: (output: string) => void;
}

// Component Props Interface
interface CustomServiceNodeProps extends NodeProps {
  data: CustomServiceNodeData;
  selected: boolean;
}

const CustomServiceNode: React.FC<CustomServiceNodeProps> = ({ data, selected }) => {
  const [customLabel, setCustomLabel] = useState<string>(data.customLabel || '');
  const [inputSpec, setInputSpec] = useState<string>(data.inputSpec || '');
  const [outputSpec, setOutputSpec] = useState<string>(data.outputSpec || '');

  const handleLabelChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newLabel = e.target.value;
    setCustomLabel(newLabel);
    if (data.onLabelChange) {
      data.onLabelChange(newLabel);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newInput = e.target.value;
    setInputSpec(newInput);
    if (data.onInputChange) {
      data.onInputChange(newInput);
    }
  };

  const handleOutputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newOutput = e.target.value;
    setOutputSpec(newOutput);
    if (data.onOutputChange) {
      data.onOutputChange(newOutput);
    }
  };

  const bgColor = getCategoryColor(data.category);
  const icon = getServiceIcon(data.serviceName, data.category);
  const isImageIcon = typeof icon === 'string' && (icon.startsWith('http') || icon.startsWith('data:'));

  return (
    <NodeContainer
      bgColor={bgColor}
      glowColor={`0 0 20px ${bgColor}`}
      borderColor={selected ? 'white' : 'rgba(255, 255, 255, 0.3)'}
      className={selected ? 'selected' : ''}
    >
      <NodeResizer
        color="white"
        isVisible={selected && !data.isExisting}
        minWidth={200}
        minHeight={140}
      />

      {data.isExisting && <ExistingBadge>Existing</ExistingBadge>}
      {data.groupId && <GroupBadge>Group {data.groupId}</GroupBadge>}

      <Handle
        type="target"
        position={Position.Top}
        style={HandleStyle}
      />

      <NodeHeader>
        <ServiceIcon>
          {isImageIcon ? <img src={icon as string} alt={data.serviceName} /> : icon}
        </ServiceIcon>
        <TitleSection>
          <ServiceName title={data.serviceName}>
            {data.serviceName}
          </ServiceName>
          {data.specs && (
            <ServiceSpecs title={data.specs}>{data.specs}</ServiceSpecs>
          )}
          <CustomLabel
            value={customLabel}
            onChange={handleLabelChange}
            placeholder="Add custom label..."
            title="Add a custom label to identify this service instance"
            disabled={data.isExisting}
            style={{ opacity: data.isExisting ? 0.7 : 1 }}
          />
        </TitleSection>
        <NodeCost>{formatPrice(data.cost ?? 0, '/mo')}</NodeCost>
      </NodeHeader>

      <IOSection>
        <IOLabel>Input</IOLabel>
        <IOInput
          value={inputSpec}
          onChange={handleInputChange}
          placeholder="e.g., User queries, HTTP requests..."
          disabled={data.isExisting}
          style={{ opacity: data.isExisting ? 0.7 : 1 }}
        />

        <IOLabel>Output</IOLabel>
        <IOInput
          value={outputSpec}
          onChange={handleOutputChange}
          placeholder="e.g., Vector embeddings, API responses..."
          disabled={data.isExisting}
          style={{ opacity: data.isExisting ? 0.7 : 1 }}
        />
      </IOSection>

      <Handle
        type="source"
        position={Position.Bottom}
        style={HandleStyle}
      />

      <Handle
        type="source"
        position={Position.Right}
        style={{ ...HandleStyle, right: -6 }}
      />

      <Handle
        type="target"
        position={Position.Left}
        style={{ ...HandleStyle, left: -6 }}
      />
    </NodeContainer>
  );
};

export default memo(CustomServiceNode);
