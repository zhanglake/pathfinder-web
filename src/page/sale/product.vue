<template>
  <div class="product">
    <el-button type="primary" size="small" icon="el-icon-plus" @click="addBtnClick">添加产品</el-button>
    <el-tabs v-model="editableTabsValue" tab-position="top">
      <el-tab-pane label="产品列表">
        <el-table v-loading="tableLoading" :data="tableData" style="width: 100%;margin: 15px auto;">
          <el-table-column prop="productName" label="产品名称">
          </el-table-column>
          <el-table-column prop="stock" label="库存">
          </el-table-column>
          <el-table-column prop="price" label="原价">
          </el-table-column>
          <el-table-column prop="discount" label="折扣">
          </el-table-column>
          <el-table-column prop="salePrice" label="促销价">
          </el-table-column>
          <el-table-column prop="available" label="状态">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click.native.prevent="editRow(scope)" type="text" size="small">
                <i class="el-icon-edit"></i> 编辑
              </el-button>
              <el-button @click.native.prevent="deleteRow(scope)" type="text" size="small">
                <i class="el-icon-delete"></i> 移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="end" style="width: 80%;margin: auto;padding:20px 0;">
            <el-pagination @current-change="handleCurrentChange" :current-page="tablePage" :page-size="10" layout="total, prev, pager, next, jumper" :total="tableTotal">
            </el-pagination>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="新增产品" :disabled="addTabDisabled">
        <el-form ref="addProductForm" v-loading="addTabLoading" :model="newProduct" 
          :rules="addProductRules" label-width="120px" label-position="left" size="small" style="width: 80%;margin: 20px;">
          <el-form-item label="产品名称" prop="productName">
            <el-input v-model="newProduct.productName" placeholder="请输入产品名称" style="width: 500px;"></el-input>
          </el-form-item>
          <el-form-item label="产品分类" prop="typeId">
            <el-select v-model="newProduct.typeId" placeholder="请选择产品分类" style="width: 500px;">
              <el-option v-for="item in productType" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="原价" prop="price">
            <el-input v-model="newProduct.price" placeholder="请输入原价" @blur="changeDiscount" style="width: 500px;"></el-input>
          </el-form-item>
          <el-form-item label="折扣" prop="discount">
            <el-select v-model="newProduct.discount" placeholder="请选择折扣" @change="changeDiscount" style="width: 500px;">
              <el-option v-for="item in discount" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="售价" prop="salePrice">
            <el-input v-model="newProduct.salePrice" placeholder="售价" disabled style="width: 500px;"></el-input>
          </el-form-item>
          <el-form-item label="库存量" prop="stock">
            <el-input v-model="newProduct.stock" placeholder="请输入库存量" style="width: 500px;"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="available">
            <el-switch v-model="newProduct.available" active-text="在售" inactive-text="停售"></el-switch>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="newProduct.description" type="textarea" placeholder="请输入描述" style="width: 500px;"></el-input>
          </el-form-item>
          <el-form-item label="图片" prop="pictures">
            <el-upload action="/pf/file/upload" list-type="picture-card" :on-preview="handlePicturePreview" 
              :on-remove="handlePictureRemove" :on-success="handlePcitureSuccess">
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitAdd()">提交</el-button>
            <el-button @click="resetAdd()">重置</el-button>
          </el-form-item>
        </el-form>
        <el-dialog :visible.sync="dialogVisible" size="tiny">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="编辑产品" :disabled="updateTabDisabled">
        <el-form ref="updateProductForm" v-loading="updateTabLoading" :model="product" 
          :rules="updateProductRules" label-width="120px" label-position="left" size="small" style="width: 80%;margin: 20px;">
          <el-form-item label="产品名称" prop="productName">
            <el-input v-model="product.productName" placeholder="请输入产品名称" style="width: 500px;"></el-input>
          </el-form-item>
          <el-form-item label="产品分类" prop="typeId">
            <el-select v-model="product.typeId" placeholder="请选择产品分类" style="width: 500px;">
              <el-option v-for="item in productType" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="原价" prop="price">
            <el-input v-model="product.price" placeholder="请输入原价" @blur="changeDiscount" style="width: 500px;"></el-input>
          </el-form-item>
          <el-form-item label="折扣" prop="discount">
            <el-select v-model="product.discount" placeholder="请选择折扣" @change="changeDiscount" style="width: 500px;">
              <el-option v-for="item in discount" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="售价" prop="salePrice">
            <el-input v-model="product.salePrice" placeholder="售价" disabled style="width: 500px;"></el-input>
          </el-form-item>
          <el-form-item label="库存量" prop="stock">
            <el-input v-model="product.stock" placeholder="请输入库存量" style="width: 500px;"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="available">
            <el-switch v-model="product.available" active-text="在售" inactive-text="停售"></el-switch>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="product.description" type="textarea" placeholder="请输入描述" style="width: 500px;"></el-input>
          </el-form-item>
          <el-form-item label="图片" prop="pictures">
            <el-upload action="/pf/file/upload" list-type="picture-card" :on-preview="handlePicturePreview" 
              :on-remove="handlePictureRemove" :on-success="handlePcitureSuccess" :file-list="product.pictures">
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitUpdate()">修改</el-button>
          </el-form-item>
        </el-form>
        <el-dialog :visible.sync="dialogVisible" size="tiny">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  data () {
    return {
      type: 'add',
      editableTabsValue: '0',
      tableLoading: false,
      addTabLoading: true,
      updateTabLoading: true,
      tableData: [],
      addTabDisabled: true,
      updateTabDisabled: true,
      tablePage: 1,
      tableTotal: 0,
      param: null,
      dialogImageUrl: '',
      dialogVisible: false,
      discount: [
        {name: '无折扣', value: 1},{name: '9.5折', value: 0.95},{name: '9折', value: 0.9},{name: '8.5折', value: 0.85},{name: '8折', value: 0.8},
        {name: '7.5折', value: 0.75},{name: '7折', value: 0.7},{name: '6.5折', value: 0.65},{name: '6折', value: 0.6},{name: '5.5折', value: 0.55},
        {name: '5折', value: 0.5}
      ],
      productType: [
        {name: '烘焙面包', value: 1}, {name: '新鲜蛋糕', value: 2}, {name: '手工泡芙', value: 3},
        {name: '精制点心', value: 4}, {name: '手工定制', value: 5}
      ],
      newProduct: {
        productId: '',
        productName: '',
        typeId: '',
        price: '',
        discount: '',
        salePrice: '',
        available: '',
        description: '',
        stock: '',
        pictureIds: []
      },
      product: {
        productId: '',
        productName: '',
        typeId: '',
        price: '',
        discount: '',
        salePrice: '',
        available: '',
        description: '',
        stock: '',
        pictureIds: [],
        pictures: []
      },
      addProductRules: {
        productName: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入原价', trigger: 'blur' }
        ],
        stock: [
          { required: true, message: '请输入库存量', trigger: 'blur' }
        ],
        discount: [
          { required: true, message: '请选择折扣', trigger: 'blur' }
        ],
        typeId: [
          { required: true, message: '请选择分类', trigger: 'blur' }
        ]
      },
      updateProductRules: {
        productName: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入原价', trigger: 'blur' }
        ],
        stock: [
          { required: true, message: '请输入库存量', trigger: 'blur' }
        ],
        discount: [
          { required: true, message: '请选择折扣', trigger: 'blur' }
        ],
        typeId: [
          { required: true, message: '请选择分类', trigger: 'blur' }
        ]
      }
    }
  },
  created: function () {
    this.findList(this.tablePage, this.param);
  },
  methods: {
    findList: function (pageNumber, param) {
      var me = this;
      me.tableLoading = true;
      var param = {
        pageNumber: pageNumber,
        pageSize: 10,
        param: param
      }
      $.ajax({
        url: "/pf/product/list",
        type: "post",
        data: JSON.stringify(param),
        contentType: "application/json",
        success: function (data) {
          me.tablePage = data.pageNo;
          me.tableTotal = data.totalRecord;
          var result = [];
          for (let i = 0; i < data.results.length; i++) {
            var obj = {};
            obj.id = data.results[i].productId;
            obj.productName = data.results[i].productName;
            obj.available = data.results[i].available;
            obj.price = data.results[i].price;
            obj.stock = data.results[i].stock;
            obj.discount = data.results[i].discount;
            obj.salePrice = data.results[i].salePrice;
            result[i] = obj
          }
          me.tableData = result;
          me.tableLoading = false;
        }
      });
    },
    // 分页
    handleCurrentChange: function (current) {
      this.tablePage = current;
      this.findList(current, this.param);
    },
    // 新增产品切换标签
    addBtnClick: function () {
      this.addTabDisabled = false;
      this.updateTabDisabled = true;
      this.addTabLoading = false;
      this.editableTabsValue = '1';
      this.type = 'add';
    },
    // 自动计算售价
    changeDiscount: function () {
      if (this.type == 'add') {
        var discount = this.newProduct.discount ? this.newProduct.discount : 1;
        var price = this.newProduct.price ? this.newProduct.price : 0;
        this.newProduct.salePrice = (price * discount).toFixed(2);
      } else if (this.type == 'update') {
        var discount = this.product.discount ? this.product.discount : 1;
        var price = this.product.price ? this.product.price : 0;
        this.product.salePrice = (price * discount).toFixed(2);
      }
    },
    // 重置表单
    resetAdd: function () {
      this.$refs.addProductForm.resetFields();
    },
    // 提交添加
    submitAdd: function () {
      var me = this;
      me.$refs.addProductForm.validate((valid) => {
        if (valid) {
          me.addTabLoading = true;
          $.ajax({
            url: '/pf/product/addorupdate',
            type: "post",
            contentType: "application/json",
            data: JSON.stringify(me.newProduct),
            success: function (data) {
              me.$message({
                showClose: true,
                message: data.message,
                type: data.status.toLowerCase()
              });
              me.editableTabsValue = '0';
              me.findList(1, null);
              me.resetAdd();
              me.addTabLoading = false;
              this.addTabDisabled = true;
            },
            error: function () {
              me.addTabLoading = false;
            }
          });
        }
      })
    },
    aaa: function () {
      console.log(this.product);
    },
    // 编辑获取
    editRow: function (scope) {
      var id = scope.row.id;
      var me = this;
      me.editableTabsValue = '2';
      me.updateTabLoading = true;
      me.addTabDisabled = true;
      me.updateTabDisabled = false;
      $.ajax({
        url: '/pf/product/one/' + id,
        type: "get",
        contentType: "application/json",
        success: function (data) {
          me.product.productId = data.data.productId;
          me.product.productName = data.data.productName;
          me.product.discount = data.data.discount;
          me.product.price = data.data.price;
          me.product.stock = data.data.stock;
          me.product.salePrice = data.data.salePrice;
          me.product.description = data.data.description;
          me.product.available = data.data.available;
          me.product.typeId = data.data.typeId;
          console.log(me.product);
          // 图片列表
          var pics = [];
          var picIds = [];
          for (var i = 0; i < data.data.pictures.length; i ++) {
            var pic = {
              id: data.data.pictures[i].fileId,
              name: data.data.pictures[i].fileName,
              url: '/pf/' + data.data.pictures[i].path
            }
            pics.push(pic);
            picIds.push(data.data.pictures[i].fileId);
          }
          me.product.pictures = pics;
          me.product.pictureIds = picIds;
          me.updateTabLoading = false;
          me.type = 'update';
        },
        error: function () {
          me.updateTabLoading = false;
        }
      });
    },
    // 提交修改
    submitUpdate: function () {
      var me = this;
      me.$refs.updateProductForm.validate((valid) => {
        if (valid) {
          $.ajax({
            url: '/pf/product/addorupdate',
            type: "post",
            contentType: "application/json",
            data: JSON.stringify(me.product),
            success: function (data) {
              me.$message({
                showClose: true,
                message: data.message,
                type: data.status.toLowerCase()
              });
              me.editableTabsValue = '0';
              me.findList(me.tablePage, me.param);
              this.updateTabDisabled = true;
            },
            error: function () {}
          });
        }
      })
    },
    // 单个删除
    deleteRow: function (scope) {
      var id = scope.row.id;
      var me = this;
      me.tableLoading = true;
      $.ajax({
        url: '/pf/product/delete/' + id,
        type: "get",
        contentType: "application/json",
        success: function (data) {
          me.$message({
            showClose: true,
            message: data.message,
            type: data.status.toLowerCase()
          });
          me.findList(me.tablePage, me.param);
          me.tableLoading = false;
        },
        error: function () {
          me.tableLoading = false;
        }
      });
    },
    // 删除图片
    handlePictureRemove: function (file, fileList) {
      if (this.type == 'add') {
        this.newProduct.pictureIds.splice($.inArray(file.response.data[0], this.newProduct.pictures), 1);
      } else if (this.type == 'update') {
        this.product.pictureIds.splice($.inArray(file.id, this.product.pictures), 1);
      }
    },
    // 弹层预览
    handlePicturePreview: function (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 处理图片上传后的返回图片ID
    handlePcitureSuccess: function (response, file, fileList) {
      var fileIds = [];
      for (var i = 0; i < fileList.length; i ++) {
        fileIds.push(fileList[i].response.data[0]);
      }
      if (this.type == 'add') {
        this.newProduct.pictureIds = fileIds;
      } else if (this.type == 'update') {
        this.product.pictureIds = fileIds;
      }
    }
  }
}
</script>