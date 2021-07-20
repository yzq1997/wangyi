<template>
    <div class="box">
        <div class="tabs">
            <button 
                class="btn" 
                v-for="(item,index) in sourceList" 
                :key="index" 
                @click="btnSou(item)"
                :class="sourceId == item.id ? 'btnT' : 'btn'"
            >
                {{item.title}}
            </button>
        </div>

        <tables class="table" size="small" :columns="columns" :tableData="tableData" :loading="false" :handleTableChange="handleTableChange" :bordered="true" :pagination="paginations" :option="option" ></tables>
    
        <a-modal width="500px" title="排序值：" :maskClosable="false" v-model="editVisible"  footer="" cancelText="关闭">
            <a-input placeholder="请输入排序值" v-model="sortNum" />
            <a-button type="primary" class="showBtn" @click="closeBox">确定</a-button>
		</a-modal>
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
                filterForm:this.$form.createForm(this,{name:'filter'}),
                widthFlag:{x:2000}, //表格宽度
                complaintNum:'',  //投诉单号
                title:'',  //标题
                SubmitTimeStart:'',  //提交时间开始
                SubmitTimeEnd:'',  //提交时间结束
                complaintName:'',  //投诉企业名称
                complaintState:'全部',  //投诉单状态
                complaintStateFin:'',  //投诉单状态
                params:{},
                SubmitFinTime:{},  //完成时间
                complaintInfo:'全部',  //投诉类型
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
                        name:"修改排序",
                        fn:(e)=>{
                            this.detail(e);
                        }
                    }
                ],
                editVisible:false,  //详情框
                sourceList:[],  //来源
                sourceId:1, //来源ID
                sortNum:0,//排序值
                sortId:0,//排序id

            }
        },
        methods:{

            btnSou(item){
                // console.log(item);
                this.sourceId = item.id;
                this.reset();
                this.getData(1);
            },

            //确定按钮
            closeBox(){
                let that = this;
                // console.log(that.sortNum);
                if(that.sortNum > 1){
                    this.$dataApi({
                        url:'api/ComplainManage/SetSort',
                        method:'POST',
                        data:{
                            id:that.sortId,
                            sort:that.sortNum
                        }
                    }).then(res=>{
                        console.log(res);
                        if(res.success){
                            that.$message.success('设置成功');
                            this.getData(1);
                        }else{
                            that.$message.warning('设置失败');
                        }
                    })
                    that.editVisible = false;
                }else{
                    that.$message.warning('排序值应大于0');
                };
            },

            //重置
            reset(){
                this.complaintNum = '';
                this.title = '';
                this.complaintName = '';
                this.complaintInfo = '全部';
                this.complaintState = '全部';
                this.SubmitTimeStart = '';
                this.SubmitTimeEnd = '';
                this.complaintStateFin = '';
                this.filterForm.resetFields();
            },

            //获取数据
            getData(e){
                let that = this;
                this.initParams(e);
                this.$dataApi({
                    url:'api/ComplainManage/GetComplainList',
                    method:'POST',
                    data:{
                        code:that.complaintNum,  //投诉单号
                        content:that.title,  //标题
                        comName:that.complaintName,  //企业名称
                        complainType:that.complaintInfo == '全部' ? '' : that.complaintInfo, //投诉类型
                        appInfoId:that.sourceId,  //客户ID
                        state:that.complaintStateFin,  //状态
                        starTime:that.SubmitTimeStart,
                        endTime:that.SubmitTimeEnd,
                        maxResultCount:10,  //条数
                        skipCount:e,  //页码
                        isShow:true
                    }
                }).then(res=>{
                    console.log(res);
                    if(res.success){
                        that.paginations.total  = res.result.totalCount;
                        that.tableData = res.result.items;
                    }
                })
            },

            // table改变
            handleTableChange(pagination,filter,sorter){
                let that = this;
                const pager = Object.assign(this.paginations);
                pager.current = pagination.current;
                this.paginations = pager;
                this.params['pageNo'] = this.paginations['current'];
                // 排序
                this.params['sortField'] = sorter['columnKey'] || "";
                this.params['sortOrder'] = sorter['order'] ? sorter['order'] == "ascend" ? '0' : '1' : "";
                this.getData(pager.current);
            },

            // 初始化参数
            initParams(e){
                Object.assign(this.params,this.filterForm.getFieldsValue())
                Object.assign(this.params,{pageNo:this.paginations.current,pageSize:this.paginations.pageSize})
                if(!e)
                {
                    this.paginations.current = 1;
                    this.paginations.pageNo = 1;
                    this.params.pageNo = 1;
                }
                this.COMMON.dropObj(this.params)
            },

            // 修改排序
            detail(e){
                console.log(e);
                this.sortId = e.id;
                this.sortNum = e.sort;
                this.editVisible = true;
                
            },

            //获取来源
            getList(){
                let that = this;
                // this.initParams(e);
                this.$dataApi({
                    url:'api/AppInfo/GetList',
                    method:'POST',
                    data:{
                        isActive:true,
                        maxResultCount:100,
                        skipCount:1
                    }
                }).then(res=>{
                    // console.log(res);
                    that.sourceList = res.result.items;
                    
                })
            }

        },
        created(){
            this.getData(1);  //获取数据
            this.getList(); //获取来源
            this.columns = [
                {
                    title: '排序值',
                    dataIndex: 'sort',
                },
                {
                    title: '投诉单号',
                    dataIndex: 'cI_Code',
                },
                {
                    title: '投诉类型',
                    dataIndex: 'cI_ComIndusty',
                },
                {
                    title: '投诉企业名称',
                    dataIndex: 'cI_ComName',
                },
                {
                    title: '标题',
                    dataIndex: 'title',
                },
                {
                    title: '提交日期',
                    // dataIndex: 'id',
                    dataIndex: 'creationTimeStr',
                },
                {
                    title: '投诉单状态',
                    dataIndex: 'stateStr',
                },
                // {
                //     title: '是否置顶',
                //     dataIndex: 'sort',
                //     customRender: text => {
                //         // console.log(text);
                //         if(text>0){
                //             return "置顶"
                //         }else{
                //             return "未置顶"
                //         }
                //     }
                // },
                // {
                //     title: '操作',
                //     dataIndex: 'option',
                //     scopedSlots: { customRender: 'option' },
                //     width:'20%',
                // }
            ];
        },
    }
