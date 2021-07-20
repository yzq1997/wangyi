<template>
    <div class="box">
        <div class="queryBox">
            <span>用户名:</span>
            <a-input onkeyup="this.value=this.value.replace(/^ +| +$/g,'')" v-model="userNameQuery" class="queryName" placeholder="请输入用户名" />
            <a-button type="primary" @click="query">查询</a-button>
        </div>

        <!-- <a-button class="addNew" type="primary" @click="addNew">新增</a-button> -->

        <tables class="table" size="small" :columns="columns" :tableData="tableData" :loading="false" :handleTableChange="handleTableChange" :bordered="true" :pagination="paginations" :option="option"></tables>

        <a-modal width="600px" :title="title" :maskClosable="false" v-model="editVisible"  footer="" cancelText="关闭">
            <div class="detailBox">
                <div class="RequiredBox">
                    <span class="Required">*</span>
                    <span class="title">旧密码</span>
                    <a-input-password onkeyup="this.passWordOld=this.passWordOld.replace(/^ +| +$/g,'')" class="inputName" v-model='passWordOld' placeholder="请输入旧密码" />
                </div>
                <div class="RequiredBox">
                    <span class="Required">*</span>
                    <span class="title">新密码</span>
                    <a-input-password onkeyup="this.value=this.value.replace(/^ +| +$/g,'')" class="inputName" v-model='passWord' placeholder="请输入新密码" />
                </div>
                <p class="pStart">用户初始密码为<span class="Required">123qwe</span></p>
            </div>
            <div class="btnBox">
                <a-button @click="cenBtn">取消</a-button>
                <a-button type="primary" class="showBtn" @click="finBtn">确定</a-button>
            </div>
		</a-modal>

        <!-- <a-modal v-model="deleteBox" title="删除" @ok="handleOk">
            <p>您确定删除此用户么?</p>
        </a-modal> -->

        <!-- <a-modal v-model="ResetBox" title="密码重置" @ok="handleOkO">
            <p>您确定重置密码么?</p>
        </a-modal> -->
    </div>
</template>

<script>
    import tables from '@/pages/common/table';
    export default {
        components:{
            tables
        },
        data(){
            return {
                columns:[],
                tableData: [],
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
                option:[
                    {
                        type:"detail",
                        name:"编辑",
                        fn:(e)=>{
                            this.edit(e);
                        }
                    },
                    // {
                    //     type:"detail",
                    //     name:"删除",
                    //     fn:(e)=>{
                    //         this.delete(e);
                    //     }
                    // },
                    // {
                    //     type:"detail",
                    //     name:"密码重置",
                    //     fn:(e)=>{
                    //         this.ResetPass(e);
                    //     }
                    // },
                ],
                userNameQuery:'',  //查询用户名
                editVisible:false,  //弹框
                passWordOld:'',  //旧密码
                passWord:'',  //新密码
                title:'',
                deleteBox:false,
                ResetBox:false,
                userData:{},
            }
        },
        methods:{
            //获取数据
            getData(e){
                let that = this;
                this.$dataApi({
                    url:'api/User/GetList',
                    method:'POST',
                    data:{
                        maxResultCount:10,
                        skipCount:e,
                        userName:that.userNameQuery
                    }
                }).then(res=>{
                    console.log(res);
                    if(res.success){
                        that.paginations.total  = res.result.totalCount;
                        that.tableData = res.result.items;
                    }
                })
            },

            //查询用户
            query(){
                // console.log(this.userNameQuery);
                this.getData(1)
            },
            
            // table改变
            handleTableChange(pagination,filter,sorter){
                let that = this;
                const pager = Object.assign(this.paginations);
                pager.current = pagination.current;
                this.paginations = pager;
                // this.params['pageNo'] = this.paginations['current'];
                // // 排序
                // this.params['sortField'] = sorter['columnKey'] || "";
                // this.params['sortOrder'] = sorter['order'] ? sorter['order'] == "ascend" ? '0' : '1' : "";
                this.getData(pager.current);
            },

            //编辑
            edit(e){
                console.log(e);
                this.userData = e;
                this.title = '编辑';
                this.editVisible = true;
            },

            //删除
            delete(e){
                console.log(e);
                this.deleteBox = true;
            },

            //重置密码
            ResetPass(e){
                console.log(e);
                this.userData = e;
                this.ResetBox = true;
            },

            //新增
            addNew(){
                this.title = '新增';
                this.editVisible = true;

            },

            //取消
            cenBtn(){
                this.editVisible = false;
            },

            //按钮
            finBtn(){
                // console.log(1);
                let that = this;
                if(this.passWordOld == this.passWord){
                    this.$message.warning('新密码与旧密码相同，请重新输入');
                    
                }else{
                    this.$dataApi({
                        url:'api/User/Update',
                        method:'POST',
                        data:{
                            id:that.userData.id,
                            oldPwd:that.passWordOld,
                            newPwd:that.passWord
                        }
                    }).then(res=>{
                        console.log(res);
                        if(res.success){
                            this.$message.success('修改成功');
                            that.passWordOld = '';
                            that.passWord = '';
                            this.editVisible = false;
                        }
                    })
                }
                
                
            },

            //确定重置
            // handleOkO(){
            //     let that = this;
            //     console.log(1);
            //     this.$dataApi({
            //         url:'api/User/Update',
            //         method:'POST',
            //         data:{
            //             id:that.userData.id,
            //             oldPwd:that.passWordOld,
            //             newPwd:that.passWord
            //         }
            //     }).then(res=>{
            //         console.log(res);
            //         if(res.success){
            //             this.$message.success('修改成功');
            //             that.passWordOld = '';
            //             that.passWord = '';
            //             this.editVisible = false;
            //         }
            //     })
            // },
        },
        created(){
            this.getData(1);  //获取数据
            this.columns = [
                {
                    title: '登录名',
                    dataIndex: 'userName',
                },
                // {
                //     title: '用户名',
                //     dataIndex: 'nickname',
                // },
                {
                    title: '时间',
                    dataIndex: 'creationTime',
                    customRender: text => {
                        return text.substring(0,10);
                    }
                },
                {
                    title: '操作',
                    dataIndex: 'option',
                    scopedSlots: { customRender: 'option' },
                    width:'20%',
                }
            ];
        }
    }
</script>

<style lang="scss" scoped>
    .box{
        background: #fff;
        padding: 10px;
    }
    .queryBox{
        display: flex;
        align-items: center;
    }
    .queryName{
        width: 300px;
        margin: 0 30px 0 5px;
    }
    .addNew{
        margin-top: 20px;
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
    .btnBox{
        margin-top: 40px;
        display: flex;
        justify-content: flex-end;
    }
    .showBtn{
        margin-left: 20px;
    }
    .inputName,.inputNum{
        width: 70%;
    }
    .table{
        margin-top: 20px;
    }
    .pStart{
        text-align: center;
        margin-top: 10px;
    }
</style>