import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { Eye, EyeOff } from 'lucide-react';
import { initialValues, validationSchema } from '../validations/signupPageValidation';
import { userSignup } from '../services/authService';
import type { IUser, SignupFormValues } from '../types/auth.types';
import toast from 'react-hot-toast';
import type { RootState } from '../store/store';
import { useSelector } from 'react-redux';
export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const {token} = useSelector((state: RootState) => state.user);
  const isTouchDevice = useRef(false);
  
  useEffect(() => {
    isTouchDevice.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);
  
  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);
  const handleSubmit = async (values: SignupFormValues) => {

    setIsLoading(true);
    
    try {
      const userData: IUser = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        confirmPassword: values.confirmPassword
      };
      
      await userSignup(userData);
      toast.success('Account created successfully!')
      navigate('/login')        
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error instanceof Error ? error.message : 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Skip mouse move updates on touch devices to prevent flickering
    if (isTouchDevice.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div 
      className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden"
      onMouseMove={handleMouseMove}
      style={{ touchAction: 'manipulation' }}
    >
      <motion.div
        className="absolute top-20 left-20 w-64 h-64 md:w-96 md:h-96 bg-green-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: mousePosition.x * 0.02,
          y: mousePosition.y * 0.02,
        }}
        transition={{
          scale: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          },
          opacity: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          },
          x: {
            type: "spring",
            stiffness: 50,
            damping: 20
          },
          y: {
            type: "spring",
            stiffness: 50,
            damping: 20
          }
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-64 h-64 md:w-96 md:h-96 bg-emerald-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
          x: -mousePosition.x * 0.015,
          y: -mousePosition.y * 0.015,
        }}
        transition={{
          scale: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          },
          opacity: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          },
          x: {
            type: "spring",
            stiffness: 50,
            damping: 20
          },
          y: {
            type: "spring",
            stiffness: 50,
            damping: 20
          }
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-60 h-60 md:w-80 md:h-80 bg-green-400/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          x: mousePosition.x * 0.01 - 160,
          y: mousePosition.y * 0.01 - 160,
        }}
        transition={{
          scale: {
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          },
          opacity: {
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          },
          x: {
            type: "spring",
            stiffness: 50,
            damping: 20
          },
          y: {
            type: "spring",
            stiffness: 50,
            damping: 20
          }
        }}
      />

      {/* Sign Up Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        <motion.div 
          className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-green-500/20 p-6 sm:p-8 md:p-10 relative overflow-hidden"
          whileHover={{ 
            boxShadow: "0 0 40px rgba(34, 197, 94, 0.3)",
            borderColor: "rgba(34, 197, 94, 0.4)"
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Liquid effect overlay */}
          <motion.div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(34, 197, 94, 0.15) 0%, transparent 50%)`
            }}
          />

          {/* Logo/Title */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8 relative z-10"
          >
            <motion.div
              className="inline-block mb-4"
              whileHover={{ 
                scale: 1.1,
                rotate: [0, -5, 5, -5, 0],
              }}
              transition={{ 
                scale: { type: "spring", stiffness: 300 },
                rotate: { duration: 0.5 }
              }}
            >
              <motion.div 
                className="w-16 h-16 mx-auto bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/50"
                animate={{
                  boxShadow: [
                    "0 10px 30px rgba(34, 197, 94, 0.3)",
                    "0 10px 40px rgba(34, 197, 94, 0.5)",
                    "0 10px 30px rgba(34, 197, 94, 0.3)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </motion.div>
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-400 text-xs sm:text-sm">Join our creative stock library</p>
          </motion.div>

          {/* Error Display */}
          {/* {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4 relative z-10"
            >
              <p className="text-red-400 text-sm text-center">{error}</p>
            </motion.div>
          )} */}

          {/* Form */}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }: { isSubmitting: boolean }) => (
              <Form className="space-y-5 relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <Field name="name">
                {({ field, meta }: any) => (
                  <div>
                    <motion.input
                      {...field}
                      type="text"
                      id="name"
                      whileFocus={{ 
                        scale: 1.02,
                        borderColor: "rgba(34, 197, 94, 1)",
                        boxShadow: "0 0 20px rgba(34, 197, 94, 0.3)"
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className={`w-full px-4 py-3 bg-black/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300 ${
                        meta.touched && meta.error 
                          ? 'border-red-500/50' 
                          : 'border-green-500/30'
                      }`}
                      placeholder="John Doe"
                    />
                    {meta.touched && meta.error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-1"
                      >
                        {meta.error}
                      </motion.div>
                    )}
                  </div>
                )}
              </Field>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <Field name="email">
                {({ field, meta }: any) => (
                  <div>
                    <motion.input
                      {...field}
                      type="email"
                      id="email"
                      whileFocus={{ 
                        scale: 1.02,
                        borderColor: "rgba(34, 197, 94, 1)",
                        boxShadow: "0 0 20px rgba(34, 197, 94, 0.3)"
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className={`w-full px-4 py-3 bg-black/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300 ${
                        meta.touched && meta.error 
                          ? 'border-red-500/50' 
                          : 'border-green-500/30'
                      }`}
                      placeholder="your@email.com"
                    />
                    {meta.touched && meta.error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-1"
                      >
                        {meta.error}
                      </motion.div>
                    )}
                  </div>
                )}
              </Field>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 }}
            >
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number
              </label>
              <Field name="phone">
                {({ field, meta }: any) => (
                  <div>
                    <motion.input
                      {...field}
                      type="tel"
                      id="phone"
                      whileFocus={{ 
                        scale: 1.02,
                        borderColor: "rgba(34, 197, 94, 1)",
                        boxShadow: "0 0 20px rgba(34, 197, 94, 0.3)"
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className={`w-full px-4 py-3 bg-black/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300 ${
                        meta.touched && meta.error 
                          ? 'border-red-500/50' 
                          : 'border-green-500/30'
                      }`}
                      placeholder="+1234567890"
                    />
                    {meta.touched && meta.error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-1"
                      >
                        {meta.error}
                      </motion.div>
                    )}
                  </div>
                )}
              </Field>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <Field name="password">
                {({ field, meta }: any) => (
                  <div>
                    <div className="relative">
                      <motion.input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        whileFocus={{ 
                          scale: 1.02,
                          borderColor: "rgba(34, 197, 94, 1)",
                          boxShadow: "0 0 20px rgba(34, 197, 94, 0.3)"
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className={`w-full px-4 py-3 pr-12 bg-black/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300 ${
                          meta.touched && meta.error 
                            ? 'border-red-500/50' 
                            : 'border-green-500/30'
                        }`}
                        placeholder="••••••••"
                      />
                      <motion.button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </motion.button>
                    </div>
                    {meta.touched && meta.error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-1"
                      >
                        {meta.error}
                      </motion.div>
                    )}
                  </div>
                )}
              </Field>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <Field name="confirmPassword">
                {({ field, meta }: any) => (
                  <div>
                    <div className="relative">
                    <motion.input
                      {...field}
                        type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      whileFocus={{ 
                        scale: 1.02,
                        borderColor: "rgba(34, 197, 94, 1)",
                        boxShadow: "0 0 20px rgba(34, 197, 94, 0.3)"
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                        className={`w-full px-4 py-3 pr-12 bg-black/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300 ${
                        meta.touched && meta.error 
                          ? 'border-red-500/50' 
                          : 'border-green-500/30'
                      }`}
                      placeholder="••••••••"
                    />
                      <motion.button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </motion.button>
                    </div>
                    {meta.touched && meta.error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-1"
                      >
                        {meta.error}
                      </motion.div>
                    )}
                  </div>
                )}
              </Field>
            </motion.div>
{/* 
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-start text-sm"
            >
              <label className="flex items-start text-gray-400 cursor-pointer group">
                <motion.input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="mr-2 w-4 h-4 mt-0.5 bg-black/50 border-green-500/30 rounded focus:ring-green-500/20"
                />
                <span className="group-hover:text-gray-300 transition-colors">
                  I agree to the{' '}
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.05 }}
                    className="text-green-400 hover:text-green-300"
                  >
                    Terms of Service
                  </motion.a>
                  {' '}and{' '}
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.05 }}
                    className="text-green-400 hover:text-green-300"
                  >
                    Privacy Policy
                  </motion.a>
                </span>
              </label>
            </motion.div> */}

            <motion.button
              type="submit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              whileHover={{ 
                scale: 1.03,
                boxShadow: "0 0 30px rgba(34, 197, 94, 0.7)"
              }}
              whileTap={{ scale: 0.97 }}
              disabled={isSubmitting || isLoading}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg shadow-lg shadow-green-500/50 hover:shadow-green-500/70 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              <span className="relative z-10">
                {isSubmitting || isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  'Create Account'
                )}
              </span>
            </motion.button>
              </Form>
            )}
          </Formik>

          {/* Sign In Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 text-center text-gray-400 text-sm relative z-10"
          >
            Already have an account?{' '}
            <Link to="/login">
            <motion.span
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="text-green-400 hover:text-green-300 font-semibold transition-colors inline-block"
            >
              Sign in
            </motion.span>
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}