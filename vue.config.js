module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api':{
                target:'https://morty.xiaomy.net',
                // target:'http://175.24.203.112:3333',
                changeOrigin:true,
                // pathRewrite:{
                //     '/api':''
                // }
            }
        }
    }
}