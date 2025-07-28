// Test script for college API
async function testCollegeAPI() {
  try {
    const response = await fetch('https://localhost/lifeboat/Student/get_all_colleges?status=1');
    const data = await response.json();
    console.log('API Response:', data);
    
    if (data.status && data.data) {
      console.log('Colleges found:', data.data.length);
      data.data.forEach((college, index) => {
        console.log(`${index + 1}. ${college.name} - ${college.mobile} - ${college.email}`);
      });
    } else {
      console.error('API returned error:', data.message);
    }
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

// Run the test
testCollegeAPI(); 