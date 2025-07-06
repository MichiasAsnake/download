"use client";

import { useState } from "react";
import DownloadForm from "@/components/DownloadForm";
import UserPosts from "@/components/UserPosts";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"download" | "posts">("download");

  // Download state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadUrls, setDownloadUrls] = useState<any>(null);
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const [debug, setDebug] = useState<any>(null);

  // User Posts state
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [postsError, setPostsError] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);

  const handleDownload = async (url: string) => {
    setIsLoading(true);
    setError("");
    setDownloadUrls(null);
    setVideoInfo(null);
    setDebug(null);

    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (data.success) {
        setDownloadUrls(data.downloadUrls);
        setVideoInfo(data.videoInfo);
        setDebug(data.debug);
      } else {
        setError(data.error || "Failed to download video");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Download error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetUserPosts = async (username: string, postLimit: number) => {
    setIsLoadingPosts(true);
    setPostsError("");
    setPosts([]);
    setTotalPosts(0);

    try {
      const response = await fetch("/api/get-user-posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, postLimit }),
      });

      const data = await response.json();

      if (data.success) {
        setPosts(data.posts);
        setTotalPosts(data.totalPosts);
      } else {
        setPostsError(data.error || "Failed to fetch user posts");
      }
    } catch (err) {
      setPostsError("Network error. Please try again.");
      console.error("Get user posts error:", err);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg
                className="w-7 h-7 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              TikTok Tools
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Download TikTok videos and explore user posts. Your all-in-one
            TikTok toolkit.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white rounded-xl p-1 shadow-lg">
            <div className="flex">
              <button
                onClick={() => setActiveTab("download")}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === "download"
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
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
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>Download Videos</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("posts")}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === "posts"
                    ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
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
                  <span>User Posts</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {activeTab === "download" ? (
            <DownloadForm
              onDownload={handleDownload}
              isLoading={isLoading}
              error={error}
              downloadUrls={downloadUrls}
              videoInfo={videoInfo}
              debug={debug}
            />
          ) : (
            <UserPosts
              onGetUserPosts={handleGetUserPosts}
              isLoading={isLoadingPosts}
              error={postsError}
              posts={posts}
              totalPosts={totalPosts}
            />
          )}
        </div>

        {/* Features */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            Why Choose Our TikTok Tools?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Lightning Fast
              </h3>
              <p className="text-gray-600">
                Download videos and fetch user posts instantly with our
                optimized servers.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Watermarks
              </h3>
              <p className="text-gray-600">
                Get clean, high-quality videos without any TikTok watermarks or
                branding.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                100% Secure
              </h3>
              <p className="text-gray-600">
                Your privacy is our priority. We don't store any videos or
                personal information.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500">
          <p>&copy; 2024 TikTok Tools. For educational purposes only.</p>
        </footer>
      </div>
    </div>
  );
}
