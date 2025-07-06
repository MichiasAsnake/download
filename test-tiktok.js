const tiktokdl = require("@tobyg74/tiktok-api-dl");

async function testTiktok() {
  try {
    console.log("Testing TikTok API...");

    // Test with a real username
    const result = await tiktokdl.GetUserPosts("charlidamelio", {
      postLimit: 5,
    });

    console.log("Result:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

testTiktok();
