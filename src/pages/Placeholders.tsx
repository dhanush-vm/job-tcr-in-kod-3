

const PagePlaceholder = ({ title }: { title: string }) => (
    <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 flex items-center justify-center h-64">
            <p className="text-gray-500 text-lg">Content for {title} coming soon...</p>
        </div>
    </div>
);

export const Dashboard = () => <PagePlaceholder title="Dashboard" />;
export const Practice = () => <PagePlaceholder title="Practice" />;
export const Assessments = () => <PagePlaceholder title="Assessments" />;
export const Resources = () => <PagePlaceholder title="Resources" />;
export const Profile = () => <PagePlaceholder title="Profile" />;
