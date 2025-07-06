import { NextRequest, NextResponse } from "next/server";
import tiktokdl from "@tobyg74/tiktok-api-dl";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate TikTok URL - accept both desktop and mobile formats
    const desktopPattern =
      /^https?:\/\/(www\.)?tiktok\.com\/@[\w.-]+\/video\/\d+/;
    const mobilePattern =
      /^https?:\/\/(www\.)?tiktok\.com\/t\/Z[A-Za-z0-9]+\/?/;

    if (!desktopPattern.test(url) && !mobilePattern.test(url)) {
      return NextResponse.json(
        { error: "Invalid TikTok URL. Please use a valid TikTok video URL." },
        { status: 400 }
      );
    }

    // Download the video using the TikTok downloader
    // Try different versions for better success rate
    let result: any;
    let v1Error: Error | null = null;

    // Try v1 first (most reliable)
    try {
      result = await tiktokdl.Downloader(url, {
        version: "v1",
      });
      console.log("V1 Result:", JSON.stringify(result, null, 2));
      if (result.status === "success") {
        // Success with v1
      } else {
        throw new Error(result.message || "v1 failed");
      }
    } catch (error) {
      v1Error = error as Error;
      console.log("V1 Error:", error);
      // Try v2 as fallback
      try {
        result = await tiktokdl.Downloader(url, {
          version: "v2",
        });
        console.log("V2 Result:", JSON.stringify(result, null, 2));
        if (result.status === "success") {
          // Success with v2
        } else {
          throw new Error(result.message || "v2 failed");
        }
      } catch (v2Error) {
        console.log("V2 Error:", v2Error);
        // Try v3 as last resort
        try {
          result = await tiktokdl.Downloader(url, {
            version: "v3",
          });
          console.log("V3 Result:", JSON.stringify(result, null, 2));
          if (result.status === "success") {
            // Success with v3
          } else {
            throw new Error(result.message || "v3 failed");
          }
        } catch (v3Error) {
          console.log("V3 Error:", v3Error);
          const v1Msg = v1Error?.message || "v1 failed";
          const v2Msg = (v2Error as Error)?.message || "v2 failed";
          const v3Msg = (v3Error as Error)?.message || "v3 failed";
          throw new Error(
            `All download methods failed: ${v1Msg}, ${v2Msg}, ${v3Msg}`
          );
        }
      }
    }

    // Extract video information based on the actual response structure
    const videoInfo = {
      title: result.result?.desc || "TikTok Video",
      author: {
        username: result.result?.author?.username || "@username",
        nickname: result.result?.author?.nickname || "User",
        avatarMedium: result.result?.author?.avatarMedium?.[0] || "",
        signature: result.result?.author?.signature || "",
        region: result.result?.author?.region || "",
      },
      statistics: {
        likes: result.result?.statistics?.likeCount || 0,
        comments: result.result?.statistics?.commentCount || 0,
        shares: result.result?.statistics?.shareCount || 0,
        plays: result.result?.statistics?.playCount || 0,
        downloads: result.result?.statistics?.downloadCount || 0,
      },
      video: {
        duration: result.result?.video?.duration || 0,
        ratio: result.result?.video?.ratio || "",
        cover:
          result.result?.video?.dynamicCover?.[0] ||
          result.result?.video?.cover?.[0] ||
          "",
      },
      music: {
        title: result.result?.music?.title || "Original Sound",
        author: result.result?.music?.author || "Unknown",
        duration: result.result?.music?.duration || 0,
      },
    };

    // Get download URLs based on the actual response structure
    let downloadUrls = {
      videoNoWatermark: "",
      videoWithWatermark: "",
      music: "",
    };

    // Extract video URLs
    if (result.result?.video?.playAddr?.[0]) {
      downloadUrls.videoNoWatermark = result.result.video.playAddr[0];
    }

    if (result.result?.video?.playAddr?.[1]) {
      downloadUrls.videoWithWatermark = result.result.video.playAddr[1];
    }

    // Extract music URL
    if (result.result?.music?.playUrl?.[0]) {
      downloadUrls.music = result.result.music.playUrl[0];
    }

    console.log("Extracted download URLs:", downloadUrls);

    return NextResponse.json({
      success: true,
      downloadUrls,
      videoInfo,
      message: "Video downloaded successfully",
      version: result.version || "unknown",
      debug: {
        hasVideoUrl: !!(
          downloadUrls.videoNoWatermark || downloadUrls.videoWithWatermark
        ),
        hasMusicUrl: !!downloadUrls.music,
        possibleVideoUrls: [
          downloadUrls.videoNoWatermark,
          downloadUrls.videoWithWatermark,
        ].filter(Boolean).length,
        possibleMusicUrls: downloadUrls.music ? 1 : 0,
        cookieUsed: false,
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to process video",
        success: false,
      },
      { status: 500 }
    );
  }
}
