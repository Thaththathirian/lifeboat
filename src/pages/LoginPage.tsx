import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  GraduationCap, 
  Heart, 
  Building2, 
  Shield,
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  Lock
} from "lucide-react"
import StudentLogin from "./student/StudentLogin";
import { useStudent } from "@/contexts/StudentContext";

interface LoginPageProps {
  onLogin: (userType: 'admin' | 'student' | 'donor' | 'college') => void
}

const userTypes = [
  {
    type: 'admin' as const,
    title: 'Admin',
    description: 'Manage the entire platform',
    icon: Shield,
    color: 'bg-red-100 text-red-600',
    features: ['User Management', 'Payment Allotment', 'Reports', 'Global Messages']
  },
  {
    type: 'student' as const,
    title: 'Student',
    description: 'Apply for scholarships',
    icon: GraduationCap,
    color: 'bg-blue-100 text-blue-600',
    features: ['Application', 'Documents', 'Payments', 'Results']
  },
  {
    type: 'donor' as const,
    title: 'Donor',
    description: 'Support students financially',
    icon: Heart,
    color: 'bg-green-100 text-green-600',
    features: ['Donations', 'Student Mapping', 'Auto Payment', 'Impact Tracking']
  },
  {
    type: 'college' as const,
    title: 'College',
    description: 'Verify student payments',
    icon: Building2,
    color: 'bg-purple-100 text-purple-600',
    features: ['Student Management', 'Payment Verification', 'Receipts', 'Reports']
  }
]

export default function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate()
  const [selectedUserType, setSelectedUserType] = useState<'admin' | 'student' | 'donor' | 'college' | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const { status: studentStatus, setStatus: setStudentStatus, setProfile: setStudentProfile } = useStudent();
  // Redirect to /student only if student login UI is active and status is 'Profile Pending'
  useEffect(() => {
    if (selectedUserType === 'student' && studentStatus === 'Profile Pending') {
      navigate('/student', { replace: true });
    }
  }, [studentStatus, selectedUserType, navigate]);

  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get("type") as 'admin' | 'student' | 'donor' | 'college' | null;
  useEffect(() => {
    if (typeParam && ['admin', 'student', 'donor', 'college'].includes(typeParam)) {
      handleUserTypeSelect(typeParam as any);
    }
    // eslint-disable-next-line
  }, [typeParam]);

  const handleUserTypeSelect = (userType: 'admin' | 'student' | 'donor' | 'college') => {
    setSelectedUserType(userType)
    // Pre-fill with demo credentials
    const demoCredentials = {
      admin: { email: "admin@scholarship.com", password: "admin123" },
      student: { email: "rahul@email.com", password: "student123" },
      donor: { email: "john@email.com", password: "donor123" },
      college: { email: "admin@mu.ac.in", password: "college123" }
    }
    setFormData(demoCredentials[userType])
    if (userType === 'student') {
      setStudentStatus('login');
      setStudentProfile(null);
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedUserType) {
      onLogin(selectedUserType)
      switch (selectedUserType) {
        case "admin":
          navigate("/admin")
          break
        case "student":
          navigate("/student")
          break
        case "donor":
          navigate("/donor")
          break
        case "college":
          navigate("/college")
          break
        default:
          navigate("/")
      }
    }
  }

  const handleBack = () => {
    setSelectedUserType(null)
    setFormData({ email: "", password: "" })
  }

  if (!selectedUserType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.25, 0.46, 0.45, 0.94] 
            }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Welcome to Scholarship Connect
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose your role to access the platform and make a difference in students' lives
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {userTypes.map((userType, index) => (
              <motion.div
                key={userType.type}
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                <Card 
                  className="h-full cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                  onClick={() => handleUserTypeSelect(userType.type)}
                >
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 rounded-full ${userType.color} flex items-center justify-center mx-auto mb-4`}>
                      <userType.icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl">{userType.title}</CardTitle>
                    <CardDescription>{userType.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {userType.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <Button className="w-full mt-4" variant="outline">
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Login as {userType.title}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8"
          >
            <Button variant="ghost" onClick={() => navigate('/')}>← Back to Home</Button>
          </motion.div>
        </div>
      </div>
    )
  }

  if (selectedUserType === 'student') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <StudentLogin />
          <div className="mt-4 text-center">
            <Button variant="ghost" onClick={handleBack}>
              ← Choose Different Role
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const selectedType = userTypes.find(type => type.type === selectedUserType)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 0.5, 
          ease: [0.25, 0.46, 0.45, 0.94] 
        }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className={`w-16 h-16 rounded-full ${selectedType?.color} flex items-center justify-center mx-auto mb-4`}>
              {selectedType && <selectedType.icon className="h-8 w-8" />}
            </div>
            <CardTitle className="text-2xl">{selectedType?.title || 'User'} Login</CardTitle>
            <CardDescription>{selectedType?.description || 'Access your account'}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Demo Credentials:</strong><br />
                  Email: {formData.email}<br />
                  Password: {formData.password}
                </p>
              </div>

              <Button type="submit" className="w-full">
                <ArrowRight className="mr-2 h-4 w-4" />
                Login
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Button variant="ghost" onClick={handleBack}>
                ← Choose Different Role
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}