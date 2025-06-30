import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Members from './components/Members';
import Events from './components/Events';
import Announcements from './components/Announcements';
import CalendarPage from './components/CalendarPage';
import KnowledgeBase from './components/KnowledgeBase';
import Workflows from './components/Workflows';
import Meetings from './components/Meetings';
import MeetingAgenda from './components/MeetingAgenda';
import EventBrainstorming from './components/EventBrainstorming';
import WorkDistribution from './components/WorkDistribution';
import Committee from './components/Committee';
import Login from './components/Login';
import ProtectedLayout from './components/ProtectedLayout';
import Register from './components/Register';
import AdminAuthGate from './components/Admin/AdminAuthGate';
import SuperAdminLogin from './components/SuperAdminLogin';

const App: React.FC = () => {
  return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/accounts" element={<AdminAuthGate />} />
        <Route path="/super-admin" element={<SuperAdminLogin />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/members" element={<Members />} />
          <Route path="/committee" element={<Committee />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/meetings/:meetingId" element={<MeetingAgenda />} />
          <Route path="/events" element={<Events />} />
          <Route path="/brainstorming" element={<EventBrainstorming />} />
          <Route path="/work-distribution" element={<WorkDistribution />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/knowledge-base" element={<KnowledgeBase />} />
          <Route path="/workflows" element={<Workflows />} />
        </Route>
      </Routes>
  );
};

export default App;