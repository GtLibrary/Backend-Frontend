module.exports = function override (config, env) {
    console.log('override')
    let loaders = config.resolve
    loaders.fallback = {
        "fs": false,
        "tls": false,
        "net": false,
        "http": false,
        "https": false,
        "zlib": false ,
        "path": false,
        "stream": false,
        "util": false,
        "crypto": false,
        "url": false,
        "assert": false,
        "buffer": false,
        "os": false
        // "http": require.resolve("stream-http"),
        // "zlib": require.resolve("browserify-zlib") ,
        // "path": require.resolve("path-browserify"),
        // "stream": require.resolve("stream-browserify"),
        // "util": require.resolve("util/"),
        // "crypto": require.resolve("crypto-browserify")
    }
    
    return config
}