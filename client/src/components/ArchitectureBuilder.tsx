import React, { useState, useCallback, useEffect, useMemo, DragEvent } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  Node,
  Edge,
  Connection,
  ReactFlowInstance,
  NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import styled from 'styled-components';
import CustomServiceNode, { CustomServiceNodeData } from './CustomServiceNode';
import ServiceDetailsModal from './ServiceDetailsModal';
import { CloudService, CloudProvider, ServiceCategory, ArchitectureState, ArchitectureNode, ArchitectureEdge } from '../types';
import { formatPrice } from '../utils/formatting';

interface CategoryTitleProps {
  icon?: string;
}

const BuilderContainer = styled.div`
  display: flex;
  height: 500px;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  background: var(--bg-primary);
`;

const Sidebar = styled.div`
  width: 300px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  padding: 16px;
  overflow-y: auto;
`;

const SidebarSection = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  color: var(--text-primary);
  margin: 0 0 12px 0;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CategoryTitle = styled.h4<CategoryTitleProps>`
  font-size: 12px;
  color: var(--text-secondary);
  margin: 12px 0 8px 0;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: ${props => props.icon ? `"${props.icon}"` : '""'};
    font-size: 16px;
  }
`;

interface ServiceCardProps {
  bgColor?: string;
}

const ServiceCard = styled.div<ServiceCardProps>`
  padding: 10px;
  margin: 6px 0;
  background: ${props => props.bgColor || 'var(--bg-tertiary)'};
  color: white;
  border-radius: 8px;
  cursor: grab;
  font-size: 12px;
  transition: all 0.2s;
  border: 2px solid transparent;
  box-shadow: var(--shadow-sm);

  &:hover {
    transform: translateX(4px);
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: var(--shadow-md);
  }

  &:active {
    cursor: grabbing;
  }
`;

const ServiceName = styled.div`
  font-weight: 700;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ServiceInfo = styled.div`
  font-size: 10px;
  opacity: 0.9;
  display: flex;
  justify-content: space-between;
  gap: 8px;
`;

const InfoButton = styled.button`
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  min-width: 18px;
  min-height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 10px;
  font-weight: 700;
  font-style: italic;
  transition: all 0.2s;
  padding: 0;
  margin-left: 6px;
  vertical-align: middle;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.15);
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
  }

  &:active {
    transform: scale(0.9);
  }
`;

const FlowContainer = styled.div`
  flex: 1;
  position: relative;
  background: var(--bg-primary);
`;

const Toolbar = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
  display: flex;
  gap: 8px;
`;

interface ToolButtonProps {
  disabled?: boolean;
}

