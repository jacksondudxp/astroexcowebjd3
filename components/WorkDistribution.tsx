import React, { useState, useMemo } from 'react';
import Card from './ui/Card';
import Modal from './ui/Modal';
import { useData } from '../context/DataContext';
import type { PrepTask, EventPreparationPlan } from '../types';
import { useAuth } from '../context/AuthContext';

// Task Form Modal
const TaskForm: React.FC<{
  plan: EventPreparationPlan;
  task: PrepTask | null;
  onSave: (planId: string, tasks: PrepTask[]) => void;
  onClose: () => void;
}> = ({ plan, task, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: task?.name || '',
    deadline: task ? new Date(task.deadline).toISOString().substring(0, 16) : '',
    workload: task?.workload || 5,
    requiredPersonnel: task?.requiredPersonnel || 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTasks = task 
      ? plan.tasks.map(t => t.id === task.id ? { ...t, name: formData.name, workload: Number(formData.workload), requiredPersonnel: Number(formData.requiredPersonnel), deadline: new Date(formData.deadline).toISOString() } : t)
      : [...plan.tasks, { id: `task-${Date.now()}`, name: formData.name, workload: Number(formData.workload), requiredPersonnel: Number(formData.requiredPersonnel), deadline: new Date(formData.deadline).toISOString(), assignedTo: [] }];
    onSave(plan.id, newTasks);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="name" value={formData.name} onChange={handleChange} placeholder="Task Name" required className="w-full p-2 rounded-md bg-slate-800/80 border border-slate-600 focus:ring-2 focus:ring-brand-accent focus:outline-none text-brand-text placeholder:text-slate-400"/>
      <div>
        <label className="text-sm text-brand-text-dark">Deadline</label>
        <input type="datetime-local" name="deadline" value={formData.deadline} onChange={handleChange} required className="w-full p-2 rounded-md bg-slate-800/80 border border-slate-600 focus:ring-2 focus:ring-brand-accent focus:outline-none text-brand-text" style={{colorScheme: 'dark'}}/>
      </div>
      <div className="flex gap-4 items-center">
          <div className="flex-1">
            <label className="text-sm text-brand-text-dark">Workload (1-10): {formData.workload}</label>
            <input type="range" name="workload" min="1" max="10" value={formData.workload} onChange={handleChange} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-accent"/>
          </div>
           <div className="w-24">
            <label className="text-sm text-brand-text-dark">Personnel</label>
            <input type="number" name="requiredPersonnel" min="1" value={formData.requiredPersonnel} onChange={handleChange} className="w-full p-2 rounded-md bg-slate-800/80 border border-slate-600 text-brand-text"/>
          </div>
      </div>
      <button type="submit" className="w-full bg-brand-accent hover:bg-brand-accent-dark text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors">{task ? 'Save Changes' : 'Add Task'}</button>
    </form>
  )
}

function stringToColor(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return "00000".substring(0, 6 - c.length) + c;
}


