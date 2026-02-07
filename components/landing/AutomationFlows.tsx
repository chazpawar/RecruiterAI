'use client';

import { useMemo } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Handle,
  MarkerType,
  Position,
  type Edge,
  type Node,
} from 'reactflow';
import { motion } from 'framer-motion';
import { CalendarClock } from 'lucide-react';

import 'reactflow/dist/style.css';

type FlowNodeData = {
  label: string;
  variant: keyof typeof nodeVariants;
};

const nodeVariants = {
  sky: 'border-sky-300/50 bg-sky-100/95 text-sky-900',
  indigo: 'border-indigo-300/50 bg-indigo-100/95 text-indigo-900',
  teal: 'border-teal-300/50 bg-teal-100/95 text-teal-900',
  emerald: 'border-emerald-300/50 bg-emerald-100/95 text-emerald-900',
  amber: 'border-amber-300/50 bg-amber-100/95 text-amber-900',
  rose: 'border-rose-300/50 bg-rose-100/95 text-rose-900',
  violet: 'border-violet-300/50 bg-violet-100/95 text-violet-900',
  slate: 'border-slate-300/50 bg-slate-100/95 text-slate-900',
  blue: 'border-blue-300/50 bg-blue-100/95 text-blue-900',
};

const ProcessNode = ({ data }: { data: FlowNodeData }) => (
  <div
    className={`min-w-[170px] max-w-[200px] rounded-2xl border px-3.5 py-2.5 text-center text-[11px] font-semibold shadow-sm backdrop-blur ${
      nodeVariants[data.variant]
    }`}
  >
    <Handle type="target" position={Position.Top} className="!h-2 !w-2 !bg-white/80" />
    <span className="leading-tight">{data.label}</span>
    <Handle type="source" position={Position.Bottom} className="!h-2 !w-2 !bg-white/80" />
  </div>
);

const DecisionNode = ({ data }: { data: FlowNodeData }) => (
  <div className="relative flex items-center justify-center">
    <Handle type="target" position={Position.Top} className="!h-2 !w-2 !bg-white/80" />
    <Handle
      type="source"
      id="left"
      position={Position.Left}
      className="!h-2 !w-2 !bg-white/80"
    />
    <Handle
      type="source"
      id="right"
      position={Position.Right}
      className="!h-2 !w-2 !bg-white/80"
    />
    <Handle
      type="source"
      id="bottom"
      position={Position.Bottom}
      className="!h-2 !w-2 !bg-white/80"
    />
    <div
      className={`h-24 w-24 rotate-45 rounded-2xl border shadow-sm backdrop-blur ${
        nodeVariants[data.variant]
      }`}
    />
    <div className="absolute inset-0 flex items-center justify-center text-center text-[10px] font-semibold leading-tight text-slate-900">
      {data.label}
    </div>
  </div>
);

const nodeTypes = {
  process: ProcessNode,
  decision: DecisionNode,
};

const flowNodes: Node<FlowNodeData>[] = [
  { id: '1', type: 'process', data: { label: 'Create job & define role requirements', variant: 'sky' }, position: { x: 140, y: 10 } },
  { id: '2', type: 'process', data: { label: 'Publish across channels in one click', variant: 'indigo' }, position: { x: 140, y: 80 } },
  { id: '3', type: 'process', data: { label: 'AI screens candidates automatically', variant: 'teal' }, position: { x: 140, y: 150 } },
  { id: '4', type: 'decision', data: { label: 'Qualified score > 75%?', variant: 'amber' }, position: { x: 165, y: 230 } },
  { id: '5', type: 'process', data: { label: 'Auto-schedule interviews', variant: 'emerald' }, position: { x: 0, y: 320 } },
  { id: '6', type: 'process', data: { label: 'Hiring team completes interviews', variant: 'blue' }, position: { x: 0, y: 400 } },
  { id: '7', type: 'process', data: { label: 'Send offer & onboarding pack', variant: 'violet' }, position: { x: 0, y: 480 } },
  { id: '8', type: 'process', data: { label: 'Send thank you + add to talent pool', variant: 'rose' }, position: { x: 280, y: 320 } },
];

const flowEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e2-3', source: '2', target: '3', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e3-4', source: '3', target: '4', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e4-5', source: '4', sourceHandle: 'left', target: '5', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e5-6', source: '5', target: '6', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e6-7', source: '6', target: '7', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e4-8', source: '4', sourceHandle: 'right', target: '8', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
];

export default function AutomationFlows() {
  const nodeTypesMemo = useMemo(() => nodeTypes, []);

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
            AI Recruiting Software That Works Like Your Own HR Team
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Build custom hiring workflows in minutes. No coding required.
          </p>
        </div>

        <div className="mt-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl rounded-3xl border border-sky-200/60 bg-white shadow-lg shadow-sky-100/80"
          >
            <div className="flex items-center gap-3 px-6 pt-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-900">
                <CalendarClock className="size-4" />
                Core Workflow
              </span>
            </div>
            <div className="px-6 pt-4">
              <h3 className="text-lg font-semibold text-slate-900">RecruiterAI Hiring Workflow</h3>
            </div>
            <div className="px-4 pt-4">
              <div className="relative h-[460px] overflow-hidden rounded-2xl border border-sky-900/20 bg-black">
                <div className="absolute inset-0 opacity-80">
                  <ReactFlow
                    nodes={flowNodes}
                    edges={flowEdges}
                    nodeTypes={nodeTypesMemo}
                    fitView
                    fitViewOptions={{ padding: 0.2 }}
                    nodesDraggable={false}
                    nodesConnectable={false}
                    elementsSelectable={false}
                    panOnDrag={false}
                    zoomOnScroll={false}
                    preventScrolling={false}
                    proOptions={{ hideAttribution: true }}
                    defaultEdgeOptions={{ style: { stroke: 'rgba(148, 163, 184, 0.7)' } }}
                  >
                    <Background variant={BackgroundVariant.Dots} gap={18} size={1.2} color="rgba(255, 255, 255, 0.35)" />
                  </ReactFlow>
                </div>
              </div>
            </div>
            <div className="px-6 pb-6 pt-4">
              <p className="text-sm font-semibold text-sky-900">
                Automate your full hiring workflow from job creation to offer in a single flow.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