const ToolButton = styled.button<ToolButtonProps>`
  padding: 8px 16px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: var(--shadow-md);

  &:hover {
    border-color: var(--accent-primary);
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  &.active {
    background: var(--accent-primary);
    border-color: var(--accent-primary);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Category icons and colors
interface CategoryConfig {
  icon: string;
  color: string;
}

const categoryConfig: Record<ServiceCategory, CategoryConfig> = {
  compute: { icon: '⚡', color: '#FF9900' },
  storage: { icon: '💾', color: '#10b981' },
  database: { icon: '🗄️', color: '#8b5cf6' },
  networking: { icon: '🌐', color: '#0078D4' },
  serverless: { icon: '☁️', color: '#f59e0b' },
  ai: { icon: '🤖', color: '#ef4444' },
  cache: { icon: '⚡', color: '#ec4899' },
  messaging: { icon: '📨', color: '#06b6d4' }
};

// Component Props Interface
interface ArchitectureBuilderProps {
  provider?: CloudProvider;
  services: Record<CloudProvider, Record<ServiceCategory, CloudService[]>>;
  onArchitectureChange?: (architecture: ArchitectureState) => void;
  initialNodes?: Node<CustomServiceNodeData>[];
  initialEdges?: Edge[];
}

// Drag Data Interface
interface DragServiceData extends CloudService {
  category: ServiceCategory;
}

const ArchitectureBuilder: React.FC<ArchitectureBuilderProps> = ({
  provider = 'AWS',
  services,
  onArchitectureChange,
  initialNodes = [],
  initialEdges = []
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomServiceNodeData>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [nextGroupId, setNextGroupId] = useState<number>(1);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<{service: CloudService, category: ServiceCategory} | null>(null);

  const nodeTypes: NodeTypes = useMemo(() => ({
    serviceNode: CustomServiceNode
  }), []);

  // Initialize with existing infrastructure
  useEffect(() => {
    if (!initialized && (initialNodes.length > 0 || initialEdges.length > 0)) {
      // Transform initialNodes to add callback functions
      const nodesWithCallbacks = initialNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          cost: node.data.cost ?? 0, // Ensure cost is defined
          onLabelChange: (label: string) => {
            setNodes((nds) =>
              nds.map((n) =>
                n.id === node.id
                  ? { ...n, data: { ...n.data, customLabel: label } }
                  : n
              )
            );
          },
          onInputChange: (input: string) => {
            setNodes((nds) =>
              nds.map((n) =>
                n.id === node.id
                  ? { ...n, data: { ...n.data, inputSpec: input } }
                  : n
              )
            );
          },
          onOutputChange: (output: string) => {
            setNodes((nds) =>
              nds.map((n) =>
                n.id === node.id
                  ? { ...n, data: { ...n.data, outputSpec: output } }
                  : n
              )
            );
          }
        }
      }));

      setNodes(nodesWithCallbacks);
      setEdges(initialEdges);
      setInitialized(true);
    }
  }, [initialNodes, initialEdges, initialized, setNodes, setEdges]);

  // Update parent when architecture changes
  useEffect(() => {
    if (onArchitectureChange) {
      onArchitectureChange({
        nodes: nodes as ArchitectureNode[],
        edges: edges as ArchitectureEdge[]
      });
    }
  }, [nodes, edges, onArchitectureChange]);

  // Track selected nodes
  useEffect(() => {
    const selected = nodes.filter(node => node.selected).map(node => node.id);
    setSelectedNodes(selected);
  }, [nodes]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({
      ...params,
      animated: true,
      style: { stroke: 'var(--accent-primary)', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--accent-primary)' }
    }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!reactFlowInstance) return;

      const serviceData: DragServiceData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNodeId = `${serviceData.id}-${Date.now()}`;
      const newNode: Node<CustomServiceNodeData> = {
        id: newNodeId,
        type: 'serviceNode',
        position,
        data: {
          serviceName: serviceData.name,
          customLabel: '',
          category: serviceData.category,
          cost: serviceData.cost,
          specs: serviceData.specs,
          description: serviceData.description,
          inputSpec: '',
          outputSpec: '',
          onLabelChange: (label: string) => {
            setNodes((nds) =>
              nds.map((node) =>
                node.id === newNodeId
                  ? { ...node, data: { ...node.data, customLabel: label } }
                  : node
              )
            );
          },
          onInputChange: (input: string) => {
            setNodes((nds) =>
              nds.map((node) =>
                node.id === newNodeId
                  ? { ...node, data: { ...node.data, inputSpec: input } }
                  : node
              )
            );
          },
          onOutputChange: (output: string) => {
            setNodes((nds) =>
              nds.map((node) =>
                node.id === newNodeId
                  ? { ...node, data: { ...node.data, outputSpec: output } }
                  : node
              )
            );
          }
        },
        style: {
          width: 220,
          height: 260
        }
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onDragStart = (event: DragEvent<HTMLDivElement>, service: CloudService): void => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(service));
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleGroupSelected = (): void => {
    if (selectedNodes.length < 2) {
      alert('Please select at least 2 nodes to group');
      return;
    }

    setNodes((nds) =>
      nds.map((node) =>
        selectedNodes.includes(node.id)
          ? { ...node, data: { ...node.data, groupId: nextGroupId } }
          : node
      )
    );

    setNextGroupId(prev => prev + 1);
  };

  const handleUngroupSelected = (): void => {
    if (selectedNodes.length === 0) {
      alert('Please select nodes to ungroup');
      return;
    }

    setNodes((nds) =>
      nds.map((node) =>
        selectedNodes.includes(node.id)
          ? { ...node, data: { ...node.data, groupId: undefined } }
          : node
      )
    );
  };

  const handleClearAll = (): void => {
    if (window.confirm('Clear all nodes and edges?')) {
      setNodes([]);
      setEdges([]);
    }
  };

  // Organize services by category
  const categorizedServices: Record<string, CloudService[]> = {};
  if (services && services[provider]) {
    Object.entries(services[provider]).forEach(([category, serviceList]) => {
      categorizedServices[category] = serviceList;
    });
  }

  return (
    <BuilderContainer>
      <Sidebar>
        <SidebarSection>
          <SectionTitle>{provider} Services</SectionTitle>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Drag services to the canvas to build your architecture
          </p>

          {Object.entries(categorizedServices).map(([category, serviceList]) => (
            <div key={category}>
              <CategoryTitle icon={categoryConfig[category as ServiceCategory]?.icon || '📦'}>
                {category}
              </CategoryTitle>
              {serviceList.map((service) => (
                <ServiceCard
                  key={service.id}
                  bgColor={categoryConfig[category as ServiceCategory]?.color || '#6366f1'}
                  draggable
                  onDragStart={(e) => onDragStart(e, service)}
                >
                  <ServiceName>
                    <span>{service.name}</span>
                    <InfoButton
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setSelectedService({ service, category: category as ServiceCategory });
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      title="View service details"
                    >
                      i
                    </InfoButton>
                  </ServiceName>
                  <ServiceInfo>
                    <span>{formatPrice(service.cost, '/mo')}</span>
                    <span>{service.specs}</span>
                  </ServiceInfo>
                </ServiceCard>
              ))}
            </div>
          ))}
        </SidebarSection>
      </Sidebar>

      <FlowContainer>
        <Toolbar>
          <ToolButton
            onClick={handleGroupSelected}
            disabled={selectedNodes.length < 2}
            title="Group selected nodes"
          >
            🔗 Group
          </ToolButton>
          <ToolButton
            onClick={handleUngroupSelected}
            disabled={selectedNodes.length === 0}
            title="Ungroup selected nodes"
          >
            ⛓️‍💥 Ungroup
          </ToolButton>
          <ToolButton
            onClick={handleClearAll}
            title="Clear all"
          >
            🗑️ Clear
          </ToolButton>
        </Toolbar>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
          attributionPosition="bottom-left"
          connectionRadius={30}
          connectionLineStyle={{ stroke: 'var(--accent-primary)', strokeWidth: 3 }}
          defaultEdgeOptions={{
            animated: true,
            style: { stroke: 'var(--accent-primary)', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--accent-primary)' }
          }}
        >
          <Controls />
          <MiniMap
            nodeColor={(node: Node<CustomServiceNodeData>) => {
              const category = node.data?.category;
              return categoryConfig[category]?.color || '#6366f1';
            }}
            maskColor="rgba(0, 0, 0, 0.6)"
          />
          <Background
            variant={BackgroundVariant.Dots}
            gap={16}
            size={1}
            color="var(--border-color)"
          />
        </ReactFlow>
      </FlowContainer>

      {selectedService && (
        <ServiceDetailsModal
          service={selectedService.service}
          category={selectedService.category}
          onClose={() => setSelectedService(null)}
        />
      )}
    </BuilderContainer>
  );
};

export default ArchitectureBuilder;
