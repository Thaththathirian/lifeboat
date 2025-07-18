import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useStudentStatus } from '@/components/layout/StudentStatusProvider';

const alumni = [
  {
    name: "Priya Sharma",
    batch: "2020",
    current: "Software Engineer at Google",
    story: "Completed B.Tech with LBF scholarship. Now working at Google and mentoring current students.",
    avatar: "PS"
  },
  {
    name: "Rahul Verma", 
    batch: "2019",
    current: "Data Scientist at Amazon",
    story: "LBF scholarship helped me focus on studies. Now leading data science projects at Amazon.",
    avatar: "RV"
  },
  {
    name: "Anjali Patel",
    batch: "2021", 
    current: "Research Scholar at IIT",
    story: "Pursuing PhD with full scholarship. LBF foundation was the stepping stone to my academic journey.",
    avatar: "AP"
  }
];

const mentorship = [
  {
    title: "Career Guidance",
    description: "Get advice from industry professionals",
    available: true
  },
  {
    title: "Technical Mentoring", 
    description: "Learn from experienced developers",
    available: true
  },
  {
    title: "Interview Preparation",
    description: "Mock interviews and tips",
    available: false
  }
];

export default function StudentAlumni() {
  const { status, setStatus } = useStudentStatus();
  if (status === 'Blocked') {
    return <div className="max-w-2xl mx-auto py-10 px-4 text-center text-red-600 font-bold text-xl">Your account has been blocked. Please contact support.</div>;
  }
  const alumniStatuses = [
    'Eligible for Scholarship',
    'Payment Pending',
    'Paid',
    'Academic results pending',
    'Academic verification pending',
    'Apply for Next',
    'Alumni',
  ];
  if (!alumniStatuses.includes(status)) {
    return <div className="max-w-2xl mx-auto py-10 px-4 text-center text-gray-600 font-bold text-xl">Alumni features are not available at this stage.</div>;
  }
  return (
    <div className="max-w-4xl mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6 flex items-center justify-between">
        Alumni Network
        <Button
          className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700"
          onClick={() => setStatus('Profile Update')}
        >
          Apply Again
        </Button>
      </h2>
      
      {/* Success Stories */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h3 className="text-xl font-semibold mb-4">Success Stories</h3>
        <div className="space-y-6">
          {alumni.map((person, index) => (
            <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-semibold text-blue-600">
                {person.avatar}
              </div>
              <div className="flex-1">
                <div className="font-semibold">{person.name}</div>
                <div className="text-sm text-gray-600">{person.current}</div>
                <div className="text-sm text-gray-500">Batch: {person.batch}</div>
                <div className="text-sm mt-2">{person.story}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mentorship Opportunities */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">Mentorship Opportunities</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mentorship.map((item, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="font-medium mb-2">{item.title}</div>
              <div className="text-sm text-gray-600 mb-3">{item.description}</div>
              <Button 
                variant={item.available ? "default" : "outline"} 
                disabled={!item.available}
                className="w-full"
              >
                {item.available ? "Apply Now" : "Coming Soon"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 