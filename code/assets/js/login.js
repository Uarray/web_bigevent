$(function () {
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.register-box').show()
    })
    $('#link_login').on('click', function () {
        $('.register-box').hide()
        $('.login-box').show()
    })

    // 自定义校验规则
    // 从layui中获取form对象
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
        // 校验两次密码是否一致
        repwd: function (value) {
            // 通过形参拿到的是确认密码框的值
            // 还需要拿到密码框的值
            // 然后进行判断
            const pwd = $('.register-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    })

    // 调用接口实现注册 监听注册表单的提交事件
    $('#form-reg').on('submit', function (e) {
        e.preventDefault()
        $.post('/api/reguser', { username: $('#form-reg [name=username]').val(), password: $('#form-reg [name=password]').val() }, function (res) {
            if (res.status !== 0) {
                // 使用layer提示注册信息
                return layer.msg(res.message)
            }
            layer.msg('注册成功')
            $('#link_login').click()
        })
    })

    // 调用接口实现登录 监听登录事件
    $('#form-login').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/api/login',
            //快速获取表单中的数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0)
                    return layer.msg('登录失败')
                layer.msg('登录成功')
                // 将登录成功的res.token值存到本地存储
                localStorage.setItem('token', res.token)
                location.href = '/code/index.html'
            }

        })
    })
})