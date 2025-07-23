// Test script for OAuth API endpoint
async function testOAuthAPI() {
  console.log('Testing OAuth API endpoint...');
  
  // Mock Google user data
  const mockUserData = {
    id: "test_google_user_id",
    name: "Test User",
    email: "test@example.com",
    picture: "https://example.com/picture.jpg"
  };
  
  // Mock Google JWT token (this would normally come from Google OAuth)
  const mockGoogleToken = "mock_google_jwt_token_here";
  
  try {
    const response = await fetch('http://localhost/lifeboat/OAuth/Student', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${mockGoogleToken}`,
      },
      body: JSON.stringify({
        userData: mockUserData,
        tokenType: 'google_jwt',
      }),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error Response:', errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Success Response:', data);
    
    return {
      success: true,
      data: data
    };
  } catch (error) {
    console.error('OAuth API test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Test the API endpoint
testOAuthAPI().then(result => {
  console.log('Test result:', result);
}); 