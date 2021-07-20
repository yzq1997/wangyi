<template>
    <div class="box">
        <a-button type="primary" @click="addBrand">新增</a-button>

        <div class="main">
            <div class="reply">
                <div class="replyList" v-for="(item,index) in brandList" :key="index">
                    <span>{{item.id}}</span>
                    <!-- <img :src="item.img" class="imgLogo" alt=""> -->
                    <span>{{item.title}}</span>
                    <span>{{item.isActive ? '已启用' : '已禁用'}}</span>
                    <span class="modifyData" @click="modifyData(item)">修改</span>
                </div>
            </div>
        </div>
        <a-pagination class="pageBox" :default-current="1" :total="brandListNum" @change='inchange' />


        <a-modal width="500px" :title="title" :maskClosable="false" v-model="modifyBox"  footer="" cancelText="关闭">
            <div class="detailBox">
                <!-- <div class="RequiredBox">
                    <span class="Required">*</span>
                    <span class="title">LOGO</span>
                    <a-upload
                        name="avatar"
                        list-type="picture-card"
                        class="avatar-uploader"
                        :show-upload-list="false"
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        :before-upload="beforeUpload"
                        @change="handleChange"
                    >
                        <img v-if="imageUrl" :src="imageUrl" class="imgNewLogo" alt="avatar" />
                        <div v-else>
                        <a-icon :type="loading ? 'loading' : 'plus'" />
                        <div class="ant-upload-text">
                            Upload
                        </div>
                        </div>
                    </a-upload>
                </div> -->
                <div class="RequiredBox">
                    <span class="Required">*</span>
                    <span class="title">是否启用</span>
                    <a-select default-value="all" style="width: 120px" v-model="complaintInfo" @change="handleChangeInfo">
                        <a-select-option value="Enable">
                            启用
                        </a-select-option>
                        <a-select-option value="EnableNo">
                            禁用
                        </a-select-option>
                    </a-select>
                </div>
                
                <div class="RequiredBox">
                    <span class="Required">*</span>
                    <span class="title">名称</span>
                    <a-input class="inputName" placeholder="请输入名称" v-model="name"/>
                </div>
            </div>
            <div class="btnBox">
                <a-button @click="cenBtn">取消</a-button>
                <a-button type="primary" class="showBtn" @click="finBtn">确定</a-button>
            </div>
		</a-modal>
    </div>
</template>

