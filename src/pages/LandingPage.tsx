import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { GraduationCap, Heart, Building2, Shield } from "lucide-react"

const roles = [
  {
    type: 'admin',
    title: 'Admin',
    description: 'Manage the entire platform',
    icon: <Shield className="h-8 w-8 text-red-500" />,
    iconBg: 'bg-red-100',
    features: [
      'User Management',
      'Payment Allotment',
      'Reports',
      'Global Messages',
    ],
    button: 'Login as Admin',
    buttonColor: 'bg-white',
    buttonText: 'text-black',
    loginType: 'admin',
  },
  {
    type: 'student',
    title: 'Student',
    description: 'Apply for scholarships',
    icon: <GraduationCap className="h-8 w-8 text-blue-500" />,
    iconBg: 'bg-blue-100',
    features: [
      'Application',
      'Documents',
      'Payments',
      'Results',
    ],
    button: 'Apply Now',
    buttonColor: 'bg-blue-500',
    buttonText: 'text-white',
    loginType: 'student',
  },
  {
    type: 'donor',
    title: 'Donor',
    description: 'Support students financially',
    icon: <Heart className="h-8 w-8 text-green-500" />,
    iconBg: 'bg-green-100',
    features: [
      'Donations',
      'Student Mapping',
      'Auto Payment',
      'Impact Tracking',
    ],
    button: 'Login as Donor',
    buttonColor: 'bg-white',
    buttonText: 'text-black',
    loginType: 'donor',
  },
  {
    type: 'college',
    title: 'College',
    description: 'Verify student payments',
    icon: <Building2 className="h-8 w-8 text-purple-500" />,
    iconBg: 'bg-purple-100',
    features: [
      'Student Management',
      'Payment Verification',
      'Receipts',
      'Reports',
    ],
    button: 'Login as College',
    buttonColor: 'bg-white',
    buttonText: 'text-black',
    loginType: 'college',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-2 py-8">
      <h1 className="text-5xl md:text-6xl font-bold text-center mb-4 mt-4 text-gray-900">Welcome to Scholarship Connect</h1>
      <p className="text-lg md:text-xl text-center text-gray-600 mb-10 max-w-2xl">
        Choose your role to access the platform and make a difference in students' lives
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
        {roles.map((role) => (
          <div
            key={role.type}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center p-8 transition-all hover:shadow-lg"
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${role.iconBg}`}>
              {role.icon}
            </div>
            <h2 className="text-2xl font-bold mb-1 text-center">{role.title}</h2>
            <p className="text-gray-500 mb-4 text-center">{role.description}</p>
            <ul className="text-gray-700 text-left mb-6 space-y-1">
              {role.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-300 rounded-full inline-block" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              variant="outline"
              className={`w-full font-semibold flex items-center justify-center gap-2 py-2 ${role.buttonColor} ${role.buttonText}`}
              onClick={() => {
                if (role.loginType === 'student') {
                  navigate('/');
                } else {
                  navigate(`/login?type=${role.loginType}`);
                }
              }}
            >
              <span className="mr-2">→</span> {role.button}
            </Button>
          </div>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Button variant="link" onClick={() => window.location.href = '/'}>
          ← Back to Home
        </Button>
      </div>
    </div>
  )
}