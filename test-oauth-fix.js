// Test script to verify OAuth API fix
console.log('Testing OAuth API fix...');

// Test the API endpoint directly
async function testOAuthAPI() {
  const mockUserData = {
    id: "test_user_id",
    name: "Test User", 
    email: "test@example.com",
    picture: "https://example.com/picture.jpg"
  };

  const mockToken = "mock_google_jwt_token";

  try {
    const response = await fetch('http://localhost/lifeboat/OAuth/Student', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${mockToken}`,
      },
      body: JSON.stringify({
        userData: mockUserData,
        tokenType: 'google_jwt',
      }),
    });

    console.log('Response Status:', response.status);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('Response Text:', responseText);

    return {
      success: response.ok,
      status: response.status,
      text: responseText
    };
  } catch (error) {
    console.error('API test failed:', error);
    return { success: false, error: error.message };
  }
}

// Run the test
testOAuthAPI().then(result => {
  console.log('Test result:', result);
}); 