const WorkDistribution: React.FC = () => {
    const { events, currentCommitteeMembers, eventPreparationPlans, distributeWork, updatePreparationPlan, createPreparationPlan, getCommitteeMemberById } = useData();
    const { currentUser } = useAuth();
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<PrepTask | null>(null);
    
    const canEdit = currentUser?.permissionLevel === 'current';

    const plan = useMemo(() => eventPreparationPlans.find(p => p.id === selectedPlanId), [selectedPlanId, eventPreparationPlans]);
    const eventForPlan = useMemo(() => events.find(e => e.id === plan?.eventId), [plan, events]);

    const handleCreatePlan = (eventId: string) => {
        const newPlanId = createPreparationPlan(eventId);
        setSelectedPlanId(newPlanId);
    };

    const handleGenerate = () => plan && distributeWork(plan.id);
    
    const handleMemberToggle = (memberId: string) => {
        if (!plan || !canEdit) return;
        const currentMembers = plan.involvedCommitteeMembers;
        const newMembers = currentMembers.includes(memberId) ? currentMembers.filter(id => id !== memberId) : [...currentMembers, memberId];
        updatePreparationPlan(plan.id, { involvedCommitteeMembers: newMembers });
    };

    const workloadByMember = useMemo(() => {
        const workload: Record<string, number> = {};
        if (!plan) return workload;

        plan.involvedCommitteeMembers.forEach(id => workload[id] = 0);

        plan.tasks.forEach(task => {
            if (task.assignedTo.length > 0) {
                const workloadPerPerson = task.workload / task.assignedTo.length;
                task.assignedTo.forEach(memberId => {
                    if (workload[memberId] !== undefined) {
                        workload[memberId] += workloadPerPerson;
                    }
                });
            }
        });
        
        for (const memberId in workload) {
            workload[memberId] = Math.round(workload[memberId] * 10) / 10;
        }

        return workload;
    }, [plan]);
    
    const handleSaveTask = (planId: string, tasks: PrepTask[]) => {
      updatePreparationPlan(planId, { tasks });
    };
    const handleDeleteTask = (taskId: string) => {
        if (!plan || !window.confirm("Are you sure you want to delete this task?")) return;
        const newTasks = plan.tasks.filter(t => t.id !== taskId);
        updatePreparationPlan(plan.id, { tasks: newTasks });
    };

    const deadlines = useMemo(() => {
        if (!plan) return [];
        const uniqueDates = [...new Set(plan.tasks.map(t => new Date(t.deadline).toLocaleDateString()))]
            .sort((a,b) => new Date(a).getTime() - new Date(b).getTime());
        
        return uniqueDates.map(dateStr => ({
            date: dateStr,
            tasks: plan.tasks.filter(t => new Date(t.deadline).toLocaleDateString() === dateStr)
        }));
    }, [plan]);

    if (!plan) {
        const eventsWithPlans = events.filter(e => e.preparationPlanId && !e.isPast);
        const eventsWithoutPlans = events.filter(e => !e.isPast && !e.preparationPlanId);
        return (
            <div className="animate-fade-in space-y-6">
                <h1 className="text-4xl font-bold text-brand-text">Work Distribution Planner</h1>
                <p className="text-lg text-brand-text-dark">Select an event to plan, or create a new plan for an upcoming event.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {eventsWithPlans.map(event => (
                        <Card key={event.id} className="flex flex-col justify-between">
                            <h3 className="text-xl font-bold text-brand-text mb-2">{event.title}</h3>
                            <p className="text-brand-text-dark text-sm mb-4">{new Date(event.date).toLocaleDateString()}</p>
                            <button onClick={() => setSelectedPlanId(event.preparationPlanId!)} className="w-full text-center bg-brand-accent hover:bg-brand-accent-dark text-white font-semibold py-2 px-4 rounded-md transition-colors">Plan This Event</button>
                        </Card>
                    ))}
                    {canEdit && (
                     <Card className="border-2 border-dashed border-slate-600 hover:border-brand-accent transition-colors flex flex-col items-center justify-center p-6 text-center">
                        <h3 className="text-xl font-bold text-brand-text mb-2">Create New Plan</h3>
                        <p className="text-brand-text-dark mb-4">Select an event to start building its preparation plan from scratch.</p>
                        <select onChange={(e) => e.target.value && handleCreatePlan(e.target.value)} defaultValue="" className="w-full p-2 rounded-md bg-slate-800/80 border border-slate-600 focus:ring-2 focus:ring-brand-accent focus:outline-none text-brand-text" style={{colorScheme: 'dark'}}>
                            <option value="" disabled>Select an event...</option>
                            {eventsWithoutPlans.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
                        </select>
                    </Card>
                    )}
                </div>
            </div>
        );
    }
    
    const availableMembers = currentCommitteeMembers.filter(cm => !plan.involvedCommitteeMembers.includes(cm.id));

    const getTaskColor = (taskId: string) => {
        const color = stringToColor(taskId);
        return {
            backgroundColor: `#${color}30`, // 30 for alpha
            borderColor: `#${color}80` // 80 for alpha
        };
    };

    return (
        <div className="animate-fade-in space-y-6">
            <button onClick={() => setSelectedPlanId(null)} className="text-brand-accent hover:text-brand-accent-dark font-semibold">&larr; Back to Plan Selection</button>
            <h1 className="text-4xl font-bold text-brand-text">Plan: {eventForPlan?.title}</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1 space-y-4">
                    <h2 className="text-2xl font-semibold text-brand-text border-b border-slate-700 pb-2">Configuration</h2>
                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-brand-text">Involved Committee Members</h3>
                        <div className="space-y-2 p-2 border border-slate-700 rounded-md">
                            {plan.involvedCommitteeMembers.map(memberId => {
                                const member = currentCommitteeMembers.find(m => m.id === memberId);
                                return <div key={memberId} className="flex items-center justify-between bg-slate-800/70 p-1.5 rounded-md"><span className="text-sm text-brand-text">{member?.name}</span>
                                {canEdit && <button onClick={() => handleMemberToggle(memberId)} className="text-red-500 text-xs font-bold">X</button>}
                                </div>
                            })}
                        </div>
                        {canEdit && (
                         <select onChange={(e) => e.target.value && handleMemberToggle(e.target.value)} defaultValue="" className="mt-2 w-full p-2 text-sm rounded-md bg-slate-800/80 border border-slate-600 focus:ring-2 focus:ring-brand-accent focus:outline-none text-brand-text" style={{colorScheme: 'dark'}}>
                            <option value="" disabled>Add member...</option>
                            {availableMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                        )}
                    </div>
                     <div>
                        <h3 className="text-lg font-semibold mb-2 text-brand-text">Preparation Tasks</h3>
                        <div className="space-y-2 text-sm max-h-60 overflow-y-auto pr-2">
                        {plan.tasks.map(task => (
                            <div key={task.id} className="p-2 bg-slate-800/70 rounded-md">
                                <p className="font-semibold text-brand-text">{task.name}</p>
                                <p className="text-xs text-brand-text-dark">WL: {task.workload} | Personnel: {task.requiredPersonnel}</p>
                                {canEdit && <div className='text-right'><button onClick={() => { setEditingTask(task); setIsTaskModalOpen(true); }} className="text-brand-accent text-xs px-1">Edit</button><button onClick={() => handleDeleteTask(task.id)} className="text-red-500 text-xs px-1">Del</button></div>}
                            </div>
                        ))}
                        </div>
                        {canEdit && <button onClick={() => { setEditingTask(null); setIsTaskModalOpen(true); }} className="mt-2 w-full text-sm bg-slate-700 hover:bg-slate-600 text-brand-text font-bold py-1.5 px-4 rounded-lg">Add New Task</button>}
                    </div>
                    {canEdit && <button onClick={handleGenerate} className="w-full bg-brand-star/80 hover:bg-brand-star text-slate-900 font-bold py-2 px-4 rounded-lg shadow-md transition-colors">Generate Distribution</button>}
                </Card>

                <div className="lg:col-span-2">
                    <Card>
                        <h2 className="text-2xl font-semibold text-brand-text mb-4">Works Generator and Workload Calculator</h2>
                        <div className="space-y-6">
                            {plan.involvedCommitteeMembers.map(memberId => {
                                const member = currentCommitteeMembers.find(m => m.id === memberId);
                                const memberTasks = plan.tasks
                                    .filter(t => t.assignedTo.includes(memberId))
                                    .sort((a,b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
                                return (
                                <div key={memberId} className="bg-slate-800/80 p-4 rounded-lg border border-slate-700">
                                    <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                                        <h4 className="font-bold text-lg text-brand-text">{member?.name}</h4>
                                        <p className="text-brand-accent font-semibold">Total Workload: {workloadByMember[memberId] || 0}</p>
                                    </div>
                                    <div className="flex gap-3 flex-wrap">
                                    {memberTasks.length > 0 ? memberTasks.map(task => (
                                        <div key={task.id} style={getTaskColor(task.id)} className="p-2 rounded-md border text-center flex-shrink-0" title={task.name}>
                                            <p className="font-semibold text-sm text-brand-text max-w-[120px] truncate">{task.name}</p>
                                            <p className="text-xs text-brand-text-dark">Due: {new Date(task.deadline).toLocaleDateString([], { month: 'short', day: 'numeric'})} {new Date(task.deadline).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                            <p className="text-xs font-bold text-brand-text mt-1">Avg. WL: {Math.round((task.workload / (task.assignedTo.length || 1)) * 10) / 10}</p>
                                        </div>
                                    )) : (
                                        <p className="text-sm text-brand-text-dark w-full text-center py-2">No tasks assigned.</p>
                                    )}
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    </Card>
                </div>
            </div>

            <Card>
                <h2 className="text-2xl font-semibold text-brand-text mb-4">Deadline Timeline</h2>
                 <div className="flex overflow-x-auto space-x-4 pb-4">
                    {deadlines.length > 0 ? deadlines.map(({ date, tasks }) => (
                        <div key={date} className="flex-shrink-0 w-64 bg-slate-800/70 p-3 rounded-lg border border-slate-700">
                            <h3 className="font-bold text-center text-brand-text mb-3">{new Date(date).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric'})}</h3>
                            <div className="space-y-2">
                                {tasks.sort((a,b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()).map(task => (
                                    <div key={task.id} style={getTaskColor(task.id)} className="p-2 rounded-md border text-sm">
                                        <p className="font-semibold text-brand-text">{task.name}</p>

                                        <p className="text-xs text-brand-text-dark">Due: {new Date(task.deadline).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} | WL: {task.workload}</p>
                                        <div className="flex gap-1 mt-1">
                                            {task.assignedTo.map(id => <span key={id} title={getCommitteeMemberById(id)?.name} className="w-5 h-5 rounded-full bg-slate-600 text-white text-xs flex items-center justify-center font-bold">{getCommitteeMemberById(id)?.name.charAt(0)}</span>)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )) : <p className="text-brand-text-dark text-center w-full">No tasks with deadlines in this plan yet.</p>}
                 </div>
            </Card>

            {isTaskModalOpen && plan && <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title={editingTask ? "Edit Task" : "Add New Task"}><TaskForm plan={plan} task={editingTask} onSave={handleSaveTask} onClose={() => setIsTaskModalOpen(false)} /></Modal>}
        </div>
    );
};

export default WorkDistribution;