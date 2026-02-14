self.__BUILD_MANIFEST = {
  "__rewrites": {
    "afterFiles": [
      {
        "source": "/uploads/:path*",
        "destination": "/api/uploads/:path*"
      }
    ],
    "beforeFiles": [],
    "fallback": []
  },
  "sortedPages": [
    "/_app",
    "/_error"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()