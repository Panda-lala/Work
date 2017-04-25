/**
 * Created by zhaoxue on 16/4/19.
 */
$(function () {
    api_supplier_list(0);
    $('#btnSearch').click(function () {
        api_supplier_list();
    })
});

function api_supplier_list() {
    var organization_code = $.trim($('input[name="organization_code"]').val());
    var audit_status = $("#audit_status option:selected").val();
    $.ajax({
        url: "js/tsconfig.json",
        type: "post",
        data: {
            organization_code: organization_code,
            audit_status: audit_status
        },
        dataType: "json",
        success: function (rs) {
            rs = JSON.stringify(rs);
            rs = rs.replace(/</g, "<").replace(/>/g, ">");
            rs = JSON.parse(rs);
            if (rs.code == 1000) {
                var pageSize = rs.data.page_size; //每页出现的数量
                var totalCount = rs.data.total_records; //数据总条数
                var totalPage = Math.ceil(totalCount / pageSize); //得到总页数
                var data_length = rs.data.data_list.length;
                function appendData(data) {
                    var str = "";
                    str += '<tr';
                    str += '<th></th>';
                    str += '<th>合作单位</th>';
                    str += '<th>分供方状态</th>';
                    str += '<th>分供方分类</th>';
                    str += '<th>供方评级</th>';
                    str += (audit_status == -1 || audit_status == 40 || audit_status == '0' || audit_status == '') ? '<th>操作</th>' : '';
                    //str += '<th>操作</th>';
                    str += '<th>审核备注</th>';
                    str += '</tr>';
                    $.each(data, function (index, value) {
                        var status = value.audit_status;
                        var audit_memo = value.audit_memo;
                        str += '<tr';
                        str += '<td data-label="0"></td>';
                        str += '<td data-label="0">' + value.organization_name + '</td>';
                        str += '<td data-label="0">' + value.audit_status_text + '</td>';
                        str += '<td data-label="0">' + value.supplier_category_name + '</td>';
                        //str += (value.pingji == "") ? '<td>待评级</td>' : '<td>' + value.pingji + '</td>';
                        str += '<td data-label="0"></td>';
                        str += (status == -1 || status == 40 || status == '0') ?
                        '<td data-label="0"><a href="index.php?act=tender_fengong&op=fengong_detail&request_id=' + value.request_id +
                        '" class="ncbtn ncbtn-aquaBlue">修改资料</a></td>' : '<td></td>';
                        str += '<td data-label="0">'+isNull(value.audit_memo)+'</td>';
                        str += '</tr>';
                    });
                    $("#biuuu_city_list").empty().append(str);
                }
                appendData(rs.data.data_list);
                laypage({
                    cont: "biuuu_city",
                    pages: totalPage,
                    skip: true,
                    skin: "molv",
                    groups: 2,
                    first: "首页",
                    last: "尾页",
                    prev: "<",
                    next: ">",
                    jump: function (e, first) {
                        $(".laypage_skip").val(1);
                        $(".laypage_skip").blur(function () {
                            if ($(this).val() == 0) {
                                $(this).val(1)
                            }
                        });
                        if (!first) {
                            $(".laypage_skip").val(e.curr);
                            $.ajax({
                                async: false,
                                type: "post",
                                url: "js/tsconfig.json",
                                data: {
                                    PageIndex: e.curr,
                                    organization_code: organization_code,
                                    audit_status: audit_status
                                },
                                dataType: "json",
                                success: function (data) {
                                    data = JSON.stringify(data);
                                    data = data.replace(/</g, "<").replace(/>/g, ">");
                                    data = JSON.parse(data);
                                    appendData(data.data.data_list);
                                }
                            })
                        }
                    }
                })
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(errorThrown)
        },
        dataType: 'json'
    });
}

function isNull(data){
    return (data == "" || data == undefined || data == null) ? "<td></td>" : data;
}
