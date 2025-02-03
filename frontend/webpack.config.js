module.exports = {
    resolve: {
      fallback: {
        "fs": false, // `fs` モジュールを無効化
        "path": require.resolve("path-browserify"), // `path` モジュールのポリフィル
        "os": require.resolve("os-browserify/browser"), // `os` モジュールのポリフィル
      }
    }
  };
  