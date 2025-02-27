import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Logout: React.FC = () => {
  const { signOut } = useAuth();

  useEffect(() => {
    const logout = async () => {
      await signOut();
      alert('Logout successful!');
    };
    logout();
  }, [signOut]);

  return <div>Logging out...</div>;
};

export default Logout;