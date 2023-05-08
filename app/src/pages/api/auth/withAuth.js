
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function withAuth(Component) {
    return function WithAuth(props) {
        const { data: session, loading } = useSession();


        if (loading) {
            return <p>Loading...</p>;
        }

        if (!session) {
            if (typeof window !== 'undefined') {

                const router = require('next/router');
                router.push('/login');

            }
            return null;
        }

        return <Component {...props} />;
    };
}
