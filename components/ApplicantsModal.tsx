import React from 'react';
import Modal from './ui/Modal';
import type { Event } from '../types';

interface ApplicantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

const ApplicantsModal: React.FC<ApplicantsModalProps> = ({ isOpen, onClose, event }) => {
  if (!event) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Applicants for ${event.title}`}>
      {event.applicants.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-slate-700">
              <tr>
                <th className="p-2 text-sm font-semibold text-brand-text-dark uppercase">Name</th>
                <th className="p-2 text-sm font-semibold text-brand-text-dark uppercase">Student ID</th>
                <th className="p-2 text-sm font-semibold text-brand-text-dark uppercase">Email</th>
                <th className="p-2 text-sm font-semibold text-brand-text-dark uppercase">Applied On</th>
              </tr>
            </thead>
            <tbody>
              {event.applicants.map(applicant => (
                <tr key={applicant.id} className="border-b border-slate-800 hover:bg-white/10">
                  <td className="p-2 font-medium text-brand-text">{applicant.name}</td>
                  <td className="p-2 text-brand-text-dark">{applicant.studentId}</td>
                  <td className="p-2 text-brand-text-dark">{applicant.email}</td>
                  <td className="p-2 text-brand-text-dark">{new Date(applicant.applicationDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center p-4 text-brand-text-dark">No one has applied for this event yet.</p>
      )}
    </Modal>
  );
};

export default ApplicantsModal;