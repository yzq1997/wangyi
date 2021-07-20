<template>
    <div class="box">
        <a-button type="primary" @click="addData">新增</a-button>

        <tables class="tableBox" size="small" :columns="columns" :tableData="tableData" :loading="false" :handleTableChange="handleTableChange" :bordered="true" :pagination="paginations" :option="option"></tables>
    
        <a-modal width="600px" :title="title" :maskClosable="false" v-model="editVisible"  footer="" cancelText="关闭">
            <div class="detailBox">
                <div class="RequiredBox">
                    <span class="Required">*</span>
                    <span class="title">来源</span>
                    <a-input onkeyup="this.value=this.value.replace(/^ +| +$/g,'')" class="inputName" v-model='sourceInput' placeholder="请输入来源" />
                </div>
                <!-- <div class="RequiredBox">
                    <span class="Required">*</span>
                    <span class="title">ID</span>
                    <a-input onkeyup="this.value=this.value.replace(/^ +| +$/g,'')" class="inputName" v-model='idInput' placeholder="请输入ID" />
                </div>
                <div class="RequiredBox">
                    <span class="Required">*</span>
                    <span class="title">密钥</span>
                    <a-input onkeyup="this.value=this.value.replace(/^ +| +$/g,'')" class="inputNum" v-model='keyInput' placeholder="请输入密钥" />
                </div> -->
                <div class="RequiredBox">
                    <span class="Required">*</span>
                    <span class="title">上传地址</span>
                    <a-input onkeyup="this.value=this.value.replace(/^ +| +$/g,'')" class="inputNum" v-model='addressInput' placeholder="请输入上传地址" />
                </div>
                <div class="RequiredBox">
                    <span class="Required">*</span>
                    <span class="title">删除投诉地址</span>
                    <a-input onkeyup="this.value=this.value.replace(/^ +| +$/g,'')" class="inputNum" v-model='delInput' placeholder="请输入删除地址" />
                </div>
            </div>
            <div class="btnBox">
                <a-button @click="cenBtn">取消</a-button>
                <a-button type="primary" class="showBtn" @click="finBtn">确定</a-button>
            </div>
		</a-modal>

        <a-modal width="900px" title="操作日志" :maskClosable="false" v-model="editVisibleT"  footer="" cancelText="关闭">
            <div>
                <span>日期：</span>
                <a-range-picker @change="onChange" />
                <a-button type="primary" class="showBtn" @click="queryBtn">查询</a-button>
            </div>
            <tables class="tableBox" size="small" :columns="columnsT" :tableData="tableDataT" :loading="false" :handleTableChange="handleTableChangeT" :bordered="true" :pagination="paginationsT"></tables>
		</a-modal>
    </div>
</template>

