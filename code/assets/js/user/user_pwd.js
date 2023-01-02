$(function () {
    const form = layui.form
    // 从latui 中获取layer对象
    const layer = layui.layer
    // 通过form.verify()函数自定义校验规则
    form.verify({
        // 自定义了一个叫做pwd的校验规则
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        newpwd: function (value) {
            const pwd = $('.layui-form [name=oldPwd]').val()
            if (pwd === value)
                return '新密码不能和原密码相同'
        },
        // 校验两次密码是否一致
        repwd: function (value) {
            // 通过形参拿到的是确认密码框的值
            // 还需要拿到密码框的值
            // 然后进行判断
            const newpwd = $('.layui-form [name=newPwd]').val()
            if (newpwd !== value) {
                return '两次密码不一致！'
            }
        }
    })

    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        console.log(11);
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0)
                    return layer.msg('修改密码失败!:' + res.message)
                layer.msg('修改密码成功')
                window.parent.location.href = '/code/login.html'
            }
        })
        console.log(222);
    })
})