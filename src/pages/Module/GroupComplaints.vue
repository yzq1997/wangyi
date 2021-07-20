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

        <div class="main">
            <a-form class="ant-advanced-search-form" :form="filterForm" style="overflow:hidden;">
                <a-row :gutter="24">
                    <a-col :span="7">
                        <a-form-item label="投诉单号:">
                            <a-input placeholder="请输入" v-model="complaintNum"/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="7">
                        <a-form-item label="标题:">
                            <a-input placeholder="请输入" v-model="title"/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="7">
                        <a-form-item label="提交时间:">
                            <a-range-picker @change="onChange" v-decorator="['TimeRange']"/>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="7">
                        <a-form-item label="投诉企业名称:">
                            <a-input placeholder="请输入" v-model="complaintName"/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="7">
                        <a-form-item label="投诉单状态:">
                            <a-select default-value="all" v-model="complaintState" @change="CPhandleChange">
                                <a-select-option value="all">
                                    全部
                                </a-select-option>
                                <a-select-option value="stateOne">
                                    待受理
                                </a-select-option>
                                <a-select-option value="stateTwo">
                                    受理中
                                </a-select-option>
                                <a-select-option value="stateThree">
                                    办理中
                                </a-select-option>
                                <a-select-option value="stateFour">
                                    已办结
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="7">
                        <a-form-item label="投诉类型:">
                            <a-select default-value="all"  v-model="complaintInfo" @change="handleChangeInfo">
                                <a-select-option value="all">
                                    全部
                                </a-select-option>
                                <a-select-option value="tv">
                                    电视购物
                                </a-select-option>
                                <a-select-option value="inter">
                                    网上消费
                                </a-select-option>
                                <a-select-option value="shop">
                                    店铺消费
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    
                    <a-col :span="7" class="button">
                        <a-button type="primary" @click="filterSearch" style="margin-top:4px;">查询</a-button>
                        <a-button @click="reset" style="margin-top:4px;">重置</a-button>
                    </a-col>
                </a-row>
            </a-form>
        </div>

        <tables class="table" size="small" :scroll="widthFlag" :columns="columns" :tableData="tableData" :loading="false" :handleTableChange="handleTableChange" :bordered="true" :pagination="paginations" :option="option"></tables>
    
        <a-modal width="1000px" title="投诉信息" :maskClosable="false" v-model="editVisible"  footer="" cancelText="关闭">
		   <p>投诉单号:  编号:  投诉类型:</p>
           <div class="detailBox">
               <div class="boxLeft">
                   <div class="inputBox">
                       <p>投诉单状态:</p>
                       <a-input placeholder="请输入投诉单状态" :value='complaintNum' />
                   </div>
                   <div class="inputBox">
                       <p>投诉企业名称:</p>
                       <a-input placeholder="请输入投诉企业名称" :value='complaintNum' />
                   </div>
                   <div class="inputBox">
                       <p>投诉企业地址:</p>
                       <a-input placeholder="请输入投诉企业地址" :value='complaintNum' />
                   </div>
                   <div class="inputBox">
                       <p>企业联系电话:</p>
                       <a-input placeholder="请输入企业联系电话" :value='complaintNum' />
                   </div>
                   <div class="inputBox">
                       <p>品牌:</p>
                       <a-input placeholder="请输入品牌" :value='complaintNum' />
                   </div>
                   <div class="inputBox">
                       <p>型号:</p>
                       <a-input placeholder="请输入型号" :value='complaintNum' />
                   </div>
                   <div class="inputBox">
                       <p>涉及金额:</p>
                       <a-input placeholder="请输入涉及金额" :value='complaintNum' />
                   </div>
                   <div class="inputBox">
                       <p>投诉内容:</p>
                       <a-textarea
                            v-model="complaintNum"
                            placeholder="Controlled autosize"
                            :auto-size="{ minRows: 3, maxRows: 5 }"
                        />
                   </div>
                   <div class="inputBox">
                       <p>上传图片:</p>
                       <a-input placeholder="Basic usage" :value='complaintNum' />
                   </div>
               </div>
               <div class="boxRight">
                   <div class="inputBox">
                       <p>姓名:</p>
                       <a-input placeholder="请输入姓名" :value='complaintNum' />
                   </div>
                   <div class="inputBox">
                       <p>手机号码:</p>
                       <a-input placeholder="请输入手机号码" :value='complaintNum' />
                   </div>
                   <div class="inputBox">
                       <p>投诉诉求:</p>
                       <a-input placeholder="请输入投诉诉求" :value='complaintNum' />
                   </div>
                   <div class="inputBox">
                       <p>投诉结果:</p>
                       <a-textarea
                            v-model="complaintNum"
                            placeholder="请输入投诉结果"
                            :auto-size="{ minRows: 3, maxRows: 5 }"
                        />
                   </div>
                   <div class="inputBox">
                       <p>行业类别:</p>
                       <a-input placeholder="请输入行业类别" :value='complaintNum' />
                   </div>
                   <div class="inputBox">
                       <p>标题:</p>
                       <a-input placeholder="请输入标题" :value='complaintNum' />
                   </div>
                   <div class="inputBox">
                       <p>阅读数:</p>
                       <a-input placeholder="请输入阅读数" :value='complaintNum' />
                   </div>
               </div>
           </div>
           <a-button type="primary" class="showBtn">确定</a-button>
		</a-modal>

        <a-modal width="1000px" title="添加" :maskClosable="false" v-model="addcCmplaint"  footer="" cancelText="关闭">
            <a-form class="ant-advanced-search-form" :form="filterFormT" style="overflow:hidden;">
                <a-row :gutter="24">
                    <a-col :span="8">
                        <a-form-item label="投诉单号:">
                            <a-input placeholder="请输入" v-model="complaintNumT"/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="标题:">
                            <a-input placeholder="请输入" v-model="titleT"/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="提交时间:">
                            <a-range-picker @change="onChangeT" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="8">
                        <a-form-item label="投诉企业名称:">
                            <a-input placeholder="请输入" v-model="complaintNameT"/>
                        </a-form-item>
                    </a-col>
                   <a-col :span="8">
                        <a-form-item label="投诉单状态:">
                            <a-select default-value="all"  @change="CPhandleChangeT">
                                <a-select-option value="all">
                                    全部
                                </a-select-option>
                                <a-select-option value="isTrue">
                                    已办理
                                </a-select-option>
                                <a-select-option value="isFalse">
                                    未办理
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="完成时间:">
                            <a-range-picker @change="onChangeFinT" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-button type="primary" @click="filterSearchT" style="margin-top:4px;">查询</a-button>
            </a-form>
            <tables class="col-24" size="small" :scroll="widthFlagT" :columns="columnsT" :tableData="tableDataT" :loading="false" :handleTableChange="handleTableChangeT" :bordered="true" :pagination="paginationT" :option="optionT"></tables>
            <a-button type="primary" class="showBtn">确定</a-button>
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
                filterFormT:this.$form.createForm(this,{name:'filter'}),
                widthFlag:{x:2000}, //表格宽度
                widthFlagT:{x:900}, //表格宽度
                complaintNum:'',  //投诉单号
                complaintNumT:'',  //投诉单号
                title:'',  //标题
                titleT:'',  //标题
                SubmitTimeStart:'',  //提交时间开始
                SubmitTimeEnd:'',  //提交时间结束
                SubmitTimeStartT:'',  //提交时间开始
                SubmitTimeEndT:'',  //提交时间结束
                complaintName:'',  //投诉企业名称
                complaintNameT:'',  //投诉企业名称
                complaintState:'全部',  //投诉单状态
                complaintStateFin:'',  //投诉单状态
                complaintStateT:'全部',  //投诉单状态
                complaintStateTFin:'',  //投诉单状态
                params:{},
                paramsT:{},
                SubmitFinTime:{},  //完成时间
                SubmitFinTimeT:{},  //完成时间
                complaintInfo:'全部',  //投诉类型
                columns:[],
                columnsT:[],
                tableData: [],
                tableDataT: [],
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
                paginationT: {
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
                        name:"置顶",
                        fn:(e)=>{
                            this.goTop(e);
                        }
                    },
                    {
                        type:"detail",
                        name:"查看",
                        fn:(e)=>{
                            this.detail(e);
                        }
                    },
                    {
                        type:"detail",
                        name:"删除",
                        fn:(e)=>{
                            this.delete(e);
                        }
                    },
                    {
                        type:"detail",
                        name:"关联投诉单",
                        fn:(e)=>{
                            this.relation(e);
                        }
                    }
                ],
                optionT:[
                    {
                        type:"detail",
                        name:"关联",
                        fn:(e)=>{
                            this.separateRelT(e);
                        }
                    },
                    {
                        type:"detail",
                        name:"取消关联",
                        fn:(e)=>{
                            this.separateRelF(e);
                        }
                    },
                ],
                editVisible:false,  //详情框
                addcCmplaint:false,  //关联投诉单
                selectedRowKeys: [],
                sourceList:[],  //来源
                sourceId:1, //来源ID
            }
        },
        methods:{
            
            btnW(){
                console.log(1);
            },
            btnT(){
                console.log(2);
            },

            //提交时间
            onChange(date, dateString) {
                console.log(date, dateString);
            },

            //完成时间
            onChangeFin(date, dateString){
                console.log(date, dateString);
            },

            //投诉单关联提交时间
            onChangeT(date, dateString) {
                console.log(date, dateString);
            },

            //投诉单关联完成时间
            onChangeFinT(date, dateString){
                console.log(date, dateString);
            },

            //投诉单状态
            CPhandleChange(value){
                console.log(value);
                if(value == 'all'){
                    this.complaintStateFin = '';
                }else if(value == 'stateOne'){
                    this.complaintStateFin = 1;
                }else if(value == 'stateTwo'){
                    this.complaintStateFin = 2;
                }else if(value == 'stateThree'){
                    this.complaintStateFin = 3;
                }else if(value == 'stateFour'){
                    this.complaintStateFin = 4;
                }
            },

            //投诉单关联投诉单状态
            CPhandleChangeT(value){
                console.log(value);
            },

            //投诉类型
            handleChangeInfo(value){
                console.log(value);
                if(value == 'all'){
                    this.complaintInfo = '';
                }else if(value == 'tv'){
                    this.complaintInfo = '电视购物';
                }else if(value == 'inter'){
                    this.complaintInfo = '网上消费';
                }else if(value == 'shop'){
                    this.complaintInfo = '店铺消费';
                }
            },

            //查询按钮
            filterSearch(){
                console.log(this.complaintNum);
                console.log(this.title);
                console.log(this.complaintName);
            },

            //投诉单关联查询按钮
            filterSearchT(){
                console.log(this.complaintNumT);
                console.log(this.titleT);
                console.log(this.complaintNameT);
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
                    url:'api/Users/GetAdminUsers',
                    method:'POST',
                    data:this.params
                }).then(res=>{
                    // this.Ress = res;
                    console.log(JSON.parse(res.Data));
                    if(res.Status == 200)
                    {
                        that.paginations.total  = JSON.parse(res.Data).TotalCount;
                        that.paginationT.total  = JSON.parse(res.Data).TotalCount;
                        that.tableData = JSON.parse(res.Data).Rows;
                    }
                })
            },

            //获取数据
            getDataT(e){
                let that = this;
                console.log(this.params);
                // this.initParams(e);
                this.$dataApi({
                    url:'api/Users/GetAdminUsers',
                    method:'POST',
                    data:{
                        pageNo:e,
                        pageSize:10
                    }
                }).then(res=>{
                    // this.Ress = res;
                    console.log(JSON.parse(res.Data));
                    if(res.Status == 200)
                    {
                        // that.paginations.total  = JSON.parse(res.Data).TotalCount;
                        that.paginationT.total  = JSON.parse(res.Data).TotalCount;
                        that.tableDataT = JSON.parse(res.Data).Rows;
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
                this.getData('false');
            },

            handleTableChangeT(pagination, filters, sorter) {
                console.log(pagination);
                const pager = { ...this.paginationT };
                pager.current = pagination.current;
                this.paginationT = pager;
                this.getDataT(pagination.current)
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

            //置顶
            goTop(e){
                console.log(e);
            },

            // 查看详情
            detail(e){
                console.log(e);
                this.editVisible = true;
            },

            //删除
            delete(e){
                console.log(e);
            },

            //关联投诉单
            relation(e){
                console.log(e);
                this.addcCmplaint = true;
            },

            //关联
            separateRelT(e){
                console.log(e);
            },

            //取消关联
            separateRelF(e){
                console.log(e);
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
                    console.log(res);
                    that.sourceList = res.result.items;
                    
                })
            }

        },
        created(){
            // this.getData();  //获取数据
            // this.getDataT(1);  //获取数据
            this.getList(); 
            this.columns = [
                {
                    title: '微信昵称',
                    dataIndex: 'nickname',
                },
                {
                    title: '性别',
                    dataIndex: 'sex',
                },
                {
                    title: '注册时间',
                    dataIndex: 'RegistTime',
                },
                {
                    title: '最近推送时间',
                    dataIndex: 'LastTime',
                },
                {
                    title: '角色',
                    dataIndex: 'UserRole',
                    width:'5%',
                },
                {
                    title: '手机号',
                    dataIndex: 'UniqueInvitationCode',
                    width:'6%',
                },
                
                {
                    title: '是否取关',
                    dataIndex: 'IsClearAttention',
                    width:'5%',
                    customRender: text => {
                        if(text == 0){
                            return "关注"
                        }else if(text == 1){
                            return "取消关注"
                        }
                        // return "招标宝典"			
                    }
                },
                {
                    title: '来源',
                    dataIndex: 'UserOrigin',
                    width:'5%',
                },
                {
                    title: '操作',
                    dataIndex: 'option',
                    scopedSlots: { customRender: 'option' },
                    width:'12%',
                }
            ];
            this.columnsT = [
                {
                    title: '微信昵称',
                    dataIndex: 'nickname',
                },
                {
                    title: '性别',
                    dataIndex: 'sex',
                },
                {
                    title: '是否取关',
                    dataIndex: 'IsClearAttention',
                    customRender: text => {
                        if(text == 0){
                            return "关注"
                        }else if(text == 1){
                            return "取消关注"
                        }
                    }
                },
                {
                    title: '操作',
                    dataIndex: 'option',
                    scopedSlots: { customRender: 'option'},

                   
                }
            ];
        },
        computed: {
            
            hasSelected() {
                return this.selectedRowKeys.length > 0;
            },
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
        border: 1px solid rgb(233, 230, 230);
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
        width: 45%;
        
    }
    .boxRight{
        width: 47%;
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
        margin-left: 45%;
        margin-top: 20px;
    }
    .table{
        margin-top: 20px;
    }

    .content .ant-advanced-search-form .ant-form-item {
		display: flex;
	}
    .ant-form-item{
        margin-bottom: 10px;
    }
    .ant-form-item{
        display: flex;
    }
    .ant-table-thead > tr > th{
        padding: 10px !important;
    }
</style>