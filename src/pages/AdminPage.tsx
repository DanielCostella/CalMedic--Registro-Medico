import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import { User } from '@/types/user';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const AdminPage: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Quick check for logged in user (in a real app, use AuthContext)
        const storedUser = localStorage.getItem('currentUser');
        if (!storedUser) {
            navigate('/');
            return;
        }

        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role !== 'Admin') {
            navigate('/'); // Redirect to homepage
            return;
        }

        setUser(parsedUser);
        setLoading(false);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/');
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!user) return null;

    return (
        <AdminDashboard
            user={user}
            activeSection="dashboard"
            onSectionChange={() => { }}
            onLogout={handleLogout}
        />
    );
};

export default AdminPage;