<script>
import tables from '@/pages/common/table';
import LoginVue from '../Login.vue';
import axios from 'axios'
    function getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    export default {
        components:{
            tables
        },
        data(){
            return {
                replyData:[
                    {
                        id:1,
                        name:'淘宝',
                        img:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fa3.att.hudong.com%2F61%2F98%2F01300000248068123885985729957.jpg&refer=http%3A%2F%2Fa3.att.hudong.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1625361246&t=7c8a7ebb31aed803612b97528fffcc56',
                        num:'80%',
                    },
                    {
                        id:2,
                        name:'淘宝',
                        img:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fa3.att.hudong.com%2F61%2F98%2F01300000248068123885985729957.jpg&refer=http%3A%2F%2Fa3.att.hudong.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1625361246&t=7c8a7ebb31aed803612b97528fffcc56',
                        num:'80%',
                    },
                    {
                        id:3,
                        name:'淘宝',
                        img:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fa3.att.hudong.com%2F61%2F98%2F01300000248068123885985729957.jpg&refer=http%3A%2F%2Fa3.att.hudong.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1625361246&t=7c8a7ebb31aed803612b97528fffcc56',
                        num:'80%',
                    }
                ],
                modifyBox:false,  //修改信息弹框
                loading: false,
                imageUrl: 'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3566088443,3713209594&fm=26&gp=0.jpg',
                fileListTwo:[],
                sourceId:1, //来源ID
                brandList:[],  //品牌信息
                name:'',  //品牌信息
                title:'',
                Enable:true,
                complaintInfo:'启用',  //投诉类型
                brandData:{},
                brandListNum:1,
                pageNum:1
            }
        },
        methods:{
            //新增品牌
            addBrand(){
                this.title = '新增';
                this.name = '';
                this.modifyBox = true;
            },

            inchange(page,pageSize){
                console.log(page);
                this.getBrand(page)
            },

            //取消按钮
            cenBtn(){
                this.modifyBox = false;
            },

            //确定按钮
            finBtn(){
                let that = this;
                
                if(this.title == '修改'){
                    
                    this.$dataApi({
                        url:'api/Brand/Update',
                        method:'POST',
                        data:{
                            id:that.brandData.id,
                            title:that.name,
                            isActive:that.Enable,
                        }
                    }).then(res=>{
                        console.log(res);
                        that.getBrand();
                        that.$message.success('修改成功');
                        this.modifyBox = false;
                    })
                }else{
                    this.$dataApi({
                        url:'api/Brand/Create',
                        method:'POST',
                        data:{
                            title:that.name,
                            isActive:that.Enable,
                        }
                    }).then(res=>{
                        console.log(res);
                        if(res.success){
                            that.$message.success('新增成功');
                            that.getBrand();
                            this.modifyBox = false;
                        }
                    })
                }
                
                
            },

            //启用禁用
            handleChangeInfo(value){
                // console.log(value);
                if(value == 'Enable'){
                    this.Enable = true;
                }else{
                    this.Enable = false;
                }
            },
            
            //打开修改弹窗
            modifyData(item){
                console.log(item);
                this.brandData = item;
                this.name = item.title
                this.complaintInfo = item.isActive == true ? '启用' : '禁用';
                this.title = '修改';
                this.modifyBox = true;
            },

            //上传图片,暂时不要
            handleChange(info) {
                getBase64(info.file.originFileObj, imageUrl => {
                    this.imageUrl = imageUrl;
                    this.loading = false;
                });
            },
            //上传图片,暂时不要
            beforeUpload(file) {
                // console.log(file);
                let that = this;
                const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
                if (!isJpgOrPng) {
                    this.$message.error('图片格式不对');
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message.error('图片大小不得超过2M!');
                }
                let imgFile = [];
                imgFile.push(file);
                var formData = new FormData();
                imgFile.forEach(function(i, file) {
                    formData.append('myFile[]',i);
                });
                new Promise((resolve, reject) => {
                    axios.post('http://315cc.com.cn/api/api/Values/ImgUpload', formData)
                    .then(function (res) {
                        console.log(res);
                        if(res.errmsg == '上传成功'){
                            that.$message.success(
                                '上传成功',
                                3,
                            );
                        }
                        let imgUrl = 'http://' + res.filePath;
                        that.fileListTwo = imgUrl
                        // that.fileListTwo.push({
                        //     url:imgUrl
                        // });
                        console.log(that.fileListTwo);
                        resolve()
                    })
                });
                return isJpgOrPng && isLt2M;
            },


            //获取品牌信息
            getBrand(pageSize){
                let that = this;
                // this.initParams(e);
                this.$dataApi({
                    url:'api/Brand/GetList',
                    method:'POST',
                    data:{
                        maxResultCount:10,
                        skipCount:pageSize
                    }
                }).then(res=>{
                    console.log(res);
                    that.brandList = res.result.items.reverse();
                    that.brandListNum = res.result.totalCount;
                    // that.brandList = res.result.items.reverse();
                })
            },
        },
        created(){
            this.getBrand(this.pageNum);
        },
    }
</script>

<style lang="scss" scoped>
    .box{
        padding: 10px 0 0px 10px;
        background: #fff;
        // position: relative;
    }
    
    
    .main{
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-around;
    }
    .imgLogo{
        display: block;
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }
    .reply{
        width: 100%;
    }
    
    .replyList{
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 40px;
        border-bottom: 1px solid #eee;
        // margin-top: 20px;
        // margin-bottom: 20px;
    }
    .modifyData{
        color: rgb(64, 148, 204);
        cursor: pointer;
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
    .btnBox{
        margin-top: 40px;
        display: flex;
        justify-content: center;
    }
    .showBtn{
        margin-left: 20px;
    }
    .imgNewLogo{
        width: 100px;
        height: 100px;
    }
    .pageBox{
        margin-top: 20px;
        // position: absolute;
        // right: 0;
        float: right;
    }
</style>