</script>

<style lang="scss" scoped>
    .box{
        padding: 10px 0 0 10px;
        background: #fff;
    }
    .tabs{
        border-bottom: 1px solid #ddd;
        margin-bottom: 20px;
    }
    .btn{
        outline: none;
        width: 200px;
        border: 1px solid rgb(233, 230, 230);;
        border-bottom: none;
        height: 30px;
        border-radius: 8px 8px 0 0;
        background: #fff;
        cursor:pointer;
    }
    .btn:hover{
        background:#40A9FF;
        color: #fff;
        border: 1px solid rgb(233, 230, 230);
        border-bottom: none;
    }
    .btnT{
        background:#40A9FF;
        color: #fff;
        border: 1px solid rgb(233, 230, 230);
        border-bottom: none;
    }
    .detailBox{
        display: flex;

    }
    .boxLeft{
        width: 50%;
    }
    .boxRight{
        width: 45%;
        padding-left: 3%;
    }
    .inputBox{
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 10px;
    }
    .inputBox>p{
        margin: 0;
        width: 30%;
    }
    .showBtn{
        margin-left: 80%;
        margin-top: 40px;
    }
    .table{
        margin-top: 20px;
    }
    .imgList{
        width: 80px;
        height: 80px;
        margin-right: 10px;
    }

    .content .ant-advanced-search-form .ant-form-item {
		display: flex;
	}
    .ant-form-item{
        margin-bottom: 10px;
    }
</style>