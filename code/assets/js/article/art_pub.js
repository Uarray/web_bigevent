$(function () {
    const layer = layui.layer
    const form = layui.form
    initCate()

    // 调用initEditor()方法，初始化富文本编辑器
    initEditor()

    // 实现基本的裁剪效果
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 定义加载文章分类的函数

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0)
                    return layer.msg('获取文章分类失败')
                const htmlstr = template('tpl-cates', res)
                // console.log(res);
                // console.log(htmlstr);
                $('#cate_id').html(htmlstr)
                form.render()
            }
        })
    }
    // 给选择文件按钮绑定点击事件
    $('#btnChooseFile').on('click', function (e) {
        e.preventDefault()
        $('#coverFile').click()
    })
    $('#coverFile').on('change', function (e) {
        const file = e.target.files
        if (file.length === 0)
            return layer.msg('请选择图片')
        const newImgURL = URL.createObjectURL(file[0])

        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })


    // 发布新文章

    // 定义文章的发布状态
    let art_state = '已发布'
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })
    // 为表单绑定点击事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        console.log(11);
        // 基于for表单快速创建一个for对象
        const fd = new FormData($(this)[0])
        // 将文章的发布状态添加到formdata对象中
        fd.append('state', art_state)

        // 将封面裁剪过后的图片输出为一个对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                // 发起ajax的数据请求
                publishArticle(fd)
            })

    })
    // 发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 如果想服务器提交的是FormData()格式的数据  需要添加两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0)
                    return layer.msg('发布新文章失败')
                layer.msg('发布文章成功')
                location.href = '/code/article/art_list.html'
            }
        })

    }
})