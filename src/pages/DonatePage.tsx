import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Heart, ArrowLeft, Phone, CreditCard, Calendar, MapPin, User, Building, Users, Target, TrendingUp, ArrowRight, Shield } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CheckCircle } from "lucide-react"

interface DonorForm {
  // Basic Information
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  occupation: string
  
  // Address
  streetAddress: string
  city: string
  state: string
  pinCode: string
  
  // Donation Details
  donationType: string
  amount: number
  numberOfStudents: number
  howDidYouKnow: string
  shareDetails: boolean
  
  // Auto Payment
  autoDebit: boolean
  reminderDays: number
  
  // Additional
  testimonial: string
  referFriends: boolean
}

const donationTypes = [
  { value: "monthly", label: "Monthly", description: "₹10,000 per month" },
  { value: "quarterly", label: "Quarterly", description: "₹30,000 per quarter" },
  { value: "half-yearly", label: "Half Yearly", description: "₹60,000 per 6 months" },
  { value: "annually", label: "Annually", description: "₹1,20,000 per year" },
  { value: "one-time", label: "One Time", description: "Any amount" }
]

const howDidYouKnowOptions = [
  "Social Media",
  "Friend/Family Referral",
  "Website",
  "Advertisement",
  "News Article",
  "Event/Workshop",
  "Other"
]

