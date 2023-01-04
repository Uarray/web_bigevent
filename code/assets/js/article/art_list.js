$(function () {
    const layer = layui.layer
    const form = layui.form
    const laypage = layui.laypage
    // 需要定义一个查询对象，将来请求数据的时候
    // 需要将请求参数对象提交到服务器
    const q = {
        pagenum: 1,//页码值，默认请求第一页的数据
        pagesize: 2,//每页显示几条数据
        cate_id: '',//文章分类的id
        state: ''//文章的发布状态
    }
    initTable()
    initCate()
    initEditor()
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            methods: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                // console.log(res);
                // 使用模板引擎渲染数据
                const htmlstr = template('tpl-table', res)
                // console.log(htmlstr);
                $('tbody').html(htmlstr)
                //调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0)
                    return layer.msg('获取分类数据失败')
                const htmlstr = template('tpl-cates', res)

                $('[name=cate_id]').html(htmlstr)
                // 通知layui重新渲染表单区域的UI结构
                form.render()
            }
        })
    }

    // 筛选模块
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单中选中项的值
        const cate_id = $('[name=cate_id]').val()
        const state = $('[name=state]').val()
        //为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 重新调用initTable函数
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用laypage.render()方法渲染结构
        laypage.render({
            elem: 'pageBox', //分页容器的id
            count: total,//总数据条数  total
            limit: q.pagesize,//每页显示几条数据 q.pagesize
            curr: q.pagenum,//设置默认选中第几页  q.pagenum


            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],

            // 分页发生切换的时候触发junp回调
            // 触发jump回调的方式有两种
            // 1.点击页码的时候，会触发jump回调
            // 2.只要调用了laypage.render()方法，就会触发jump回调
            // 如果通过第二种方式触发，first的值为true  第一种是undefind
            jump: function (obj, first) {
                // 拿到最新的页码值
                // console.log(obj.curr);
                // 把最新的页码值赋值到数据对象中
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }

            }
        })
    }

    // 通过代理的方式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function (e) {
        let len = $('.btn-delete').length
        e.preventDefault()
        // 获取文章的id
        const id = $(this).attr('data-id')
        // 询问用户是否删除消息
        layer.confirm('确认删除此文章?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0)
                        return layer.msg('删除文章失败')
                    layer.msg('删除文章成功')
                    // 判断当前页面是否还有剩余数据，如果没有则让页码值-1
                    // 再重新调用initTable()
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }

                    initTable()
                }
            })

            layer.close(index);
        });
    })



    // 通过代理的方式，为编辑按钮绑定点击事件
    $('tbody').on('click', '.btn-edit', function (e) {
        e.preventDefault()
        // 初始化富文本编辑器

        const id = $(this).attr('data-id')
        indexEdit = layer.open({
            // 指定1，去除确定按钮
            type: 1,
            // 指定弹出层的宽高
            area: ['800px', '100%'],
            title: '修改文章'
            , content: $('#dialog-edit').html()

        });
        initCate()
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
        // 初始化富文本编辑器
        initEditor()
        // 1. 初始化图片裁剪器
        var $image = $('#image')

        // 2. 裁剪选项
        var options = {
            aspectRatio: 400 / 280,
            preview: '.img-preview'
        }

        // 3. 初始化裁剪区域
        $image.cropper(options)


        // 获取文章信息
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function (res) {
                if (res.status !== 0)
                    return layer.msg('获取文章信息失败')
                // 给表单赋值
                // console.log(res);

                form.val("form-pub", res.data)

                $('#content').html(res.data.content)
                $image
                    .cropper('destroy')      // 销毁旧的裁剪区域
                    .attr('src', 'http://api-breakingnews-web.itheima.net' + res.data.cover_img)  // 重新设置图片路径
                    .cropper(options)
            }
        })
        // 修改文章信息
        // 定义文章的发布状态
        let art_state = '已发布'
        $('#btnSave2').on('click', function () {
            art_state = '草稿'
        })
        // 为表单绑定点击事件
        $('#form-pub').on('submit', function (e) {
            e.preventDefault()
            // console.log(11);
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
                    editArticle(fd)
                    // console.log(fd);
                    // fd.forEach(function (k, v) {
                    //     console.log(k, v);
                    // })
                })

        })
        // 更新文章的方法
        function editArticle(fd) {
            $.ajax({
                method: 'POST',
                url: '/my/article/edit',
                data: fd,
                // 如果想服务器提交的是FormData()格式的数据  需要添加两个配置项
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.status !== 0)
                        return layer.msg('更新文章失败')
                    layer.msg('更新文章成功')
                    location.href = '/code/article/art_list.html'
                }
            })

        }





    })

})
