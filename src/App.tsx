import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import AssessmentHistory from './pages/Assessments/AssessmentHistory';
import AssessmentInput from './pages/Assessments/AssessmentInput';
import AssessmentResultPage from './pages/Assessments/AssessmentResult';
import TestChecklistPage from './pages/QA/TestChecklistPage';
import ShipPage from './pages/QA/ShipPage';
import ProofPage from './pages/QA/ProofPage';
import {
  Practice,
  Resources,
  Profile
} from './pages/Placeholders';
import RBStepPage from './pages/RB/RBStepPage';
import RBProofPage from './pages/RB/RBProofPage';
import ResumeLayout from './pages/Resume/ResumeLayout';
import ResumeHome from './pages/Resume/ResumeHome';
import ResumeBuilder from './pages/Resume/ResumeBuilder';
import ResumePreview from './pages/Resume/ResumePreview';
import ResumeProof from './pages/Resume/ResumeProof';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/assessments" element={<AssessmentHistory />} />
          <Route path="/assessments/new" element={<AssessmentInput />} />
          <Route path="/assessments/:id" element={<AssessmentResultPage />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/prp/07-test" element={<TestChecklistPage />} />
          <Route path="/prp/08-ship" element={<ShipPage />} />
          <Route path="/prp/proof" element={<ProofPage />} />

          {/* Project 3: AI Resume Builder */}
          <Route path="/rb/01-problem" element={<RBStepPage stepNumber={1} />} />
          <Route path="/rb/02-market" element={<RBStepPage stepNumber={2} />} />
          <Route path="/rb/03-architecture" element={<RBStepPage stepNumber={3} />} />
          <Route path="/rb/04-hld" element={<RBStepPage stepNumber={4} />} />
          <Route path="/rb/05-lld" element={<RBStepPage stepNumber={5} />} />
          <Route path="/rb/06-build" element={<RBStepPage stepNumber={6} />} />
          <Route path="/rb/08-ship" element={<RBStepPage stepNumber={8} />} />
          <Route path="/rb/proof" element={<RBProofPage />} />

          {/* Resume Builder App */}
          <Route path="/resume" element={<ResumeLayout />}>
            <Route index element={<ResumeHome />} />
            <Route path="builder" element={<ResumeBuilder />} />
            <Route path="preview" element={<ResumePreview />} />
            <Route path="proof" element={<ResumeProof />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
