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
                            <a-range-picker @change="onChange" v-decorator="['TimeRange']" />
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
                            <a-select default-value="all" v-model="complaintState"  @change="CPhandleChange">
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
                            <a-select default-value="all" v-model="complaintInfo" @change="handleChangeInfo">
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
		   <p>投诉单号:{{editData.cI_Code}}  投诉类型:{{editData.complainType}}</p>
           <div class="detailBox">
               <div class="boxLeft">
                   <div class="inputBox">
                       <p>投诉单状态:</p>
                       <a-input placeholder="投诉单状态" :value='editData.stateStr' />
                   </div>
                   <div class="inputBox">
                       <p>投诉企业名称:</p>
                       <a-input placeholder="投诉企业名称" :value='editData.cI_ComName' />
                   </div>
                   <div class="inputBox">
                       <p>投诉企业地址:</p>
                       <a-input placeholder="投诉企业地址" :value='editData.cI_ComAddress' />
                   </div>
                   <div class="inputBox">
                       <p>企业联系电话:</p>
                       <a-input placeholder="企业联系电话" :value='editData.cI_ComTel' />
                   </div>
                   <div class="inputBox">
                       <p>品牌:</p>
                       <a-input placeholder="品牌" :value='editData.cI_Brand' />
                   </div>
                   <div class="inputBox">
                       <p>型号:</p>
                       <a-input placeholder="型号" :value='editData.cI_Model' />
                   </div>
                   <div class="inputBox">
                       <p>涉及金额:</p>
                       <a-input placeholder="涉及金额" :value='editData.cI_Price' />
                   </div>
                   <div class="inputBox">
                       <p>投诉内容:</p>
                       <a-textarea
                            v-model="editData.cI_Content"
                            placeholder="投诉内容"
                            :auto-size="{ minRows: 3, maxRows: 5 }"
                        />
                   </div>
                   <div class="inputBox imgBox">
                       <p>上传图片:</p>
                       <div>
                           <img class="imgList" v-for="(item,index) in editData.attachList" :key="index" :src="item" alt="">
                       </div>
                   </div>
               </div>
               <div class="boxRight">
                   <div class="inputBox">
                       <p>姓名:</p>
                       <a-input placeholder="姓名" :value='editData.cI_UserName' />
                   </div>
                   <div class="inputBox">
                       <p>手机号码:</p>
                       <a-input placeholder="手机号码" :value='editData.cI_UserMobile' />
                   </div>
                   <div class="inputBox">
                       <p>投诉诉求:</p>
                       <a-input placeholder="投诉诉求" :value='editData.cI_Appeal' />
                   </div>
                   <div class="inputBox">
                        <p>投诉结果:</p>
                        <a-textarea
                            v-model="ComplaintResults"
                            placeholder="投诉结果"
                            :auto-size="{ minRows: 3, maxRows: 5 }"
                        />
                   </div>
                   <div class="inputBox">
                       <p>行业类别:</p>
                       <a-input placeholder="行业类别" :value='editData.cI_ComIndusty' />
                   </div>
                   <!-- <div class="inputBox">
                       <p>标题:</p>
                       <a-input placeholder="Basic usage" :value='complaintNum' />
                   </div> -->
                   <!-- <div class="inputBox">
                       <p>阅读数:</p>
                       <a-input placeholder="Basic usage" :value='complaintNum' />
                   </div> -->
               </div>
           </div>
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
                widthFlag:{x:1600}, //表格宽度
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
                        name:"查看",
                        fn:(e)=>{
                            this.detail(e);
                        }
                    }
                ],
                editVisible:false,  //详情框
                editData:{},  //详情页数据
                ComplaintResults:'',  //投诉结果
                sourceList:[],  //来源
                sourceId:1, //来源ID
            }
        },
        methods:{
            btnSou(item){
                // console.log(item);
                this.sourceId = item.id;
                this.reset();
                this.getData(1);
            },

            //关闭详情弹框
            closeBox(){
                this.editVisible = false;
            },

            //提交时间
            onChange(date, dateString) {
                // console.log(date, dateString);
                this.SubmitTimeStart =dateString[0]
                this.SubmitTimeEnd = dateString[1]
            },


            //投诉单状态
            CPhandleChange(value){
                // console.log(this.complaintState);
                // console.log(value);
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

            //投诉类型
            handleChangeInfo(value){
                // console.log(value);
                if(value == 'all'){
                    this.complaintInfo = '';
                }else if(value == 'tv'){
                    this.complaintInfo = '电视购物';
                }else if(value == 'inter'){
                    this.complaintInfo = '网上消费';
                }else if(value == 'shop'){
                    this.complaintInfo = '店铺消费';
                }
                // console.log(this.complaintInfo);
            },

            //查询按钮
            filterSearch(){
                this.getData(1);
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
                // this.initParams(e);
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
                        skipCount:e  //页码
                    }
                }).then(res=>{
                    console.log(res);
                    if(res.success ){
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
                // this.params['pageNo'] = this.paginations['current'];
                // // 排序
                // this.params['sortField'] = sorter['columnKey'] || "";
                // this.params['sortOrder'] = sorter['order'] ? sorter['order'] == "ascend" ? '0' : '1' : "";
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

            // 查看详情
            detail(e){
                // console.log(e);
                this.editData = e;
                console.log(this.editData);
                this.ComplaintResults = '';
                e.complainItems.map((item,index)=>{
                    this.ComplaintResults = this.ComplaintResults + (index+1) + item.stateStr + ':' + item.cI_Comment + '\n';
                })
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
                    console.log(res);
                    that.sourceList = res.result.items;
                    
                })
            }
        },
        created(){
            this.getList();  //获取来源
            this.getData(1);  //获取数据
            this.columns = [
                {
                    title: '投诉单号',
                    dataIndex: 'cI_Code',
                    // scopedSlots: { customRender: 'WX_HeadImg' },
                },
               
                {
                    title: '投诉类型',
                    dataIndex: 'complainType',
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
                    dataIndex: 'creationTimeStr',
                },
                {
                    title: '投诉单状态',
                    dataIndex: 'stateStr',
                },
                {
                    title: '操作',
                    dataIndex: 'option',
                    scopedSlots: { customRender: 'option' },
                    width:'10%',
                }
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
    .table{
        margin-top: 20px;
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
        width: 150px;
    }
    .showBtn{
        margin-left: 45%;
        margin-top: 20px;
    }
    .imgList{
        width: 80px;
        height: 80px;
        margin-right: 10px;
    }
    .imgBox{
        justify-content: start;
    }
    .content .ant-advanced-search-form .ant-form-item {
		display: flex;
	}
    .ant-form-item{
        margin-bottom: 10px;
    }
</style>