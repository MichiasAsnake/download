"use client";

import { useState } from "react";

interface UserPostsProps {
  onGetUserPosts: (username: string, postLimit: number) => Promise<void>;
  isLoading: boolean;
  error: string;
  posts: any[];
  totalPosts: number;
}

export default function UserPosts({
  onGetUserPosts,
  isLoading,
  error,
  posts,
  totalPosts,
}: UserPostsProps) {
  const [username, setUsername] = useState("");
  const [postLimit, setPostLimit] = useState(30);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    await onGetUserPosts(username.trim(), postLimit);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleDownloadVideo = async (post: any) => {
    if (!post.video?.downloadAddr) {
      alert("No download URL available for this video");
      return;
    }

    try {
      const response = await fetch("/api/proxy-download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: post.video.downloadAddr,
          filename: `tiktok_${post.author.username}_${post.id}.mp4`,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `tiktok_${post.author.username}_${post.id}.mp4`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert("Failed to download video");
      }
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download video");
    }
  };

  const handleDownloadMusic = async (post: any) => {
    if (!post.music?.playUrl) {
      alert("No music URL available for this post");
      return;
    }

    try {
      const response = await fetch("/api/proxy-download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: post.music.playUrl,
          filename: `tiktok_music_${post.music.authorName}_${post.music.title}.mp3`,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `tiktok_music_${post.music.authorName}_${post.music.title}.mp3`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert("Failed to download music");
      }
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download music");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Username Input */}
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            TikTok Username
          </label>
          <div className="relative">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter TikTok username (e.g., charlidamelio)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Post Limit Input */}
        <div>
          <label
            htmlFor="postLimit"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Number of Posts (1-50)
          </label>
          <input
            type="number"
            id="postLimit"
            min="1"
            max="50"
            value={postLimit}
            onChange={(e) =>
              setPostLimit(
                Math.min(50, Math.max(1, parseInt(e.target.value) || 30))
              )
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Get Posts Button */}
        <button
          type="submit"
          disabled={!username.trim() || isLoading}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-pink-700 focus:ring-4 focus:ring-purple-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Fetching Posts...</span>
            </>
          ) : (
            <>
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <span>Get User Posts</span>
            </>
          )}
        </button>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <svg
                className="h-5 w-5 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Results */}
        {posts.length > 0 && (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Posts by @{posts[0]?.author?.username || username}
              </h2>
              <span className="text-sm text-gray-600">
                {posts.length} of {totalPosts} posts
              </span>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                >
                  {/* Video Cover */}
                  {post.video?.cover && (
                    <div className="relative">
                      <img
                        src={post.video.cover}
                        alt="Video thumbnail"
                        className="w-full h-48 object-cover"
                      />
                      {post.video.duration && (
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                          {formatDuration(post.video.duration)}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Post Content */}
                  <div className="p-4">
                    <p className="text-sm text-gray-900 line-clamp-3 mb-3">
                      {post.desc}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <div className="flex items-center space-x-3">
                        <span>❤️ {formatNumber(post.stats.likeCount)}</span>
                        <span>💬 {formatNumber(post.stats.commentCount)}</span>
                        <span>👁️ {formatNumber(post.stats.playCount)}</span>
                      </div>
                      <span>{formatDate(post.createTime)}</span>
                    </div>

                    {/* Music Info */}
                    {post.music && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <div className="flex items-center space-x-2">
                          <svg
                            className="w-4 h-4 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                            />
                          </svg>
                          <span className="text-xs font-medium text-gray-700">
                            {post.music.title}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          by {post.music.authorName}
                        </p>
                      </div>
                    )}

                    {/* Download Buttons */}
                    <div className="flex space-x-2">
                      {post.video?.downloadAddr && (
                        <button
                          onClick={() => handleDownloadVideo(post)}
                          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-medium py-2 px-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-1"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <span>Video</span>
                        </button>
                      )}
                      {post.music?.playUrl && (
                        <button
                          onClick={() => handleDownloadMusic(post)}
                          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-medium py-2 px-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center space-x-1"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                            />
                          </svg>
                          <span>Music</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
