$(function () {
    // 调用函数获取用户信息
    getUserInfo()

    const layer = layui.layer
    // 点击按钮实现退出功能
    $('#btnLogout').on('click', function (e) {
        e.preventDefault()
        // console.log('ok');
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //清空本地存储的token  
            localStorage.removeItem('token')
            // 重新跳转到登录页
            location.href = '/code/login.html'
            layer.close(index);
        });
    })


})
// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // 请求头配置字段
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 调用renderAvator渲染用户头像
            return renderAvator(res.data)
        }
        // // 无论成功还是失败都会调用的函数
        // ,complete: function (res) {
        //     console.log(res);
        //     // 在complete回调函数中，可以用res.responseJSON拿到服务器响应的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 强制清空token
        //         localStorage.removeItem('token')
        //         // 强制跳转到登录页面
        //         location.href = '/code/login.html'

        //     }
        // }
    })
}

// 渲染用户的头像
function renderAvator(user) {
    // 渲染欢迎文本
    const name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)

    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avator').hide()
    } else {
        // 渲染文本头像
        $('.layui-nav-img').hide()
        // toUpperCase把字符转换为大写
        const first = name[0].toUpperCase()
        $('.text-avator').html(first).show()
    }
}