<template>
<div v-if="errorLogs.length > 0" class="errorLogContainer">
    <el-badge :is-dot="true" class="errorLog-badge" @click.native="dialogTableVisible=true">
        <el-button class="errorLog-button" size="small" type="danger">
            <i class="el-icon-s-opportunity"></i>
        </el-button>
    </el-badge>
     <el-dialog :visible.sync="dialogTableVisible" width="80%" append-to-body>
      <div slot="title">
        <span style="padding-right: 10px;">Error Log</span>
        <el-button size="mini" type="primary" icon="el-icon-delete" @click="clearAll">Clear All</el-button>
      </div>
      <el-table :data="errorLogs" border>
        <el-table-column label="Message">
          <template slot-scope="{row}">
            <div>
              <span class="message-title" style="padding-right: 10px;">Msg: </span>
              <el-tag type="danger">
                {{ row.err.message }}
              </el-tag>
            </div>
            <br>
            <div>
              <span class="message-title" style="padding-right: 10px;">Info: </span>
              <el-tag type="warning">
                {{ row.vm.$vnode.tag }} error in {{ row.info }}
              </el-tag>
            </div>
            <br>
            <div>
              <span class="message-title" style="padding-right: 16px;">Url: </span>
              <el-tag type="success">
                {{ row.url }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Stack">
          <template slot-scope="scope">
            {{ scope.row.err.stack }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ErrorLog',
  components: {},
  data () {
    return {
      dialogTableVisible: false
    }
  },
  computed: {
    // errorLogs () {
    //   return this.$store.getters.errorLogs
    // }
    ...mapGetters([
      'errorLogs'
    ])
  },
  watch: {},
  methods: {
    clearAll () {
      this.dialogTableVisible = false
      this.$store.dispatch('errorLog/clearErrorLog')
    }
  },
  created () {

  },
  mounted () {

  }
}
</script>
<style  scoped lang="scss">
.errorLogContainer{
  .errorLog-badge{
    line-height:25px;
    margin-top: -5px;
    .errorLog-button{
      padding: 8px 10px;
    }
  }
}
</style>
