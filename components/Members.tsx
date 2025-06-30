import React, { useState, useMemo, useRef } from 'react';
import * as XLSX from 'xlsx';
import Card from './ui/Card';
import { useData } from '../context/DataContext';
import type { ClubMember } from '../types';

const SortableHeader = ({ label, sortKey, sortConfig, setSortConfig }: { label: string, sortKey: keyof ClubMember, sortConfig: any, setSortConfig: any }) => {
  const isSorted = sortConfig.key === sortKey;
  const directionIcon = isSorted ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '';
  
  const handleClick = () => {
    const direction = isSorted && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key: sortKey, direction });
  }

  return (
    <th className="p-3 text-sm font-semibold text-brand-text-dark uppercase cursor-pointer hover:bg-slate-800/60" onClick={handleClick}>
      {label} <span className="text-xs">{directionIcon}</span>
    </th>
  )
}

const getExpiryClass = (validUntil: string): string => {
  const now = new Date();
  const expiryDate = new Date(validUntil);
  const daysDiff = (expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24);
  if (daysDiff < 0) return 'bg-red-500/20 text-red-300';
  if (daysDiff <= 30) return 'bg-yellow-500/20 text-yellow-300';
  return '';
};

const Members: React.FC = () => {
  const { clubMembers, addClubMembers } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [sortConfig, setSortConfig] = useState<{ key: keyof ClubMember, direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sortedAndFilteredMembers = useMemo(() => {
    let sortableMembers = [...clubMembers];
    
    if (sortConfig.key) {
      sortableMembers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableMembers
      .filter(member => {
        const term = searchTerm.toLowerCase();
        return member.name.toLowerCase().includes(term) || member.studentId.includes(term) || member.email.toLowerCase().includes(term);
      })
      .filter(member => {
        if (statusFilter === 'All') return true;
        return member.status === statusFilter;
      });
  }, [clubMembers, searchTerm, statusFilter, sortConfig]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadMessage(null);

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array', cellDates: true });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json: (string | Date)[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            if (json.length <= 1) {
                throw new Error("The Excel file is empty or contains only a header row.");
            }
            
            const rows = json.slice(1);
            const newMembers: ClubMember[] = [];
            const errors: string[] = [];

            rows.forEach((row, index) => {
                if (row.every(cell => !cell)) return;
                
                const [name, studentId, memberType, membershipValidUntil, status] = row;
                
                if (!name || !studentId || !memberType || !membershipValidUntil || !status) {
                    errors.push(`Row ${index + 2}: Missing one or more required fields.`);
                    return;
                }

                const validMemberType = memberType === 'Full' || memberType === 'Associate';
                if (!validMemberType) {
                    errors.push(`Row ${index + 2}: Invalid Member Type "${memberType}". Must be 'Full' or 'Associate'.`);
                    return;
                }
                
                const validStatus = status === 'Active' || status === 'Inactive';
                if (!validStatus) {
                    errors.push(`Row ${index + 2}: Invalid Status "${status}". Must be 'Active' or 'Inactive'.`);
                    return;
                }

                if (!(membershipValidUntil instanceof Date && !isNaN(membershipValidUntil.getTime()))) {
                    errors.push(`Row ${index + 2}: Invalid format for Expired Date. Please ensure it's a valid date (e.g., YYYY-MM-DD).`);
                    return;
                }
                
                newMembers.push({
                    id: `m-${Date.now()}-${index}`,
                    name: String(name),
                    studentId: String(studentId),
                    joinDate: new Date().toISOString().split('T')[0],
                    email: `${String(studentId)}@connect.ust.hk`.toLowerCase(),
                    memberType: memberType as 'Full' | 'Associate',
                    membershipValidUntil: membershipValidUntil.toISOString().split('T')[0],
                    status: status as 'Active' | 'Inactive',
                });
            });

            if (errors.length > 0) {
                setUploadMessage({ type: 'error', text: `Upload failed with ${errors.length} error(s):\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? '\n...' : ''}` });
            } else {
                addClubMembers(newMembers);
                setUploadMessage({ type: 'success', text: `${newMembers.length} new members processed successfully.` });
            }
        } catch (error: any) {
            console.error(error);
            setUploadMessage({ type: 'error', text: `Failed to parse Excel file: ${error.message}` });
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };
    reader.readAsArrayBuffer(file);
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="text-4xl font-bold text-brand-text">Club Members</h1>
      <Card>
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <input
            type="text"
            placeholder="Search by name, student ID, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3 p-2 rounded-md bg-slate-800/80 border border-slate-600 focus:ring-2 focus:ring-brand-accent focus:outline-none text-brand-text placeholder:text-slate-400"
          />
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
                <label htmlFor="statusFilter" className="text-brand-text-dark">Status:</label>
                <select
                  id="statusFilter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'All' | 'Active' | 'Inactive')}
                  className="p-2 rounded-md bg-slate-800/80 border border-slate-600 focus:ring-2 focus:ring-brand-accent focus:outline-none text-brand-text"
                  style={{colorScheme: 'dark'}}
                >
                  <option value="All">All</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
            </div>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload}
                className="hidden"
                accept=".xlsx, .xls, .csv"
            />
            <button 
                onClick={triggerFileInput} 
                disabled={isUploading}
                className="bg-brand-accent hover:bg-brand-accent-dark text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors flex items-center gap-2 disabled:bg-slate-400"
            >
                {isUploading ? (
                    <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                    </>
                ) : (
                    <>
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        Upload Excel
                    </>
                )}
            </button>
          </div>
        </div>

        {uploadMessage && (
            <div className={`p-3 rounded-md mb-4 text-sm ${uploadMessage.type === 'success' ? 'bg-green-500/30 text-green-200 border border-green-400/50' : 'bg-red-500/30 text-red-200 border border-red-400/50'}`}>
                <pre className="whitespace-pre-wrap font-sans">{uploadMessage.text}</pre>
            </div>
        )}

        {!uploadMessage && !isUploading && (
            <div className="p-3 rounded-md mb-4 bg-slate-800/80 border border-slate-700 text-sm text-brand-text-dark">
                <strong>To upload members in bulk:</strong>
                <p>Create an Excel file (.xlsx) with the first row as headers. The columns must be in this order:</p>
                <ul className="list-disc list-inside ml-4 mt-1">
                    <li>Column A: <strong>Name</strong> (e.g., John Doe)</li>
                    <li>Column B: <strong>Student ID</strong> (e.g., 20123456)</li>
                    <li>Column C: <strong>Member Type</strong> ('Full' or 'Associate')</li>
                    <li>Column D: <strong>Expired Date</strong> (e.g., 2025-08-31)</li>
                    <li>Column E: <strong>Status</strong> ('Active' or 'Inactive')</li>
                </ul>
            </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-slate-700">
              <tr>
                <SortableHeader label="Name" sortKey="name" sortConfig={sortConfig} setSortConfig={setSortConfig} />
                <th className="p-3 text-sm font-semibold text-brand-text-dark uppercase">Student ID</th>
                <SortableHeader label="Member Type" sortKey="memberType" sortConfig={sortConfig} setSortConfig={setSortConfig} />
                <SortableHeader label="Expires On" sortKey="membershipValidUntil" sortConfig={sortConfig} setSortConfig={setSortConfig} />
                <SortableHeader label="Status" sortKey="status" sortConfig={sortConfig} setSortConfig={setSortConfig} />
              </tr>
            </thead>
            <tbody>
              {sortedAndFilteredMembers.map((member: ClubMember) => (
                <tr key={member.id} className={`border-b border-slate-800 transition-colors duration-200 ${getExpiryClass(member.membershipValidUntil)}`}>
                  <td className="p-3 font-medium text-brand-text">{member.name}</td>
                  <td className="p-3 text-brand-text-dark">{member.studentId}</td>
                  <td className="p-3 text-brand-text-dark">{member.memberType}</td>
                  <td className="p-3 text-brand-text-dark">{new Date(member.membershipValidUntil).toLocaleDateString()}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      member.status === 'Active' ? 'bg-green-500/30 text-green-300' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sortedAndFilteredMembers.length === 0 && <p className="text-center p-4 text-brand-text-dark">No members found.</p>}
      </Card>
    </div>
  );
};

export default Members;