export default function DonatePage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const [step, setStep] = useState(1) // 1: Mobile OTP, 2: Payment, 3: Details
  const [mobile, setMobile] = useState("")
  const [otp, setOtp] = useState("")
  const [amount, setAmount] = useState("")
  const [donationType, setDonationType] = useState("")
  const [showDonorForm, setShowDonorForm] = useState(false)
  const [donorForm, setDonorForm] = useState<DonorForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    occupation: "",
    streetAddress: "",
    city: "",
    state: "",
    pinCode: "",
    donationType: "monthly",
    amount: 10000,
    numberOfStudents: 1,
    howDidYouKnow: "",
    shareDetails: true,
    autoDebit: false,
    reminderDays: 3,
    testimonial: "",
    referFriends: false
  })

  const handleMobileSubmit = () => {
    if (mobile.length === 10) {
      toast({
        title: "OTP Sent",
        description: "Please enter the OTP sent to your mobile number",
      })
      // Simulate OTP sending
    }
  }

  const handleOTPVerify = () => {
    if (otp.length === 6) {
      setStep(2)
      toast({
        title: "Mobile Verified",
        description: "Please proceed with payment",
      })
    }
  }

  const handlePayment = async () => {
    // Simulate payment processing
    toast({
      title: "Processing Payment",
      description: "Please wait while we process your donation...",
    })
    
    setTimeout(() => {
      setStep(3)
      toast({
        title: "Payment Successful!",
        description: "Thank you for your generous donation. You can now fill optional details.",
      })
    }, 2000)
  }

  const handleDetailsSubmit = () => {
    toast({
      title: "Details Saved",
      description: "Your information has been saved successfully. Welcome to our donor community!",
    })
    navigate("/donor/dashboard")
  }

  const predefinedAmounts = ["5000", "10000", "15000", "25000", "50000"]

  const updateDonorForm = (field: keyof DonorForm, value: any) => {
    setDonorForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const renderHeroSection = () => (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-8">
            <Heart className="h-20 w-20 text-red-500 mx-auto mb-6" />
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Be Our Donor
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transform lives through education. Your donation can help deserving students 
              achieve their dreams and build a better future.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            <div className="bg-white p-6 rounded-xl shadow-soft">
              <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Help Students</h3>
              <p className="text-gray-600">Support deserving students with their education</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-soft">
              <Target className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Track Impact</h3>
              <p className="text-gray-600">See how your donation makes a difference</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-soft">
              <TrendingUp className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Build Future</h3>
              <p className="text-gray-600">Invest in the next generation of leaders</p>
          </div>
        </motion.div>

            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-red-500 hover:bg-red-600"
              onClick={() => setStep(2)}
            >
              <Heart className="mr-3 h-6 w-6" />
              Start Donating Now
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )

  const renderMobileVerification = () => (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-soft">
                <CardHeader className="text-center">
            <Phone className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">Verify Your Mobile</CardTitle>
            <CardDescription>
              Enter your mobile number to receive OTP for verification
            </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                      <Input
                        id="mobile"
                        type="tel"
                        placeholder="Enter 10-digit mobile number"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        maxLength={10}
                      />
                    </div>
            
                    <Button 
              className="w-full" 
                      onClick={handleMobileSubmit}
                      disabled={mobile.length !== 10}
                    >
                      Send OTP
                    </Button>

            <div className="text-center">
              <Button 
                variant="ghost" 
                onClick={() => setStep(1)}
              >
                ← Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
                  </div>
  )

  const renderOtpVerification = () => (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center p-4">
                    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-soft">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">Enter OTP</CardTitle>
            <CardDescription>
              We've sent a 6-digit code to {mobile}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>OTP Code</Label>
              <InputOTP
                        value={otp}
                onChange={setOtp}
                        maxLength={6}
                className="justify-center"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            
                      <Button 
              className="w-full" 
                        onClick={handleOTPVerify}
                        disabled={otp.length !== 6}
            >
              Verify OTP
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Didn't receive OTP? 
                <Button variant="link" className="p-0 h-auto">
                  Resend
                </Button>
              </p>
              <Button 
                variant="ghost" 
                onClick={() => setStep(2)}
              >
                ← Back to Mobile
                      </Button>
            </div>
                </CardContent>
              </Card>
            </motion.div>
    </div>
  )

  const renderPaymentSection = () => (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center p-4">
            <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-soft">
                <CardHeader className="text-center">
            <CreditCard className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">Complete Your Donation</CardTitle>
            <CardDescription>
              Choose your donation amount and payment method
            </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="donationType">Donation Type</Label>
                  <Select 
                    value={donorForm.donationType} 
                    onValueChange={(value) => updateDonorForm("donationType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {donationTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-sm text-muted-foreground">{type.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                    </div>

                <div>
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={donorForm.amount}
                    onChange={(e) => updateDonorForm("amount", parseInt(e.target.value))}
                    placeholder="Enter amount"
                  />
                  </div>

                <div>
                  <Label htmlFor="students">Number of Students</Label>
                      <Input
                    id="students"
                        type="number"
                    value={donorForm.numberOfStudents}
                    onChange={(e) => updateDonorForm("numberOfStudents", parseInt(e.target.value))}
                    placeholder="Approx. ₹10,000 per student"
                      />
                    </div>
                  </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Donation Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span>₹{donorForm.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Students:</span>
                      <span>{donorForm.numberOfStudents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="capitalize">{donorForm.donationType}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>₹{donorForm.amount.toLocaleString()}</span>
                    </div>
                  </div>
                  </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={donorForm.autoDebit}
                    onCheckedChange={(checked) => updateDonorForm("autoDebit", checked)}
                  />
                  <Label>Enable Auto-Debit</Label>
                        </div>

                {donorForm.autoDebit && (
                  <div>
                    <Label htmlFor="reminder">Reminder Days Before</Label>
                    <Input
                      id="reminder"
                      type="number"
                      value={donorForm.reminderDays}
                      onChange={(e) => updateDonorForm("reminderDays", parseInt(e.target.value))}
                      placeholder="Days before donation"
                    />
                          </div>
                        )}
                      </div>
            </div>

            <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setStep(3)}
              >
                ← Back
              </Button>
                  <Button 
                className="flex-1"
                    onClick={handlePayment}
                  >
                <CreditCard className="mr-2 h-4 w-4" />
                Proceed to Payment
                  </Button>
            </div>
                </CardContent>
              </Card>
            </motion.div>
    </div>
  )

  const renderDonorForm = () => (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
            <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Thank You for Your Donation!</h1>
            <p className="text-gray-600">Please complete your donor profile to get started</p>
                  </div>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Donor Registration Form</CardTitle>
              <CardDescription>
                Help us personalize your donation experience and track your impact
              </CardDescription>
                </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={donorForm.firstName}
                    onChange={(e) => updateDonorForm("firstName", e.target.value)}
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                    id="lastName"
                    value={donorForm.lastName}
                    onChange={(e) => updateDonorForm("lastName", e.target.value)}
                    placeholder="Enter your last name"
                  />
                </div>
                    </div>
                    
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                    value={donorForm.email}
                    onChange={(e) => updateDonorForm("email", e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={mobile}
                    disabled
                    placeholder="Your verified mobile number"
                      />
                    </div>
                  </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                        id="dob"
                        type="date"
                    value={donorForm.dateOfBirth}
                    onChange={(e) => updateDonorForm("dateOfBirth", e.target.value)}
                      />
                    </div>
                <div>
                      <Label htmlFor="occupation">Occupation</Label>
                      <Input
                        id="occupation"
                    value={donorForm.occupation}
                    onChange={(e) => updateDonorForm("occupation", e.target.value)}
                    placeholder="Enter your occupation"
                      />
                    </div>
                  </div>

              <div>
                <Label htmlFor="address">Street Address</Label>
                    <Input
                  id="address"
                  value={donorForm.streetAddress}
                  onChange={(e) => updateDonorForm("streetAddress", e.target.value)}
                  placeholder="Enter your complete address"
                    />
                  </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={donorForm.city}
                    onChange={(e) => updateDonorForm("city", e.target.value)}
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={donorForm.state}
                    onChange={(e) => updateDonorForm("state", e.target.value)}
                    placeholder="Enter state"
                  />
                </div>
                <div>
                  <Label htmlFor="pinCode">Pin Code</Label>
                    <Input
                    id="pinCode"
                    value={donorForm.pinCode}
                    onChange={(e) => updateDonorForm("pinCode", e.target.value)}
                    placeholder="Enter pin code"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="howDidYouKnow">How did you know about us?</Label>
                <Select 
                  value={donorForm.howDidYouKnow} 
                  onValueChange={(value) => updateDonorForm("howDidYouKnow", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    {howDidYouKnowOptions.map(option => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                  </div>

              <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                  <Switch
                    checked={donorForm.shareDetails}
                    onCheckedChange={(checked) => updateDonorForm("shareDetails", checked)}
                  />
                  <Label>Can we share your details with sponsored students?</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                  <Switch
                    checked={donorForm.referFriends}
                    onCheckedChange={(checked) => updateDonorForm("referFriends", checked)}
                  />
                  <Label>Would you like to refer your friends?</Label>
                    </div>
                  </div>

              <div>
                <Label htmlFor="testimonial">Testimonial (Optional)</Label>
                <Textarea
                  id="testimonial"
                  value={donorForm.testimonial}
                  onChange={(e) => updateDonorForm("testimonial", e.target.value)}
                  placeholder="Share your thoughts about helping students..."
                  rows={4}
                />
              </div>

              <div className="flex gap-4">
                    <Button 
                      variant="outline"
                      className="flex-1"
                  onClick={() => setStep(4)}
                    >
                  Skip for Now
                    </Button>
                    <Button 
                  className="flex-1"
                      onClick={handleDetailsSubmit}
                    >
                  Complete Registration
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
      </div>
    </div>
  )

  // Render based on current step
  switch (step) {
    case 1:
      return renderHeroSection()
    case 2:
      return renderMobileVerification()
    case 3:
      return renderOtpVerification()
    case 4:
      return renderPaymentSection()
    case 5:
      return renderDonorForm()
    default:
      return renderHeroSection()
  }
}