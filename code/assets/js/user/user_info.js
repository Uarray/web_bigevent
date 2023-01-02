const form = layui.form
const layer = layui.layer
$(function () {

    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return layer.msg('用互昵称必学在1-6个字符之间')
            }
        }
    })
    initUserInfo()
    // 重置表单的数据
    $('#btnReset').on('click', function (e) {
        e.preventDefault()
        initUserInfo()
    })

    // 提交修改
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0)
                    return layer.msg('更新用户信息失败')
                layer.msg('更新用户信息成功')
                // 在子页面中调用父页面的函数
                window.parent.getUserInfo()
            }
        })
    })

    // 调用父页面中的方法重新渲染用户的头像信息
})

// 初始化用户的基本信息
function initUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0)
                return layer.msg('获取用户信息失败！')
            // 调用form.val()快速为表单赋值
            form.val('formUserInfo', res.data)
        }
    })
}


