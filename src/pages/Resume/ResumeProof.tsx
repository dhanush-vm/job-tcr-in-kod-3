import { AlertTriangle } from 'lucide-react';

export default function ResumeProof() {
    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 p-8">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center">
                <div className="h-16 w-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle size={32} />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">Proof of Work</h2>
                <p className="text-gray-500 mb-8">
                    This section will contain the artifacts and verification steps for the Resume Builder project once implementation is complete.
                </p>

                <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-sm text-gray-400 font-mono">
                    // Artifact placeholder
                    <br />
                    status: pending_implementation
                </div>
            </div>
        </div>
    );
}
