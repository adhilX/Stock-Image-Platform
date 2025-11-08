import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut, User, Key } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../store/slice/authSlice';
import { userLogout } from '../../../services/authService';
import ChangePasswordModal from '../modals/ChangePasswordModal';
import toast from 'react-hot-toast';
import type { RootState } from '../../../store/store';

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.user);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await userLogout();
      dispatch(logout());
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, clear local state
      dispatch(logout());
      toast.error('Logged out locally');
      navigate('/login');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between mb-8"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-gray-400 text-sm">Welcome back,</p>
          <p className="text-white font-semibold">{user?.name || 'User'}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsChangePasswordOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-all duration-300 border border-green-500/30 hover:border-green-500/50"
        >
          <Key className="w-4 h-4" />
          <span className="text-sm font-medium">Change Password</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all duration-300 border border-red-500/30 hover:border-red-500/50"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Logout</span>
        </motion.button>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </motion.div>
  );
}

