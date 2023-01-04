$(function () {
    initArticleList()
    // 获取文章的分类列表
    function initArticleList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                const htmlStr = template('tpl-table', res)
                console.log(res);
                $('tbody').html(htmlStr)
            }
        })
    }
    // 为添加类别按钮绑定点击事件
    const layer = layui.layer
    const form = layui.form
    // 定义弹出层返回值
    let indexAdd = null
    $('#btnAddCate').on('click', function (e) {
        e.preventDefault()
        indexAdd = layer.open({
            // 指定1，去除确定按钮
            type: 1,
            // 指定弹出层的宽高
            area: ['500px', '250px'],
            title: '添加文章分类'
            , content: $('#dialog-add').html()

        });
    })

    // 通过代理的形式为form-add按钮绑定点击事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0)
                    return layer.msg('新增分类失败：' + res.message)
                initArticleList()
                layer.msg('新增分类成功！')
                layer.close(indexAdd)
            }
        })
    })

    // 通过代理的方式为btn-deit绑定点击事件
    let indexEdit = null
    $('tbody').on('click', '.btn-edit', function (e) {
        e.preventDefault()
        indexEdit = layer.open({
            // 指定1，去除确定按钮
            type: 1,
            // 指定弹出层的宽高
            area: ['500px', '250px'],
            title: '修改文章分类'
            , content: $('#dialog-edit').html()

        });
        const id = $(this).attr('data-id')
        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                if (res.status !== 0)
                    return layer.msg('获取当前分类信息失败')
                console.log(res);
                form.val('form-edit', res.data)
            }
        })

    })

    // 通过代理的形式，为修改分类的表单绑定点击事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {

                if (res.status !== 0)
                    return layer.msg('修改分类信息失败:' + res.message)
                console.log(res);
                initArticleList()
                layer.msg('修改分类信息成功')
                layer.close(indexEdit)
            }

        })
    })
    let dialogDel = null
    $('tbody').on('click', '.btn-delete', function (e) {
        e.preventDefault()
        const id = $(this).attr('data-id')
        layer.confirm('确认删除此分类信息?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0)
                        return layer.msg('删除分类信息失败' + res.message)
                    layer.msg('删除分类信息成功')
                    layer.close(index);
                    initArticleList()
                }
            })


        });
    })
})