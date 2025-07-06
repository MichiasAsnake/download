import { NextRequest, NextResponse } from "next/server";
import tiktokdl from "@tobyg74/tiktok-api-dl";

export async function POST(request: NextRequest) {
  try {
    const { username, postLimit = 30 } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // Validate username format
    if (!/^[a-zA-Z0-9._]+$/.test(username)) {
      return NextResponse.json(
        { error: "Invalid username format" },
        { status: 400 }
      );
    }

    console.log(`Getting posts for user: ${username} with limit: ${postLimit}`);

    // Get user posts using the TikTok API
    const result = await tiktokdl.GetUserPosts(username, {
      postLimit: postLimit,
    });

    console.log("Get user posts result:", JSON.stringify(result, null, 2));

    if (result.status === "error") {
      return NextResponse.json(
        { error: result.message || "Failed to fetch user posts" },
        { status: 500 }
      );
    }

    // Format the response for the frontend
    const posts = (result.result || []).map((post: any) => ({
      id: post.id,
      desc: post.desc,
      createTime: post.createTime,
      stats: {
        collectCount: post.stats?.collectCount || 0,
        commentCount: post.stats?.commentCount || 0,
        likeCount: post.stats?.likeCount || 0,
        playCount: post.stats?.playCount || 0,
        shareCount: post.stats?.shareCount || 0,
      },
      author: {
        id: post.author?.id || "",
        username: post.author?.username || username,
        nickname: post.author?.nickname || "",
        avatarLarger: post.author?.avatarLarger || "",
        avatarThumb: post.author?.avatarThumb || "",
        avatarMedium: post.author?.avatarMedium || "",
        signature: post.author?.signature || "",
        verified: post.author?.verified || false,
        openFavorite: post.author?.openFavorite || false,
        privateAccount: post.author?.privateAccount || false,
        isADVirtual: post.author?.isADVirtual || false,
        isEmbedBanned: post.author?.isEmbedBanned || false,
      },
      video: post.video
        ? {
            id: post.video.id,
            duration: post.video.duration,
            ratio: post.video.ratio,
            cover: post.video.cover,
            originCover: post.video.originCover,
            dynamicCover: post.video.dynamicCover,
            playAddr: post.video.playAddr,
            downloadAddr: post.video.downloadAddr,
            format: post.video.format,
            bitrate: post.video.bitrate,
          }
        : null,
      music: post.music
        ? {
            authorName: post.music.authorName,
            coverLarge: post.music.coverLarge,
            coverMedium: post.music.coverMedium,
            coverThumb: post.music.coverThumb,
            duration: post.music.duration,
            id: post.music.id,
            title: post.music.title,
            playUrl: post.music.playUrl,
            original: post.music.original,
          }
        : null,
      images: post.images || [],
      url: `https://www.tiktok.com/@${username}/video/${post.id}`,
    }));

    return NextResponse.json({
      success: true,
      posts,
      totalPosts: result.totalPosts || posts.length,
      message: "User posts fetched successfully",
    });
  } catch (error) {
    console.error("Get user posts error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch user posts",
        success: false,
      },
      { status: 500 }
    );
  }
}
