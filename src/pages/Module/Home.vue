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
                    <a-col :span="7">
                        <a-form-item label="是否展示:">
                            <a-select default-value="all" v-model="Exhibition" @change="ExhibitionChange">
                                <a-select-option value="all">
                                    全部
                                </a-select-option>
                                <a-select-option value="isTrue">
                                    是
                                </a-select-option>
                                <a-select-option value="isFalse">
                                    否
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="7" class="button">
                        <a-button type="primary" @click="filterSearch" style="margin-top:4px;">查询</a-button>
                        <a-button @click="reset" style="margin-top:4px;">重置</a-button>
                    </a-col>
                </a-row>
            </a-form>
        </div>

        <tables class="table" size="small" :columns="columns" :tableData="tableData" :loading="false" :handleTableChange="handleTableChange" :bordered="true" :pagination="paginations" :option="option"></tables>
    
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
                                placeholder="Controlled autosize"
                                :auto-size="{ minRows: 3, maxRows: 5 }"
                            />
                    </div>
                    <div class="inputBox">
                        <p>上传图片:</p>
                        <div>
                           <img class="imgList" v-for="(item,index) in editData.attachList" @click="bigImg(item)" :key="index" :src="item" alt="">
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
                    </div>
                    <div class="inputBox">
                        <p>阅读数:</p>
                        <a-input placeholder="Basic usage" :value='complaintNum' />
                    </div> -->
                    <div class="inputBoxTop">
                        <p class="isShow">是否展示:</p>
                        <a-radio-group v-model="value" @change="onChangeTop">
                            <a-radio :value="1">
                                是
                            </a-radio>
                            <a-radio :value="2">
                                否
                            </a-radio>
                        </a-radio-group>
                    </div>
                    
                </div>
            </div>
            <a-button type="primary" class="showBtn" @click="closeBox">确定</a-button>
		</a-modal>

        <a-modal width="500px" title="投诉图片" :maskClosable="false" v-model="bigImage"  footer="" cancelText="关闭">
            <img :src="bigImgUrl" class="bigImg" alt="">
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
                Exhibition:'全部',  //是否展示
                ExhibitionT:'',  //是否展示
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
                        text:1,
                        fn:(e)=>{
                            this.detail(e);
                        }
                    },
                    
                    {
                        type:"detail",
                        name:"置顶",
                        text:3,
                        dataIndex: 'sort',
                        fn:(e)=>{
                            this.topAciton(e);
                        }
                    },
                    {
                        type:"detail",
                        name:"上移",
                        text:4,
                        dataIndex: 'sort',
                        fn:(e)=>{
                            this.moveUpTop(e);
                        }
                    },
                    {
                        type:"detail",
                        name:"下移",
                        text:5,
                        dataIndex: 'sort',
                        fn:(e)=>{
                            this.moveDownTop(e);
                        }
                    },
                    {
                        type:"detail",
                        name:"删除",
                        text:2,
                        fn:(e)=>{
                            this.delete(e);
                        }
                    },

                ],
                editVisible:false,  //详情框
                sourceList:[],  //来源
                sourceId:1, //来源ID
                editData:{},  //详情页数据
                ComplaintResults:'',  //投诉结果
                bigImage:false,
                bigImgUrl:'',
                value: 2,
                id:'',
            }
        },
        methods:{

            btnSou(item){
                // console.log(item);
                this.sourceId = item.id;
                this.reset();
                this.getData(1);
            },

            //是否展示
            onChangeTop(e) {
                let that = this;
                console.log(e.target.value);
                console.log(this.value);
                console.log(this.paginations);
                // return false
                if(this.value == 1){
                    this.$dataApi({
                        url:'api/ComplainManage/ActiveShow',
                        method:'POST',
                        data:{
                            id:that.id
                        }
                    }).then(res=>{
                        console.log(res);
                        if(res.success){
                            that.$message.success(res.result);
                            that.getData(that.paginations.current)
                        }else{
                            that.$message.warning(res.error.message);
                        };
                        
                    })
                }else{
                    this.$dataApi({
                        url:'api/ComplainManage/InactiveShow',
                        method:'POST',
                        data:{
                            id:that.id
                        }
                    }).then(res=>{
                        console.log(res);
                        if(res.success){
                            that.$message.success(res.result);
                            that.getData(that.paginations.current)
                        }else{
                            that.$message.warning(res.error.message);
                        };

                    })
                }
                // let that = this;
                
            },

            //提交时间
            onChange(date, dateString) {
                // console.log(date, dateString);
                this.SubmitTimeStart =dateString[0];
                this.SubmitTimeEnd = dateString[1];
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

            //是否展示
            ExhibitionChange(value){
                console.log(value);
                if(value == 'all'){
                    this.Exhibition = '全部';
                    this.ExhibitionT = ''
                }else if(value == 'isTrue'){
                    this.Exhibition = '是';
                    this.ExhibitionT = true
                }else{
                    this.Exhibition = '否';
                    this.ExhibitionT = false
                }
            },

            //查询按钮
            filterSearch(){
                // console.log(this.complaintNum);
                // console.log(this.title);
                // console.log(this.complaintName);
                this.getData(1);
            },

            //关闭详情弹框
            closeBox(){
                this.editVisible = false;
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
                        isShow:that.ExhibitionT
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

            //置顶
            topAciton(e){
                console.log(e);
                if(e.sort>0){
                    this.goBot(e)
                }else {
                    this.goTop(e)
                }
            },

            //置顶
            goTop(e){
                console.log(e);
                // return false
                let that = this;
                // this.initParams(e);
                this.$dataApi({
                    url:'api/ComplainManage/ActiveTop',
                    method:'POST',
                    data:{
                        id:e.id
                    }
                }).then(res=>{
                    console.log(res);
                    if(res.result == '设置成功'){
                        that.$message.success('展示成功');
                    }
                    // that.sourceList = res.result.items;
                    that.getData(1);
                })
            },

            //取消置顶
            goBot(e){
                console.log(e);
                let that = this;
                // this.initParams(e);
                this.$dataApi({
                    url:'api/ComplainManage/InactiveTop',
                    method:'POST',
                    data:{
                        id:e.id
                    }
                }).then(res=>{
                    console.log(res);
                    if(res.result == '取消成功'){
                        that.$message.success('取消成功');
                    }
                    // that.sourceList = res.result.items;
                    that.getData(1);
                })
            },

            //上移
            moveUpTop(e){
                console.log(e);
                let that = this;
                this.$dataApi({
                    url:'api/ComplainManage/MoveUpTop',
                    method:'POST',
                    data:{
                        id:e.id
                    }
                }).then(res=>{
                    console.log(res);
                    if(res.success){
                        that.$message.success(res.result);
                        that.getData(that.paginations.current)
                    }else{
                        that.$message.warning(res.error.message);
                    }
                    
                })
            },

            //下移
            moveDownTop(e){
                console.log(e);
                let that = this;
                this.$dataApi({
                    url:'api/ComplainManage/MoveDownTop',
                    method:'POST',
                    data:{
                        id:e.id
                    }
                }).then(res=>{
                    console.log(res);
                    if(res.success){
                        that.$message.success(res.result);
                        that.getData(that.paginations.current)
                    }else{
                        that.$message.warning(res.error.message);
                    };
                    
                })
            },

            // 查看详情
            detail(e){
                console.log(e);
                // return false;
                this.editData = e;
                this.ComplaintResults = '';
                this.id = e.id;
                if(e.isShow){
                    this.value = 1
                }else{
                    this.value = 2
                }
                e.complainItems.map((item,index)=>{
                    this.ComplaintResults = this.ComplaintResults + (index+1) + item.stateStr + ':' + item.cI_Comment + '\n';
                })
                this.editVisible = true;
            },

            //删除
            delete(e){
                console.log(e);
                let that = this;
                this.$dataApi({
                    url:'api/ComplainManage/DelComplain',
                    method:'POST',
                    data:{
                        id:e.id
                    }
                }).then(res=>{
                    // console.log(res);
                    if(res.success){
                        that.$message.success('删除成功');
                    }else{
                        that.$message.error(res.error.message);
                    }
                    
                })
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
            },

            bigImg(e){
                console.log(e);
                this.bigImgUrl = e;
                this.bigImage = true;
            }

        },
        created(){
            this.getData(1);  //获取数据
            this.getList(); //获取来源
            this.columns = [
                {
                    title: '投诉单号',
                    dataIndex: 'cI_Code',
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
                    // dataIndex: 'id',
                    dataIndex: 'creationTimeStr',
                },
                {
                    title: '投诉单状态',
                    dataIndex: 'stateStr',
                },
                {
                    title: '是否展示',
                    dataIndex: 'isShow',
                    customRender: text => {
                        // console.log(text);
                        if(text){
                            return "展示"
                        }else{
                            return ""
                        }
                    }
                },
                // {
                //     title: '是否展示',
                //     dataIndex: 'sort',
                //     customRender: text => {
                //         // console.log(text);
                //         if(text>0){
                //             return "展示"
                //         }else{
                //             return ""
                //         }
                //     }
                // },
                {
                    title: '操作',
                    dataIndex: 'option',
                    scopedSlots: { customRender: 'optionaction' },
                    width:'20%',
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
        margin-left: 45%;
        margin-top: 20px;
    }
    .table{
        margin-top: 20px;
    }
    .imgList{
        width: 80px;
        height: 80px;
        margin-right: 10px;
    }
    .bigImg{
        width: 100%;
        height: 700px;
    }
    .inputBoxTop{
        display: flex;
        margin-top: 20px;
    }
    .isShow{
        margin-right: 30px
    }

    .content .ant-advanced-search-form .ant-form-item {
		display: flex;
	}
    .ant-form-item{
        margin-bottom: 10px;
    }


</style>