import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useStudent } from "@/contexts/StudentContext";
import { LogIn, Phone, Lock, Loader2, ArrowLeft, RefreshCw } from "lucide-react";
import { useOTP } from "@/hooks/useOtp";

const mobileSchema = z.object({
  mobile: z.string()
    .min(10, "Mobile number must be 10 digits")
    .max(10, "Mobile number must be 10 digits")
    .regex(/^[6-9]\d{9}$/, "Please enter a valid Indian mobile number"),
});

const otpSchema = z.object({
  otp: z.string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only numbers"),
});

type MobileForm = z.infer<typeof mobileSchema>;
type OTPForm = z.infer<typeof otpSchema>;

export default function StudentLogin() {
  const { setStatus, setProfile } = useStudent();
  
  const {
    step,
    mobile,
    otpTimer,
    isLoading,
    isSendingOtp,
    sendOTP,
    verifyOTP,
    resendOTP,
    goBack,
  } = useOTP({
    onSuccess: (user) => {
      setProfile(user);
      setStatus('Profile Pending');
    },
    onError: (error) => {
      console.error('OTP Error:', error);
    },
  });

  const mobileForm = useForm<MobileForm>({
    resolver: zodResolver(mobileSchema),
    defaultValues: { mobile: '' }
  });

  const otpForm = useForm<OTPForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' }
  });

  const handleMobileSubmit = async (data: MobileForm) => {
    const success = await sendOTP(data.mobile);
    if (success) {
      mobileForm.reset();
    }
  };

  const handleOtpSubmit = async (data: OTPForm) => {
    const success = await verifyOTP(data.otp);
    if (success) {
      otpForm.reset();
    } else {
      otpForm.setError('otp', { message: 'Invalid OTP. Please try again.' });
    }
  };

  const handleResendOtp = async () => {
    await resendOTP();
    otpForm.reset();
  };

  const handleBack = () => {
    goBack();
    otpForm.reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <LogIn className="h-6 w-6" />
            Student Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 'mobile' ? (
            <Form {...mobileForm}>
              <form onSubmit={mobileForm.handleSubmit(handleMobileSubmit)} className="space-y-4">
                <FormField
                  control={mobileForm.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Mobile Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter 10-digit mobile number"
                          maxLength={10}
                          disabled={isSendingOtp}
                          {...field}
                          onChange={e => {
                            const value = e.target.value.replace(/\D/g, '');
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSendingOtp}
                >
                  {isSendingOtp ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  OTP sent to +91-{mobile}
                </p>
                <Button 
                  variant="link" 
                  onClick={handleBack} 
                  className="text-sm"
                  disabled={isLoading}
                >
                  <ArrowLeft className="mr-1 h-3 w-3" />
                  Change mobile number
                </Button>
              </div>
              
              <Form {...otpForm}>
                <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)} className="space-y-4">
                  <FormField
                    control={otpForm.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          Enter OTP
                        </FormLabel>
                        <FormControl>
                          <InputOTP 
                            maxLength={6} 
                            {...field}
                            disabled={isLoading}
                          >
                            <InputOTPGroup className="w-full justify-center">
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleResendOtp}
                      disabled={otpTimer > 0 || isSendingOtp || isLoading}
                      className="flex-1"
                    >
                      {isSendingOtp ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : otpTimer > 0 ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Resend OTP ({otpTimer}s)
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Resend OTP
                        </>
                      )}
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        "Verify & Login"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
              
              
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}