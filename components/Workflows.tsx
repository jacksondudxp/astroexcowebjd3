import React, { useState } from 'react';
import Card from './ui/Card';
import { useData } from '../context/DataContext';
import type { Workflow } from '../types';

const WorkflowItem: React.FC<{ workflow: Workflow }> = ({ workflow }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({});

    const handleToggle = () => setIsExpanded(prev => !prev);
    const handleCheckChange = (taskId: string) => {
        setCheckedTasks(prev => ({...prev, [taskId]: !prev[taskId]}));
    }

    const completedTasks = Object.values(checkedTasks).filter(Boolean).length;
    const totalTasks = workflow.tasks.length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return (
        <Card className="!p-0 overflow-hidden">
            <button onClick={handleToggle} className="w-full text-left p-4 flex justify-between items-center hover:bg-white/5 transition-colors" aria-expanded={isExpanded}>
                <div>
                    <h3 className="text-lg font-bold text-brand-text">{workflow.title}</h3>
                    <p className="text-sm text-brand-text-dark">{workflow.description}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-brand-text-dark transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isExpanded && (
                <div className="p-4 border-t border-slate-700 animate-fade-in">
                    <div className="mb-4">
                        <div className="flex justify-between mb-1">
                            <span className="text-base font-medium text-brand-accent">Progress</span>
                            <span className="text-sm font-medium text-brand-accent">{completedTasks} / {totalTasks}</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2.5">
                            <div className="bg-brand-accent h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                    <ul className="space-y-3">
                        {workflow.tasks.map(task => (
                            <li key={task.id} className="flex items-center">
                                <input 
                                    id={`${workflow.id}-${task.id}`} 
                                    type="checkbox" 
                                    checked={!!checkedTasks[task.id]}
                                    onChange={() => handleCheckChange(task.id)}
                                    className="w-5 h-5 text-brand-accent bg-slate-700 border-slate-500 rounded focus:ring-brand-accent"
                                />
                                <label htmlFor={`${workflow.id}-${task.id}`} className={`ml-3 text-brand-text ${checkedTasks[task.id] ? 'line-through text-brand-text-dark' : ''}`}>
                                    {task.text}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </Card>
    );
}

const Workflows: React.FC = () => {
    const { workflows } = useData();
    return (
        <div className="animate-fade-in space-y-6">
            <h1 className="text-4xl font-bold text-brand-text">Workflows</h1>
            <p className="text-lg text-brand-text-dark">Standardised checklists for routine committee work to ensure consistency and quality.</p>
            <div className="space-y-4">
                {workflows.map(workflow => (
                    <WorkflowItem key={workflow.id} workflow={workflow} />
                ))}
            </div>
        </div>
    );
};

export default Workflows;