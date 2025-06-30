import React, { useState } from 'react';
import Card from './ui/Card';
import Modal from './ui/Modal';
import { useData } from '../context/DataContext';
import type { CommitteeMember, CommitteeSection } from '../types';
import { useAuth } from '../context/AuthContext';

const CommitteeMemberForm: React.FC<{
  sectionId: string;
  member: CommitteeMember | null;
  onSave: (sectionId: string, member: Omit<CommitteeMember, 'id'> | CommitteeMember) => void;
  onClose: () => void;
}> = ({ sectionId, member, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: member?.name || '',
    email: member?.email || '',
    role: member?.role || 'General Secretary',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (member) {
      onSave(sectionId, { ...member, ...formData });
    } else {
      onSave(sectionId, formData as Omit<CommitteeMember, 'id'>);
    }
    onClose();
  };
  
  const roles: CommitteeMember['role'][] = [
    'President', 
    'Internal Vice President', 
    'External Vice President', 
    'General Secretary',
    'Financial Secretary',
    'Internal Secretary',
    'External Secretary',
    'Promotion Secretary',
    'Academic Secretary',
    'IT Secretary',
    'Material Secretary',
    'Marketing Secretary'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Full Name"
        required
        className="w-full p-2 rounded-md bg-slate-800/80 border border-slate-600 focus:ring-2 focus:ring-brand-accent focus:outline-none text-brand-text placeholder:text-slate-400"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email Address"
        required
        className="w-full p-2 rounded-md bg-slate-800/80 border border-slate-600 focus:ring-2 focus:ring-brand-accent focus:outline-none text-brand-text placeholder:text-slate-400"
      />
      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        required
        className="w-full p-2 rounded-md bg-slate-800/80 border border-slate-600 focus:ring-2 focus:ring-brand-accent focus:outline-none text-brand-text"
        style={{colorScheme: 'dark'}}
      >
        {roles.map(r => <option key={r} value={r}>{r}</option>)}
      </select>
      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onClose} className="bg-slate-700 hover:bg-slate-600 text-brand-text font-bold py-2 px-4 rounded-lg shadow-md transition-colors">Cancel</button>
        <button type="submit" className="bg-brand-accent hover:bg-brand-accent-dark text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors">{member ? 'Save Changes' : 'Add Member'}</button>
      </div>
    </form>
  );
};

