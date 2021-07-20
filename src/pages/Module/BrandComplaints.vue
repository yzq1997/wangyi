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
            <div class="reply">
                <div class="replyList" v-for="(item,index) in replyData" :key="index">
                    <span>{{item.id}}</span>
                    <img :src="item.img" class="imgLogo" alt="">
                    <span>{{item.name}}</span>
                    <span>{{item.num}}</span>
                    <span class="modifyData" @click="modifyData(item.id)">修改</span>
                </div>
            </div>
            <div class="handle">
                <div class="replyList" v-for="(item,index) in handleData" :key="index">
                    <span>{{item.id}}</span>
                    <img :src="item.img" class="imgLogo" alt="">
                    <span>{{item.name}}</span>
                    <span>{{item.num}}</span>
                    <span class="modifyData" @click="modifyData(item.id)">修改</span>
                </div>
            </div>
            <div class="satisfied">
                <div class="replyList" v-for="(item,index) in satisfiedData" :key="index">
                    <span>{{item.id}}</span>
                    <img :src="item.img" class="imgLogo" alt="">
                    <span>{{item.name}}</span>
                    <span>{{item.num}}</span>
                    <span class="modifyData" @click="modifyData(item.id)">修改</span>
                </div>
            </div>
        </div>

        <a-modal width="500px" title="修改信息" :maskClosable="false" v-model="modifyBox"  footer="" cancelText="关闭">
            <div class="detailBox">
                <div class="RequiredBox">
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
                </div>
                <div class="RequiredBox">
                    <span class="Required">*</span>
                    <span class="title">名称</span>
                    <a-input class="inputName" placeholder="请输入名称" />
                </div>
                <div class="RequiredBox">
                    <span class="Required">*</span>
                    <span class="title">回复率</span>
                    <a-input class="inputNum" placeholder="请输入回复率" />
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
                handleData:[
                    {
                        id:4,
                        name:'淘宝',
                        img:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fa3.att.hudong.com%2F61%2F98%2F01300000248068123885985729957.jpg&refer=http%3A%2F%2Fa3.att.hudong.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1625361246&t=7c8a7ebb31aed803612b97528fffcc56',
                        num:'80%',
                    },
                    {
                        id:5,
                        name:'淘宝',
                        img:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fa3.att.hudong.com%2F61%2F98%2F01300000248068123885985729957.jpg&refer=http%3A%2F%2Fa3.att.hudong.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1625361246&t=7c8a7ebb31aed803612b97528fffcc56',
                        num:'80%',
                    },
                    {
                        id:6,
                        name:'淘宝',
                        img:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fa3.att.hudong.com%2F61%2F98%2F01300000248068123885985729957.jpg&refer=http%3A%2F%2Fa3.att.hudong.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1625361246&t=7c8a7ebb31aed803612b97528fffcc56',
                        num:'80%',
                    }
                ],
                satisfiedData:[
                    {
                        id:7,
                        name:'淘宝',
                        img:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fa3.att.hudong.com%2F61%2F98%2F01300000248068123885985729957.jpg&refer=http%3A%2F%2Fa3.att.hudong.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1625361246&t=7c8a7ebb31aed803612b97528fffcc56',
                        num:'80%',
                    },
                    {
                        id:8,
                        name:'淘宝',
                        img:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fa3.att.hudong.com%2F61%2F98%2F01300000248068123885985729957.jpg&refer=http%3A%2F%2Fa3.att.hudong.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1625361246&t=7c8a7ebb31aed803612b97528fffcc56',
                        num:'80%',
                    },
                    {
                        id:9,
                        name:'淘宝',
                        img:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fa3.att.hudong.com%2F61%2F98%2F01300000248068123885985729957.jpg&refer=http%3A%2F%2Fa3.att.hudong.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1625361246&t=7c8a7ebb31aed803612b97528fffcc56',
                        num:'80%',
                    }
                ],
                modifyBox:false,  //修改信息弹框
                loading: false,
                imageUrl: '',
                fileListTwo:[],
                sourceList:[],  //来源
                sourceId:1, //来源ID
                brandList:[],  //品牌信息
            }
        },
        methods:{
            btnW(){

            },

            btnT(){

            },

            //取消按钮
            cenBtn(){
                this.modifyBox = false;
            },

            //确定按钮
            finBtn(){
                this.modifyBox = false;
            },
            
            //打开修改弹窗
            modifyData(id){
                console.log(id);
                this.modifyBox = true;
            },

            //上传图片
            handleChange(info) {
                getBase64(info.file.originFileObj, imageUrl => {
                    this.imageUrl = imageUrl;
                    this.loading = false;
                });
            },
            //上传图片
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
            },

            //获取品牌信息
            getBrand(){
                let that = this;
                // this.initParams(e);
                this.$dataApi({
                    url:'api/BrandComplain/GetList',
                    method:'POST',
                    data:{
                        isActive:true,
                        maxResultCount:100,
                        skipCount:1
                    }
                }).then(res=>{
                    console.log(res);
                    that.brandList = res.result.items;
                    
                })
            },
        },
        created(){
            this.getList();  //获取来源
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
    .reply,.handle,.satisfied{
        width: 30%;
    }
    .reply,.handle{
        border-right: 1px solid #eee;
    }
    .replyList{
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin-top: 10px;
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
        justify-content: flex-end;
    }
    .showBtn{
        margin-left: 20px;
    }
    .imgNewLogo{
        width: 100px;
        height: 100px;
    }
</style>