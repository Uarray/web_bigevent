// 每次调用$.get或者$.post或者$.ajax的时候，会先调用ajaxPrefilter这个函数
// 在这个函数中，可以拿到我们给ajax的配置对象

$.ajaxPrefilter(function (options) {
    // 在发起真正的ajax请求之前，统一拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
    // 统一为有权限的借口，配置请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    // 全局统一挂载complete函数
    options.complete = function (res) {
        // console.log(res);
        // 在complete回调函数中，可以用res.responseJSON拿到服务器响应的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 强制清空token
            localStorage.removeItem('token')
            // 强制跳转到登录页面
            location.href = '/code/login.html'

        }
    }

})