const SectionCard: React.FC<{
  section: CommitteeSection;
  canEdit: boolean;
  onEditMember: (sectionId: string, member: CommitteeMember) => void;
  onDeleteMember: (sectionId: string, memberId: string) => void;
  onAddMember: (sectionId: string) => void;
}> = ({ section, canEdit, onEditMember, onDeleteMember, onAddMember }) => (
  <Card>
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-semibold text-brand-text">{section.name}</h2>
      {canEdit && (
        <button onClick={() => onAddMember(section.id)} className="bg-brand-accent/20 hover:bg-brand-accent/40 text-brand-accent font-semibold py-1 px-3 rounded-lg text-sm">
          Add Member
        </button>
      )}
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="border-b border-slate-700">
          <tr>
            <th className="p-3 text-sm font-semibold text-brand-text-dark uppercase">Name</th>
            <th className="p-3 text-sm font-semibold text-brand-text-dark uppercase">Role</th>
            <th className="p-3 text-sm font-semibold text-brand-text-dark uppercase">Email</th>
            {canEdit && <th className="p-3 text-sm font-semibold text-brand-text-dark uppercase text-right">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {section.members.map((member) => (
            <tr key={member.id} className="border-b border-slate-800 hover:bg-white/10">
              <td className="p-3 font-medium text-brand-text">{member.name}</td>
              <td className="p-3 text-brand-text-dark">{member.role}</td>
              <td className="p-3 text-brand-text-dark">{member.email}</td>
              {canEdit && (
                <td className="p-3 text-right">
                  <button onClick={() => onEditMember(section.id, member)} className="text-brand-accent hover:text-brand-accent-dark px-2 py-1 rounded">Edit</button>
                  <button onClick={() => onDeleteMember(section.id, member.id)} className="text-red-400 hover:text-red-300 px-2 py-1 rounded ml-2">Delete</button>
                </td>
              )}
            </tr>
          ))}
          {section.members.length === 0 && (
            <tr>
              <td colSpan={canEdit ? 4 : 3} className="text-center p-4 text-brand-text-dark">No members in this section yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </Card>
);

const Committee: React.FC = () => {
  const { committeeSections, addCommitteeSection, addCommitteeMember, updateCommitteeMember, deleteCommitteeMember } = useData();
  const { currentUser } = useAuth();
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<CommitteeMember | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string>('');
  const [newSectionName, setNewSectionName] = useState('');

  const canEdit = currentUser?.permissionLevel === 'current';

  const openMemberModal = (sectionId: string, member: CommitteeMember | null = null) => {
    setActiveSectionId(sectionId);
    setEditingMember(member);
    setIsMemberModalOpen(true);
  };

  const closeMemberModal = () => {
    setIsMemberModalOpen(false);
    setEditingMember(null);
    setActiveSectionId('');
  };

  const handleSaveMember = (sectionId: string, memberData: Omit<CommitteeMember, 'id'> | CommitteeMember) => {
    if ('id' in memberData) {
      updateCommitteeMember(sectionId, memberData);
    } else {
      addCommitteeMember(sectionId, {
        ...memberData,
        id: `c-${Date.now()}`
      });
    }
  };
  
  const handleDeleteMember = (sectionId: string, memberId: string) => {
    if(window.confirm('Are you sure you want to remove this member from the committee?')) {
        deleteCommitteeMember(sectionId, memberId);
    }
  };

  const handleAddSection = (e: React.FormEvent) => {
    e.preventDefault();
    if(newSectionName.trim()){
      addCommitteeSection(newSectionName.trim());
      setNewSectionName('');
      setIsSectionModalOpen(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-brand-text">Committee Management</h1>
        {canEdit && (
          <button onClick={() => setIsSectionModalOpen(true)} className="bg-brand-accent hover:bg-brand-accent-dark text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
            Add New Section
          </button>
        )}
      </div>
      <p className="text-lg text-brand-text-dark">Manage current and past committee members. Each section represents a term.</p>
      
      <div className="space-y-8">
        {committeeSections.map(section => (
          <SectionCard 
            key={section.id} 
            section={section} 
            canEdit={canEdit}
            onEditMember={openMemberModal}
            onDeleteMember={handleDeleteMember}
            onAddMember={openMemberModal}
          />
        ))}
      </div>

      {isMemberModalOpen && (
        <Modal isOpen={isMemberModalOpen} onClose={closeMemberModal} title={editingMember ? 'Edit Committee Member' : 'Add Committee Member'}>
          <CommitteeMemberForm 
            sectionId={activeSectionId} 
            member={editingMember} 
            onSave={handleSaveMember} 
            onClose={closeMemberModal} 
          />
        </Modal>
      )}

      <Modal isOpen={isSectionModalOpen} onClose={() => setIsSectionModalOpen(false)} title="Add New Committee Section">
        <form onSubmit={handleAddSection} className="space-y-4">
            <p className="text-brand-text-dark">Create a new container for a committee term, e.g., "Committee 2025-2026".</p>
            <input
                type="text"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                placeholder="Section Name"
                required
                className="w-full p-2 rounded-md bg-slate-800/80 border border-slate-600 focus:ring-2 focus:ring-brand-accent focus:outline-none text-brand-text placeholder:text-slate-400"
            />
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setIsSectionModalOpen(false)} className="bg-slate-700 hover:bg-slate-600 text-brand-text font-bold py-2 px-4 rounded-lg">Cancel</button>
              <button type="submit" className="bg-brand-accent hover:bg-brand-accent-dark text-white font-bold py-2 px-4 rounded-lg">Create Section</button>
            </div>
        </form>
      </Modal>
    </div>
  );
};

export default Committee;