<script>
    import tables from '@/pages/common/table';
    export default {
        components:{
            tables
        },
        data (){
            return {
                columns:[],
                columnsT:[],
                paginations: {
                    current:1,
                    pageSize:10,
                    total:0,
                    size:'middle',
                    showQuickJumper:true,
                    showSizeChanger:false,
                    onShowSizeChange:function(){},
                    showTotal:function(total,range){
                        return  `共 ${total} 条记录`;
                    }
                },
                paginationsT: {
                    current:1,
                    pageSize:10,
                    total:0,
                    size:'middle',
                    showQuickJumper:true,
                    showSizeChanger:false,
                    onShowSizeChange:function(){},
                    showTotal:function(total,range){
                        return  `共 ${total} 条记录`;
                    }
                },
                option:[
                    {
                        type:"detail",
                        name:"修改",
                        fn:(e)=>{
                            this.modify(e);
                        }
                    },
                    // {
                    //     type:"detail",
                    //     name:"操作日志",
                    //     fn:(e)=>{
                    //         this.operation(e);
                    //     }
                    // },
                    // {
                    //     type:"detail",
                    //     name:"删除",
                    //     fn:(e)=>{
                    //         this.delete(e);
                    //     }
                    // }
                ],
                tableData: [], //数据
                tableDataT: [], //数据
                editVisible:false,  //新增弹框
                editVisibleT:false,  //操作日志弹框
                sourceInput:'',  //来源
                idInput:'',  //ID
                keyInput:'',  //密钥
                addressInput:'',  //上传地址
                delInput:'',  //删除投诉地址
                dataStart:'',  //开始日期
                dataEnd:'',  //结束日期
                title:'',
                id:'',  //来源ID
            }
        },
        methods:{
            //获取数据
            getData(pageNo){
                let that = this;
                this.$dataApi({
                    url:'api/AppInfo/GetList',
                    method:'POST',
                    data:{
                        maxResultCount:10,
                        skipCount: pageNo
                    }
                }).then(res=>{
                    console.log(res);
                    if(res.success){
                        that.paginations.total  = res.result.totalCount;
                        that.tableData = res.result.items;
                    }
                })
            },

            //获取数据
            getDataT(pageNo){
                let that = this;
                this.$dataApi({
                    url:'api/Users/GetAdminUsers',
                    method:'POST',
                    data:{
                        pageNo:pageNo,
                        pageSize: 10
                    }
                }).then(res=>{
                    console.log(res);
                    if(res.Status == 200){
                        that.paginationsT.total  = res;
                        that.tableDataT = res;
                    }
                })
            },

            // table改变
            handleTableChange(pagination,filter,sorter){
                let that = this;
                const pager = Object.assign(this.paginations);
                pager.current = pagination.current;
                this.paginations = pager;
                this.getData(pager.current);
            },

            // table改变
            handleTableChangeT(pagination,filter,sorter){
                let that = this;
                const pager = Object.assign(this.paginations);
                pager.current = pagination.current;
                this.paginationsT = pager;
                this.getDataT(pager.current);
            },

            //日期
            onChange(date, dateString) {
                console.log(date, dateString);
                this.dataStart = dateString[0];
                this.dataEnd = dateString[1];
                console.log(this.dataStart);
                console.log(this.dataEnd);
            },

            //修改
            modify(e){
                console.log(e);
                this.title = '修改';
                this.sourceInput = e.title;
                this.addressInput = e.pushUrl;
                this.delInput = e.delUrl;
                this.id = e.id;
                this.editVisible = true;
            },

            //操作日志
            operation(e){
                console.log(e);
                this.editVisibleT = true;
                this.getDataT(1)
            },

            //删除
            delete(e){
                console.log(e);
            },

            //新增
            addData(){
                this.title = '新增';
                this.sourceInput = '';
                this.addressInput = '';
                this.editVisible = true;
            },

            //取消按钮
            cenBtn(){
                this.editVisible = false;
            },

            //确定按钮
            finBtn(){
                let that = this;
                // console.log(this.sourceInput);
                // console.log(this.idInput);
                // console.log(this.keyInput);
                // console.log(this.addressInput);
                
                if(this.sourceInput == '' ){
                    this.$message.warning('请将信息填写完整');
                }else{
                    // console.log(this.title);
                    // return
                    if(this.title == '新增'){
                        this.$dataApi({
                            url:'api/AppInfo/Create',
                            method:'POST',
                            data:{
                                title:that.sourceInput,
                                pushUrl:that.addressInput,
                                isActive:true,
                                delUrl:that.delInput
                            }
                        }).then(res=>{
                            console.log(res);
                            if(res.success){
                                that.$message.success('新增成功');
                                that.getData(1);
                                that.editVisible = false;
                            }else{
                                that.$message.error(res.error.message);
                            }
                        })
                    }else{
                        this.$dataApi({
                            url:'api/AppInfo/Update',
                            method:'POST',
                            data:{
                                id:that.id,
                                title:that.sourceInput,
                                pushUrl:that.addressInput,
                                isActive:true,
                                delUrl:that.delInput
                            }
                        }).then(res=>{
                            console.log(res);
                            if(res.success){
                                that.$message.success('修改成功');
                                that.getData(1);
                                that.editVisible = false;
                            }else{
                                that.$message.error(res.error.message);
                            }
                        })
                    }

                    
                }
            },

            //查询
            queryBtn(){
                console.log(1);
            }
        },
        created(){
            this.getData(1);  //获取数据
            this.columns = [
                {
                    title: '来源',
                    dataIndex: 'title',
                },
                {
                    title: 'ID',
                    dataIndex: 'appId',
                },
                {
                    title: '密钥',
                    dataIndex: 'appSecret',
                },
                {
                    title: '上传地址',
                    dataIndex: 'pushUrl',
                },
                {
                    title: '删除投诉地址',
                    dataIndex: 'delUrl',
                },
                {
                    title: '操作',
                    dataIndex: 'option',
                    scopedSlots: { customRender: 'option' },
                    width:'15%',
                }
            ];
            this.columnsT = [
                {
                    title: '日期',
                    dataIndex: 'sex',
                },
                {
                    title: '来源',
                    dataIndex: 'nickname',
                },
                {
                    title: '接入地址',
                    dataIndex: 'UserOrigin',
                },
            ];
        },
    }
</script>

<style lang="scss" scoped>
    .box{
        padding: 10px 0 0 10px;
        background: #fff;
    }
    .tableBox{
        margin-top: 20px;
    }
    .btnBox{
        margin-top: 40px;
        display: flex;
        justify-content: flex-end;
    }
    .showBtn{
        margin-left: 20px;
    }
    .RequiredBox{
        display: flex;
        align-items: center;
        margin-top: 20px;
    }
    .Required{
        color: red;
    }
    .title{
        width: 20%;
    }
    .inputName,.inputNum{
        width: 70%;
    }
</style>